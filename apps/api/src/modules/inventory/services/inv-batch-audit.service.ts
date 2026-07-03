import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditStatus, BatchStatus, PurchaseRequestStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { InventoryRealtimeGateway } from '@/modules/inventory/gateways/inventory-realtime.gateway';

import type { CreateAuditSchema, CreatePurchaseRequestSchema } from '@tungaos/shared';

@Injectable()
export class InvBatchService {
  constructor(private prisma: PrismaService) {}

  async listBatches(hotelId: string, status?: string) {
    const today = new Date();
    const nearExpiry = new Date();
    nearExpiry.setDate(nearExpiry.getDate() + 30);

    const batches = await this.prisma.stockBatch.findMany({
      where: {
        hotelId,
        remainingQty: { gt: 0 },
        ...(status === 'expired' ? { status: BatchStatus.EXPIRED } : {}),
        ...(status === 'near_expiry' ? { expiryDate: { lte: nearExpiry, gte: today } } : {}),
      },
      include: {
        item: { select: { name: true, sku: true } },
        store: { select: { name: true } },
      },
      orderBy: { expiryDate: 'asc' },
      take: 200,
    });

    return batches.map((b) => ({
      id: b.id,
      itemName: b.item.name,
      sku: b.item.sku,
      storeName: b.store.name,
      batchNumber: b.batchNumber,
      remainingQty: Number(b.remainingQty),
      expiryDate: b.expiryDate?.toISOString() ?? null,
      status: b.status,
    }));
  }

  async listExpiryAlerts(hotelId: string) {
    const today = new Date();
    const nearExpiry = new Date();
    nearExpiry.setDate(nearExpiry.getDate() + 30);

    const [expired, nearExpiryItems] = await Promise.all([
      this.listBatches(hotelId, 'expired'),
      this.listBatches(hotelId, 'near_expiry'),
    ]);

    return { expired, nearExpiry: nearExpiryItems };
  }
}

@Injectable()
export class InvAuditService {
  constructor(
    private prisma: PrismaService,
    private realtime: InventoryRealtimeGateway,
  ) {}

  async listAudits(hotelId: string) {
    const audits = await this.prisma.stockAudit.findMany({
      where: { hotelId },
      include: {
        store: { select: { name: true } },
        items: true,
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return audits.map((a) => ({
      id: a.id,
      auditNumber: a.auditNumber,
      storeName: a.store.name,
      status: a.status,
      auditType: a.auditType,
      itemCount: a._count.items,
      varianceTotal: a.items.reduce((s, i) => s + Math.abs(Number(i.variance)), 0),
      scheduledAt: a.scheduledAt?.toISOString() ?? null,
    }));
  }

  async createAudit(hotelId: string, dto: CreateAuditSchema) {
    const count = await this.prisma.stockAudit.count({ where: { hotelId } });
    const auditNumber = `AUD-${String(count + 1).padStart(5, '0')}`;

    const balances = await this.prisma.stockBalance.findMany({
      where: { hotelId, storeId: dto.storeId },
    });

    const audit = await this.prisma.stockAudit.create({
      data: {
        hotelId,
        storeId: dto.storeId,
        auditNumber,
        auditType: dto.auditType,
        status: AuditStatus.IN_PROGRESS,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : new Date(),
        notes: dto.notes,
        items: {
          create: balances.map((b) => ({
            itemId: b.itemId,
            systemQty: b.quantity,
            physicalQty: b.quantity,
            variance: 0,
          })),
        },
      },
    });

    return audit;
  }

  async updateAuditItem(hotelId: string, auditId: string, itemId: string, physicalQty: number) {
    const auditItem = await this.prisma.stockAuditItem.findFirst({
      where: { auditId, itemId, audit: { hotelId } },
    });
    if (!auditItem) throw new NotFoundException('Audit item not found');

    const variance = physicalQty - Number(auditItem.systemQty);
    return this.prisma.stockAuditItem.update({
      where: { id: auditItem.id },
      data: { physicalQty, variance },
    });
  }

  async completeAudit(hotelId: string, id: string, userId?: string) {
    await this.prisma.stockAudit.update({
      where: { id },
      data: { status: AuditStatus.COMPLETED, completedAt: new Date(), approvedById: userId },
    });
    this.realtime.notifyDashboard(hotelId);
    return { completed: true };
  }
}

@Injectable()
export class InvPurchaseRequestService {
  constructor(private prisma: PrismaService) {}

  async list(hotelId: string) {
    const rows = await this.prisma.inventoryPurchaseRequest.findMany({
      where: { hotelId },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      requestNumber: r.requestNumber,
      department: r.department,
      status: r.status,
      itemCount: r._count.items,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async create(hotelId: string, dto: CreatePurchaseRequestSchema, userId?: string) {
    const count = await this.prisma.inventoryPurchaseRequest.count({ where: { hotelId } });
    const requestNumber = `PR-${String(count + 1).padStart(5, '0')}`;

    return this.prisma.inventoryPurchaseRequest.create({
      data: {
        hotelId,
        requestNumber,
        department: dto.department,
        status: PurchaseRequestStatus.SUBMITTED,
        requestedById: userId,
        notes: dto.notes,
        items: { create: dto.items.map((i: { itemId: string; quantity: number; notes?: string }) => ({ itemId: i.itemId, quantity: i.quantity, notes: i.notes })) },
      },
    });
  }

  async approve(hotelId: string, id: string, level: 'dept' | 'store', userId?: string) {
    const req = await this.prisma.inventoryPurchaseRequest.findFirst({ where: { id, hotelId } });
    if (!req) throw new NotFoundException('Request not found');

    const status =
      level === 'dept' ? PurchaseRequestStatus.DEPT_APPROVED : PurchaseRequestStatus.STORE_APPROVED;

    return this.prisma.inventoryPurchaseRequest.update({
      where: { id },
      data: {
        status,
        ...(level === 'dept' ? { deptApprovedById: userId } : { storeApprovedById: userId }),
      },
    });
  }

  async checkAutoReorder(hotelId: string) {
    const items = await this.prisma.inventoryItem.findMany({
      where: { hotelId, deletedAt: null, isActive: true },
      include: { reorderRules: true },
    });

    const created: string[] = [];
    for (const item of items) {
      const minLevel = Number(item.minStock || item.reorderLevel);
      const current = Number(item.currentStock);
      if (current >= minLevel) continue;

      const rule = item.reorderRules[0];
      const reorderQty = Number(rule?.reorderQty ?? Math.max(0, Number(item.maxStock) - current));

      const count = await this.prisma.inventoryPurchaseRequest.count({ where: { hotelId } });
      const requestNumber = `PR-AUTO-${String(count + 1).padStart(5, '0')}`;

      await this.prisma.inventoryPurchaseRequest.create({
        data: {
          hotelId,
          requestNumber,
          department: 'STORES',
          status: PurchaseRequestStatus.SUBMITTED,
          notes: `Auto-reorder: ${item.name} below minimum (${current} < ${minLevel})`,
          items: { create: [{ itemId: item.id, quantity: reorderQty }] },
        },
      });
      created.push(item.name);
    }

    return { created };
  }
}
