import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseOrderStatus, StockMovementType } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { ProcurementRealtimeGateway } from '@/modules/procurement/gateways/procurement-realtime.gateway';

import type { CreateGrnSchema, CreatePoSchema } from '@tungaos/shared';

@Injectable()
export class ProcPoService {
  constructor(
    private prisma: PrismaService,
    private realtime: ProcurementRealtimeGateway,
  ) {}

  async list(hotelId: string) {
    const orders = await this.prisma.purchaseOrder.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        vendor: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return orders.map((o) => ({
      id: o.id,
      poNumber: o.poNumber,
      vendorName: o.vendor?.name ?? '—',
      status: o.status,
      totalAmount: Number(o.totalAmount),
      expectedDate: o.expectedDate?.toISOString() ?? null,
      itemCount: o._count.items,
      createdAt: o.createdAt.toISOString(),
    }));
  }

  async create(hotelId: string, dto: CreatePoSchema, userId?: string) {
    const vendor = await this.prisma.vendor.findFirst({ where: { id: dto.vendorId, hotelId } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.isBlacklisted) throw new BadRequestException('Vendor is blacklisted');

    const supplier = await this.prisma.supplier.findFirst({ where: { hotelId, code: vendor.code } });
    if (!supplier) throw new BadRequestException('Supplier record missing for vendor');

    const count = await this.prisma.purchaseOrder.count({ where: { hotelId } });
    const poNumber = `PO-${String(count + 1).padStart(5, '0')}`;

    let subtotal = 0;
    let gstTotal = 0;
    const lineItems = dto.items.map((i) => {
      const base = i.quantity * i.unitPrice - i.discount;
      const gst = (base * i.gstRate) / 100;
      const total = base + gst;
      subtotal += base;
      gstTotal += gst;
      return { ...i, totalAmount: total };
    });

    const order = await this.prisma.purchaseOrder.create({
      data: {
        hotelId,
        supplierId: supplier.id,
        vendorId: dto.vendorId,
        poNumber,
        status: PurchaseOrderStatus.PENDING_APPROVAL,
        expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : undefined,
        deliveryAddress: dto.deliveryAddress,
        paymentTerms: dto.paymentTerms ?? vendor.paymentTerms,
        gstAmount: gstTotal,
        totalAmount: subtotal + gstTotal,
        notes: dto.notes,
        createdBy: userId,
        items: {
          create: lineItems.map((i) => ({
            hotelId,
            itemId: i.itemId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            discount: i.discount,
            gstRate: i.gstRate,
            totalAmount: i.totalAmount,
            createdBy: userId,
          })),
        },
      },
    });

    this.realtime.emitPoUpdate(hotelId, order.id);
    return order;
  }

  async approve(hotelId: string, id: string, userId?: string) {
    const order = await this.prisma.purchaseOrder.findFirst({ where: { id, hotelId } });
    if (!order) throw new NotFoundException('PO not found');

    await this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: PurchaseOrderStatus.APPROVED, approvedById: userId, approvedAt: new Date() },
    });
    this.realtime.emitPoUpdate(hotelId, id);
    return { approved: true };
  }

  async send(hotelId: string, id: string) {
    await this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: PurchaseOrderStatus.SENT, sentAt: new Date() },
    });
    this.realtime.emitPoUpdate(hotelId, id);
    return { sent: true };
  }
}

@Injectable()
export class ProcGrnService {
  constructor(
    private prisma: PrismaService,
    private realtime: ProcurementRealtimeGateway,
  ) {}

