import { Injectable, NotFoundException } from '@nestjs/common';
import { LaundryStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { HousekeepingRealtimeGateway } from '@/modules/housekeeping/gateways/housekeeping-realtime.gateway';

import type { CreateLaundryOrderSchema, UpdateLaundryStatusSchema } from '@tungaos/shared';

@Injectable()
export class HkLaundryService {
  constructor(
    private prisma: PrismaService,
    private realtime: HousekeepingRealtimeGateway,
  ) {}

  async listOrders(hotelId: string) {
    const orders = await this.prisma.laundryOrder.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: { room: { select: { roomNumber: true } }, items: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      roomNumber: o.room?.roomNumber ?? null,
      status: o.status,
      totalAmount: Number(o.totalAmount),
      itemCount: o.items.length,
      collectedAt: o.collectedAt?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
    }));
  }

  async createOrder(hotelId: string, input: CreateLaundryOrderSchema, userId?: string) {
    const count = await this.prisma.laundryOrder.count({ where: { hotelId } });
    const orderNumber = `LDY-${String(count + 1).padStart(5, '0')}`;
    const totalAmount = input.items.reduce((s, i) => s + i.quantity * i.rate, 0);

    const order = await this.prisma.laundryOrder.create({
      data: {
        hotelId,
        roomId: input.roomId,
        guestId: input.guestId,
        orderNumber,
        totalAmount,
        notes: input.notes,
        collectedAt: new Date(),
        createdBy: userId,
        items: {
          create: input.items.map((item) => ({
            hotelId,
            itemName: item.itemName,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
            serviceType: item.serviceType,
            createdBy: userId,
          })),
        },
      },
      include: { items: true },
    });

    this.realtime.emit(hotelId, {
      type: 'laundry:update',
      hotelId,
      payload: { orderId: order.id },
      timestamp: new Date().toISOString(),
    });

    return order;
  }

  async updateStatus(hotelId: string, orderId: string, input: UpdateLaundryStatusSchema) {
    const order = await this.prisma.laundryOrder.findFirst({ where: { id: orderId, hotelId, deletedAt: null } });
    if (!order) throw new NotFoundException('Laundry order not found');

    const updated = await this.prisma.laundryOrder.update({
      where: { id: orderId },
      data: {
        status: input.status as LaundryStatus,
        deliveredAt: input.status === 'DELIVERED' ? new Date() : undefined,
      },
    });

    this.realtime.emit(hotelId, {
      type: 'laundry:update',
      hotelId,
      payload: { orderId, status: input.status },
      timestamp: new Date().toISOString(),
    });

    return updated;
  }
}

@Injectable()
export class HkLinenService {
  constructor(private prisma: PrismaService) {}

  async list(hotelId: string) {
    const items = await this.prisma.linenInventory.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      orderBy: { category: 'asc' },
    });
    return items.map((i) => ({
      id: i.id,
      itemName: i.itemName,
      category: i.category,
      totalQuantity: i.totalQuantity,
      available: i.available,
      inLaundry: i.inLaundry,
      damaged: i.damaged,
      lost: i.lost,
      status: i.status,
    }));
  }

  async seedDefaults(hotelId: string) {
    const defaults = [
      { itemName: 'Bed Sheets', category: 'Bedding', totalQuantity: 200, available: 150, inLaundry: 50 },
      { itemName: 'Pillow Covers', category: 'Bedding', totalQuantity: 300, available: 220, inLaundry: 80 },
      { itemName: 'Towels', category: 'Bath', totalQuantity: 400, available: 300, inLaundry: 100 },
      { itemName: 'Bathrobes', category: 'Bath', totalQuantity: 80, available: 60, inLaundry: 20 },
      { itemName: 'Curtains', category: 'Room', totalQuantity: 50, available: 45, inLaundry: 5 },
    ];

    for (const d of defaults) {
      await this.prisma.linenInventory.upsert({
        where: { hotelId_itemName: { hotelId, itemName: d.itemName } },
        create: { hotelId, ...d },
        update: {},
      });
    }

    return this.list(hotelId);
  }
}

@Injectable()
export class HkSupportService {
  constructor(private prisma: PrismaService) {}

  async listLostFound(hotelId: string) {
    const items = await this.prisma.lostAndFoundItem.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      orderBy: { foundAt: 'desc' },
      take: 100,
    });

    const roomIds = items.map((i) => i.roomId).filter(Boolean) as string[];
    const rooms = roomIds.length
      ? await this.prisma.room.findMany({ where: { id: { in: roomIds } }, select: { id: true, roomNumber: true } })
      : [];
    const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));

    return items.map((i) => ({
      id: i.id,
      itemName: i.itemName,
      roomNumber: i.roomId ? roomMap[i.roomId] ?? null : null,
      guestName: i.guestName,
      foundBy: i.foundBy,
      status: i.status,
      foundAt: i.foundAt.toISOString(),
    }));
  }

  async createLostFound(hotelId: string, input: import('@tungaos/shared').CreateLostFoundSchema, userId?: string) {
    return this.prisma.lostAndFoundItem.create({
      data: {
        hotelId,
        itemName: input.itemName,
        description: input.description,
        roomId: input.roomId,
        guestName: input.guestName,
        foundBy: input.foundBy,
        location: input.location,
        photoUrl: input.photoUrl,
        createdBy: userId,
      },
    });
  }

  async listGuestRequests(hotelId: string) {
    return this.prisma.guestRequest.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async logAmenityRefill(hotelId: string, input: import('@tungaos/shared').AmenityRefillSchema, userId?: string) {
    return this.prisma.amenityRefillLog.create({
      data: {
        hotelId,
        roomId: input.roomId,
        taskId: input.taskId,
        itemName: input.itemName,
        quantity: input.quantity,
        refilledBy: userId,
      },
    });
  }

  async listDeepCleaning(hotelId: string) {
    return this.prisma.deepCleaningSchedule.findMany({
      where: { hotelId, isActive: true },
      orderBy: { nextDueDate: 'asc' },
    });
  }
}

@Injectable()
export class HkReportService {
  constructor(private prisma: PrismaService) {}

  async generate(hotelId: string, type: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (type) {
      case 'cleaning': {
        const tasks = await this.prisma.housekeepingTask.findMany({
          where: { hotelId, deletedAt: null, createdAt: { gte: today } },
          include: { room: { select: { roomNumber: true } } },
        });
        return { type, generatedAt: new Date().toISOString(), data: tasks };
      }
      case 'staff': {
        const counts = await this.prisma.housekeepingTask.groupBy({
          by: ['assignedStaffId', 'status'],
          where: { hotelId, deletedAt: null, assignedStaffId: { not: null } },
          _count: true,
        });
        return { type, generatedAt: new Date().toISOString(), data: counts };
      }
      case 'laundry': {
        const orders = await this.prisma.laundryOrder.findMany({
          where: { hotelId, deletedAt: null },
          include: { items: true },
        });
        return { type, generatedAt: new Date().toISOString(), data: orders };
      }
      case 'linen': {
        const linen = await this.prisma.linenInventory.findMany({ where: { hotelId, isActive: true } });
        return { type, generatedAt: new Date().toISOString(), data: linen };
      }
      default:
        return { type, generatedAt: new Date().toISOString(), data: [] };
    }
  }
}
