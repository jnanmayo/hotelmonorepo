import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BillStatus, KitchenOrderStatus, TableStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { RestaurantRealtimeGateway } from '@/modules/restaurant/gateways/restaurant-realtime.gateway';
import { PmsCheckOutService } from '@/modules/pms/services/pms-checkout.service';

import type {
  AddBillItemSchema,
  CloseBillSchema,
  CreateBillSchema,
  CreateMenuItemSchema,
  CreateTableSchema,
  RoomServiceOrderSchema,
} from '@tungaos/shared';

@Injectable()
export class FnbPosService {
  constructor(
    private prisma: PrismaService,
    private realtime: RestaurantRealtimeGateway,
    private checkout: PmsCheckOutService,
  ) {}

  async listBills(hotelId: string, status?: BillStatus) {
    const bills = await this.prisma.bill.findMany({
      where: { hotelId, deletedAt: null, ...(status ? { status } : {}) },
      include: {
        table: true,
        guest: true,
        items: true,
        restaurant: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const roomIds = bills.map((b) => b.roomId).filter(Boolean) as string[];
    const rooms = roomIds.length
      ? await this.prisma.room.findMany({ where: { id: { in: roomIds } }, select: { id: true, roomNumber: true } })
      : [];
    const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));

    return bills.map((b) => ({
      id: b.id,
      billNumber: b.billNumber,
      status: b.status,
      orderType: b.orderType,
      tableNumber: b.table?.tableNumber ?? null,
      roomNumber: b.roomId ? roomMap[b.roomId] ?? null : null,
      guestName: b.guest ? `${b.guest.firstName} ${b.guest.lastName}` : null,
      subtotal: Number(b.subtotal),
      taxAmount: Number(b.taxAmount),
      totalAmount: Number(b.totalAmount),
      itemCount: b.items.length,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  async createBill(hotelId: string, input: CreateBillSchema, userId?: string) {
    const count = await this.prisma.bill.count({ where: { hotelId } });
    const billNumber = `BL-${String(count + 1).padStart(6, '0')}`;

    const bill = await this.prisma.bill.create({
      data: {
        hotelId,
        restaurantId: input.restaurantId,
        tableId: input.tableId,
        guestId: input.guestId,
        reservationId: input.reservationId,
        roomId: input.roomId,
        orderType: input.orderType,
        waiterId: input.waiterId,
        billNumber,
        createdBy: userId,
      },
    });

    if (input.tableId) {
      await this.prisma.restaurantTable.update({
        where: { id: input.tableId },
        data: { isOccupied: true, tableStatus: TableStatus.OCCUPIED },
      });
      this.realtime.emit(hotelId, {
        type: 'table:updated',
        hotelId,
        payload: { tableId: input.tableId },
        timestamp: new Date().toISOString(),
      });
    }

    this.notify(hotelId, 'bill:updated', { billId: bill.id });
    return bill;
  }

  async addItem(hotelId: string, billId: string, input: AddBillItemSchema, userId?: string) {
    const bill = await this.requireOpenBill(hotelId, billId);
    const menuItem = await this.prisma.menuItem.findFirst({
      where: { id: input.menuItemId, hotelId, isAvailable: true, deletedAt: null },
    });
    if (!menuItem) throw new NotFoundException('Menu item not found');

    const unitPrice = Number(menuItem.price);
    const taxRate = Number(menuItem.gstRate ?? 5);
    const lineTotal = unitPrice * input.quantity;
    const taxAmount = Math.round(lineTotal * (taxRate / 100) * 100) / 100;

    await this.prisma.billItem.create({
      data: {
        hotelId,
        billId,
        menuItemId: menuItem.id,
        description: menuItem.name,
        quantity: input.quantity,
        unitPrice,
        taxAmount,
        totalAmount: lineTotal + taxAmount,
        customizations: input.customizations ?? input.notes ? { notes: input.notes, ...input.customizations } : undefined,
        createdBy: userId,
      },
    });

    await this.recalculateBill(billId);
    await this.createKitchenOrder(hotelId, bill, userId);
    this.notify(hotelId, 'order:created', { billId });
    return this.getBill(hotelId, billId);
  }

  async closeBill(hotelId: string, billId: string, input: CloseBillSchema, userId?: string) {
    const bill = await this.requireOpenBill(hotelId, billId);
    const updated = await this.recalculateBill(billId, input.discountAmount, input.tipAmount);

    if (input.chargeToRoom && bill.reservationId) {
      await this.checkout.postRestaurantCharge(
        hotelId,
        bill.reservationId,
        Number(updated.totalAmount),
        `Restaurant bill ${bill.billNumber}`,
        bill.id,
      );
    }

    await this.prisma.bill.update({
      where: { id: billId },
      data: { status: BillStatus.CLOSED, closedAt: new Date(), updatedBy: userId },
    });

    if (bill.tableId) {
      await this.prisma.restaurantTable.update({
        where: { id: bill.tableId },
        data: { isOccupied: false, tableStatus: TableStatus.AVAILABLE },
      });
    }

    this.notify(hotelId, 'bill:updated', { billId, status: 'CLOSED' });
    return updated;
  }

  async roomServiceOrder(hotelId: string, input: RoomServiceOrderSchema, userId?: string) {
    const bill = await this.createBill(
      hotelId,
      {
        restaurantId: input.restaurantId,
        reservationId: input.reservationId,
        roomId: input.roomId,
        orderType: 'ROOM_SERVICE',
      },
      userId,
    );

    for (const item of input.items) {
      await this.addItem(hotelId, bill.id, item, userId);
    }

    return this.getBill(hotelId, bill.id);
  }

  async getBill(hotelId: string, billId: string) {
    const bill = await this.prisma.bill.findFirst({
      where: { id: billId, hotelId, deletedAt: null },
      include: { items: true, table: true, guest: true, restaurant: true },
    });
    if (!bill) throw new NotFoundException('Bill not found');
    return bill;
  }

  private async createKitchenOrder(hotelId: string, bill: { id: string; restaurantId: string | null; orderType: string; roomId: string | null }, userId?: string) {
    const items = await this.prisma.billItem.findMany({
      where: { billId: bill.id, deletedAt: null },
      include: { menuItem: true },
    });
    if (!items.length) return;

    let order = await this.prisma.kitchenOrder.findFirst({
      where: { billId: bill.id, status: { not: KitchenOrderStatus.CANCELLED }, deletedAt: null },
    });

    if (!order) {
      const count = await this.prisma.kitchenOrder.count({ where: { hotelId } });
      order = await this.prisma.kitchenOrder.create({
        data: {
          hotelId,
          billId: bill.id,
          restaurantId: bill.restaurantId,
          orderType: bill.orderType as 'DINE_IN',
          roomId: bill.roomId,
          orderNumber: `KOT-${String(count + 1).padStart(6, '0')}`,
          priority: bill.orderType === 'ROOM_SERVICE' ? 'HIGH' : 'MEDIUM',
          createdBy: userId,
        },
      });
    }

    const existingItemIds = new Set(
      (await this.prisma.kitchenOrderItem.findMany({ where: { orderId: order.id } })).map((i) => i.menuItemId),
    );

    for (const item of items) {
      if (item.menuItemId && !existingItemIds.has(item.menuItemId)) {
        await this.prisma.kitchenOrderItem.create({
          data: {
            hotelId,
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.customizations ? JSON.stringify(item.customizations) : undefined,
            createdBy: userId,
          },
        });
      }
    }
  }

  private async recalculateBill(billId: string, discountAmount = 0, tipAmount = 0) {
    const items = await this.prisma.billItem.findMany({ where: { billId, deletedAt: null } });
    const subtotal = items.reduce((s, i) => s + Number(i.unitPrice) * i.quantity, 0);
    const taxAmount = items.reduce((s, i) => s + Number(i.taxAmount), 0);
    const totalAmount = subtotal + taxAmount - discountAmount + tipAmount;

    return this.prisma.bill.update({
      where: { id: billId },
      data: { subtotal, taxAmount, discountAmount, tipAmount, totalAmount },
    });
  }

  private async requireOpenBill(hotelId: string, billId: string) {
    const bill = await this.prisma.bill.findFirst({ where: { id: billId, hotelId, deletedAt: null } });
    if (!bill) throw new NotFoundException('Bill not found');
    if (bill.status !== BillStatus.OPEN) throw new BadRequestException('Bill is not open');
    return bill;
  }

  private notify(hotelId: string, type: import('@tungaos/shared').FnbRealtimeEvent['type'], payload: Record<string, unknown>) {
    this.realtime.emit(hotelId, { type, hotelId, payload, timestamp: new Date().toISOString() });
    this.realtime.notifyDashboard(hotelId);
  }
}

@Injectable()
export class FnbOutletService {
  constructor(private prisma: PrismaService) {}

  async listOutlets(hotelId: string) {
    const outlets = await this.prisma.restaurant.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: { _count: { select: { tables: true, menuItems: true } } },
    });
    return outlets.map((o) => ({
      id: o.id,
      name: o.name,
      code: o.code,
      outletType: o.outletType,
      location: o.location,
      tableCount: o._count.tables,
      menuItemCount: o._count.menuItems,
    }));
  }

  async seedDefaults(hotelId: string, userId?: string) {
    const existing = await this.prisma.restaurant.count({ where: { hotelId, deletedAt: null } });
    if (existing > 0) return this.listOutlets(hotelId);

    const outlets = [
      { name: 'Main Restaurant', code: 'REST', outletType: 'RESTAURANT', cuisine: 'Multi-Cuisine' },
      { name: 'Poolside Cafe', code: 'CAFE', outletType: 'CAFE', cuisine: 'Light Bites' },
      { name: 'Sky Bar', code: 'BAR', outletType: 'BAR', cuisine: 'Cocktails & Spirits' },
    ];

    for (const o of outlets) {
      const restaurant = await this.prisma.restaurant.create({
        data: { hotelId, ...o, createdBy: userId },
      });

      const categories = ['Starters', 'Main Course', 'Beverages', 'Desserts'];
      for (let i = 0; i < categories.length; i++) {
        const cat = await this.prisma.menuCategory.create({
          data: { hotelId, restaurantId: restaurant.id, name: categories[i]!, sortOrder: i, createdBy: userId },
        });

        if (categories[i] === 'Main Course') {
          await this.prisma.menuItem.create({
            data: {
              hotelId,
              restaurantId: restaurant.id,
              categoryId: cat.id,
              name: 'Chef Special Thali',
              code: `${o.code}-THALI`,
              price: 450,
              cost: 150,
              itemType: 'FOOD',
              prepTimeMins: 25,
              createdBy: userId,
            },
          });
        }
      }

      for (let t = 1; t <= 6; t++) {
        await this.prisma.restaurantTable.create({
          data: {
            hotelId,
            restaurantId: restaurant.id,
            tableNumber: String(t),
            capacity: t <= 2 ? 2 : 4,
            zone: t <= 3 ? 'Indoor' : 'Outdoor',
            createdBy: userId,
          },
        });
      }
    }

    return this.listOutlets(hotelId);
  }

  async listTables(hotelId: string, restaurantId?: string) {
    const tables = await this.prisma.restaurantTable.findMany({
      where: { hotelId, isActive: true, deletedAt: null, ...(restaurantId ? { restaurantId } : {}) },
      include: { restaurant: true, bills: { where: { status: BillStatus.OPEN, deletedAt: null }, take: 1 } },
      orderBy: [{ restaurantId: 'asc' }, { tableNumber: 'asc' }],
    });

    return tables.map((t) => ({
      id: t.id,
      tableNumber: t.tableNumber,
      capacity: t.capacity,
      zone: t.zone,
      tableStatus: t.tableStatus,
      isOccupied: t.isOccupied,
      isVip: t.isVip,
      restaurantName: t.restaurant.name,
      restaurantId: t.restaurantId,
      openBillId: t.bills[0]?.id ?? null,
    }));
  }

  async createTable(hotelId: string, input: CreateTableSchema, userId?: string) {
    return this.prisma.restaurantTable.create({
      data: { hotelId, ...input, createdBy: userId },
    });
  }

  async listMenu(hotelId: string, restaurantId?: string) {
    const items = await this.prisma.menuItem.findMany({
      where: { hotelId, isActive: true, deletedAt: null, ...(restaurantId ? { restaurantId } : {}) },
      include: { category: true },
      orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
    });

    return items.map((i) => ({
      id: i.id,
      name: i.name,
      code: i.code,
      price: Number(i.price),
      categoryName: i.category.name,
      itemType: i.itemType,
      isAvailable: i.isAvailable,
      prepTimeMins: i.prepTimeMins,
      imageUrl: i.imageUrl,
      restaurantId: i.restaurantId,
      categoryId: i.categoryId,
    }));
  }

  async createMenuItem(hotelId: string, input: CreateMenuItemSchema, userId?: string) {
    return this.prisma.menuItem.create({ data: { hotelId, ...input, createdBy: userId } });
  }
}

@Injectable()
export class FnbKitchenService {
  constructor(
    private prisma: PrismaService,
    private realtime: RestaurantRealtimeGateway,
  ) {}

  async listOrders(hotelId: string, status?: KitchenOrderStatus) {
    const orders = await this.prisma.kitchenOrder.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(status ? { status } : { status: { not: KitchenOrderStatus.CANCELLED } }),
      },
      include: {
        items: { include: { menuItem: true } },
        bill: { include: { table: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      take: 100,
    });

    const roomIds = orders.map((o) => o.roomId).filter(Boolean) as string[];
    const rooms = roomIds.length
      ? await this.prisma.room.findMany({ where: { id: { in: roomIds } }, select: { id: true, roomNumber: true } })
      : [];
    const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));

    const now = Date.now();

    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      orderType: o.orderType,
      priority: o.priority,
      tableNumber: o.bill?.table?.tableNumber ?? null,
      roomNumber: o.roomId ? roomMap[o.roomId] ?? null : null,
      itemCount: o.items.length,
      items: o.items.map((i) => ({
        name: i.menuItem.name,
        quantity: i.quantity,
        status: i.status,
        notes: i.notes,
      })),
      createdAt: o.createdAt.toISOString(),
      isDelayed: (now - o.createdAt.getTime()) / 60000 > 20 && o.status !== KitchenOrderStatus.READY,
    }));
  }

  async updateStatus(hotelId: string, orderId: string, status: KitchenOrderStatus, userId?: string) {
    const order = await this.prisma.kitchenOrder.findFirst({ where: { id: orderId, hotelId, deletedAt: null } });
    if (!order) throw new NotFoundException('Kitchen order not found');

    await this.prisma.kitchenOrder.update({
      where: { id: orderId },
      data: { status, updatedBy: userId },
    });

    await this.prisma.kitchenOrderItem.updateMany({
      where: { orderId },
      data: { status },
    });

    const eventType =
      status === KitchenOrderStatus.READY ? 'order:ready' :
      status === KitchenOrderStatus.SERVED ? 'order:served' :
      status === KitchenOrderStatus.CANCELLED ? 'order:cancelled' : 'order:updated';

    this.realtime.emit(hotelId, {
      type: eventType,
      hotelId,
      payload: { orderId, status },
      timestamp: new Date().toISOString(),
    });
    this.realtime.notifyDashboard(hotelId);

    return { orderId, status };
  }
}

@Injectable()
export class FnbReportService {
  constructor(private prisma: PrismaService) {}

  async generate(hotelId: string, type: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (type) {
      case 'sales': {
        const bills = await this.prisma.bill.findMany({
          where: { hotelId, deletedAt: null, createdAt: { gte: today } },
          include: { items: true },
        });
        return { type, generatedAt: new Date().toISOString(), data: bills };
      }
      case 'kitchen': {
        const orders = await this.prisma.kitchenOrder.findMany({
          where: { hotelId, deletedAt: null, createdAt: { gte: today } },
        });
        return { type, generatedAt: new Date().toISOString(), data: orders };
      }
      case 'room-service': {
        const rs = await this.prisma.bill.findMany({
          where: { hotelId, deletedAt: null, orderType: 'ROOM_SERVICE', createdAt: { gte: today } },
        });
        return { type, generatedAt: new Date().toISOString(), data: rs };
      }
      default:
        return { type, generatedAt: new Date().toISOString(), data: [] };
    }
  }
}