  async list(hotelId: string) {
    const rows = await this.prisma.goodsReceiptNote.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        vendor: { select: { name: true } },
        order: { select: { poNumber: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((g) => ({
      id: g.id,
      grnNumber: g.grnNumber,
      vendorName: g.vendor?.name ?? '—',
      poNumber: g.order?.poNumber ?? null,
      status: g.status,
      inspectionStatus: g.inspectionStatus,
      itemCount: g._count.items,
      receivedDate: g.receivedDate.toISOString(),
    }));
  }

  async create(hotelId: string, dto: CreateGrnSchema, userId?: string) {
    const order = await this.prisma.purchaseOrder.findFirst({
      where: { id: dto.orderId, hotelId },
      include: { vendor: true },
    });
    if (!order) throw new NotFoundException('PO not found');

    const count = await this.prisma.goodsReceiptNote.count({ where: { hotelId } });
    const grnNumber = `GRN-${String(count + 1).padStart(5, '0')}`;

    const mainStore = await this.prisma.inventoryStore.findFirst({
      where: { hotelId, storeType: 'MAIN' },
    });

    return this.prisma.goodsReceiptNote.create({
      data: {
        hotelId,
        supplierId: order.supplierId,
        vendorId: order.vendorId,
        storeId: dto.storeId ?? mainStore?.id,
        orderId: dto.orderId,
        grnNumber,
        receiverId: userId,
        notes: dto.notes,
        items: {
          create: dto.items.map((i) => ({
            hotelId,
            itemId: i.itemId,
            quantity: i.quantity,
            acceptedQty: i.acceptedQty ?? i.quantity,
            rejectedQty: i.rejectedQty ?? 0,
            unitPrice: i.unitPrice ?? 0,
            batchNumber: i.batchNumber,
            expiryDate: i.expiryDate ? new Date(i.expiryDate) : undefined,
            createdBy: userId,
          })),
        },
      },
    });
  }

  async inspect(hotelId: string, id: string, approved: boolean, notes?: string) {
    await this.prisma.goodsReceiptNote.update({
      where: { id },
      data: {
        inspectionStatus: approved ? 'APPROVED' : 'REJECTED',
        inspectionNotes: notes,
        status: approved ? 'ACCEPTED' : 'REJECTED',
      },
    });
    this.realtime.emitGrnUpdate(hotelId, id);
    return { inspected: true, approved };
  }

  async post(hotelId: string, id: string, userId?: string) {
    const grn = await this.prisma.goodsReceiptNote.findFirst({
      where: { id, hotelId },
      include: { items: true, store: true },
    });
    if (!grn) throw new NotFoundException('GRN not found');
    if (grn.status === 'POSTED') throw new BadRequestException('GRN already posted');

    const storeId = grn.storeId;
    if (!storeId) throw new BadRequestException('Store not assigned to GRN');

    for (const line of grn.items) {
      const qty = Number(line.acceptedQty);
      if (qty <= 0) continue;
      const cost = Number(line.unitPrice);

      const existing = await this.prisma.stockBalance.findUnique({
        where: { storeId_itemId: { storeId, itemId: line.itemId } },
      });
      const newQty = Number(existing?.quantity ?? 0) + qty;

      if (existing) {
        await this.prisma.stockBalance.update({
          where: { id: existing.id },
          data: { quantity: newQty, averageCost: cost, lastMovement: new Date() },
        });
      } else {
        await this.prisma.stockBalance.create({
          data: { hotelId, storeId, itemId: line.itemId, quantity: qty, averageCost: cost, lastMovement: new Date() },
        });
      }

      await this.prisma.inventoryItem.update({
        where: { id: line.itemId },
        data: { currentStock: { increment: qty }, costPrice: cost },
      });

      await this.prisma.stockMovement.create({
        data: {
          hotelId,
          itemId: line.itemId,
          storeId,
          type: StockMovementType.RECEIPT,
          quantity: qty,
          balanceAfter: newQty,
          unitCost: cost,
          batchNumber: line.batchNumber,
          reference: grn.grnNumber,
          referenceId: grn.id,
          createdBy: userId,
        },
      });

      if (line.batchNumber) {
        await this.prisma.stockBatch.upsert({
          where: {
            hotelId_storeId_itemId_batchNumber: {
              hotelId,
              storeId,
              itemId: line.itemId,
              batchNumber: line.batchNumber,
            },
          },
          create: {
            hotelId,
            storeId,
            itemId: line.itemId,
            batchNumber: line.batchNumber,
            quantity: qty,
            remainingQty: qty,
            unitCost: cost,
            expiryDate: line.expiryDate,
          },
          update: { remainingQty: { increment: qty } },
        });
      }

      if (grn.orderId) {
        const poItem = await this.prisma.purchaseOrderItem.findFirst({
          where: { orderId: grn.orderId, itemId: line.itemId },
        });
        if (poItem) {
          await this.prisma.purchaseOrderItem.update({
            where: { id: poItem.id },
            data: { receivedQty: { increment: qty } },
          });
        }
      }
    }

    if (grn.orderId) {
      const order = await this.prisma.purchaseOrder.findFirst({
        where: { id: grn.orderId },
        include: { items: true },
      });
      if (order) {
        const fullyReceived = order.items.every((i) => Number(i.receivedQty) >= Number(i.quantity));
        const partial = order.items.some((i) => Number(i.receivedQty) > 0);
        await this.prisma.purchaseOrder.update({
          where: { id: grn.orderId },
          data: {
            status: fullyReceived ? PurchaseOrderStatus.FULLY_RECEIVED : partial ? PurchaseOrderStatus.PARTIALLY_RECEIVED : order.status,
          },
        });
      }
    }

    await this.prisma.goodsReceiptNote.update({ where: { id }, data: { status: 'POSTED' } });
    this.realtime.emitGrnUpdate(hotelId, id);
    return { posted: true };
  }
}
