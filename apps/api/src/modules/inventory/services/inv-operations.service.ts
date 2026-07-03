import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AdjustmentStatus,
  IssueStatus,
  StockMovementType,
  TransferStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { InventoryRealtimeGateway } from '@/modules/inventory/gateways/inventory-realtime.gateway';

import type {
  CreateAdjustmentSchema,
  CreateConsumptionSchema,
  CreateIssueSchema,
  CreateTransferSchema,
} from '@tungaos/shared';

@Injectable()
export class InvOperationsService {
  constructor(
    private prisma: PrismaService,
    private realtime: InventoryRealtimeGateway,
  ) {}

  private async nextNumber(hotelId: string, prefix: string, field: string) {
    const count = await (this.prisma as any)[field].count({ where: { hotelId } });
    return `${prefix}-${String(count + 1).padStart(5, '0')}`;
  }

  private async adjustBalance(
    hotelId: string,
    storeId: string,
    itemId: string,
    delta: number,
    unitCost: number,
    userId?: string,
  ) {
    const existing = await this.prisma.stockBalance.findUnique({
      where: { storeId_itemId: { storeId, itemId } },
    });

    const newQty = Number(existing?.quantity ?? 0) + delta;
    if (newQty < 0) throw new BadRequestException('Insufficient stock');

    if (existing) {
      await this.prisma.stockBalance.update({
        where: { id: existing.id },
        data: { quantity: newQty, lastMovement: new Date(), averageCost: unitCost || existing.averageCost },
      });
    } else if (delta > 0) {
      await this.prisma.stockBalance.create({
        data: { hotelId, storeId, itemId, quantity: delta, averageCost: unitCost, lastMovement: new Date() },
      });
    }

    await this.prisma.inventoryItem.update({
      where: { id: itemId },
      data: { currentStock: { increment: delta } },
    });

    return newQty;
  }

  async listTransfers(hotelId: string) {
    const transfers = await this.prisma.stockTransfer.findMany({
      where: { hotelId },
      include: {
        fromStore: { select: { name: true } },
        toStore: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { transferDate: 'desc' },
      take: 100,
    });
    return transfers.map((t) => ({
      id: t.id,
      transferNumber: t.transferNumber,
      fromStoreName: t.fromStore.name,
      toStoreName: t.toStore.name,
      status: t.status,
      itemCount: t._count.items,
      transferDate: t.transferDate.toISOString(),
      notes: t.notes,
    }));
  }

  async createTransfer(hotelId: string, dto: CreateTransferSchema, userId?: string) {
    const transferNumber = await this.nextNumber(hotelId, 'TRF', 'stockTransfer');
    const transfer = await this.prisma.stockTransfer.create({
      data: {
        hotelId,
        transferNumber,
        fromStoreId: dto.fromStoreId,
        toStoreId: dto.toStoreId,
        status: TransferStatus.PENDING_APPROVAL,
        requestedById: userId,
        notes: dto.notes,
        items: { create: dto.items.map((i: { itemId: string; quantity: number; batchNumber?: string }) => ({ itemId: i.itemId, quantity: i.quantity, batchNumber: i.batchNumber })) },
      },
    });
    this.realtime.emitTransferUpdate(hotelId, transfer.id);
    return transfer;
  }

  async approveTransfer(hotelId: string, id: string, userId?: string) {
    const transfer = await this.prisma.stockTransfer.findFirst({
      where: { id, hotelId },
      include: { items: true },
    });
    if (!transfer) throw new NotFoundException('Transfer not found');
    if (transfer.status !== TransferStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Transfer not pending approval');
    }

    for (const line of transfer.items) {
      const qty = Number(line.quantity);
      const item = await this.prisma.inventoryItem.findUnique({ where: { id: line.itemId } });
      const cost = Number(item?.costPrice ?? 0);

      const fromBalance = await this.adjustBalance(hotelId, transfer.fromStoreId, line.itemId, -qty, cost, userId);
      await this.prisma.stockMovement.create({
        data: {
          hotelId, itemId: line.itemId, storeId: transfer.fromStoreId,
          type: StockMovementType.TRANSFER, quantity: -qty, balanceAfter: fromBalance,
          unitCost: cost, reference: transfer.transferNumber, referenceId: transfer.id, createdBy: userId,
        },
      });

      const toBalance = await this.adjustBalance(hotelId, transfer.toStoreId, line.itemId, qty, cost, userId);
      await this.prisma.stockMovement.create({
        data: {
          hotelId, itemId: line.itemId, storeId: transfer.toStoreId,
          type: StockMovementType.TRANSFER, quantity: qty, balanceAfter: toBalance,
          unitCost: cost, reference: transfer.transferNumber, referenceId: transfer.id, createdBy: userId,
        },
      });
    }

    await this.prisma.stockTransfer.update({
      where: { id },
      data: { status: TransferStatus.RECEIVED, approvedById: userId, receivedById: userId },
    });

    this.realtime.emitTransferUpdate(hotelId, id);
    this.realtime.notifyDashboard(hotelId);
    return { approved: true };
  }

  async listIssues(hotelId: string) {
    const issues = await this.prisma.stockIssue.findMany({
      where: { hotelId },
      include: { store: { select: { name: true } }, _count: { select: { items: true } } },
      orderBy: { issueDate: 'desc' },
      take: 100,
    });
    return issues.map((i) => ({
      id: i.id,
      issueNumber: i.issueNumber,
      storeName: i.store.name,
      department: i.department,
      status: i.status,
      itemCount: i._count.items,
      issueDate: i.issueDate.toISOString(),
    }));
  }

  async createIssue(hotelId: string, dto: CreateIssueSchema, userId?: string) {
    const issueNumber = await this.nextNumber(hotelId, 'ISS', 'stockIssue');
    return this.prisma.stockIssue.create({
      data: {
        hotelId,
        issueNumber,
        storeId: dto.storeId,
        department: dto.department,
        status: IssueStatus.PENDING_APPROVAL,
        requestedById: userId,
        notes: dto.notes,
        items: { create: dto.items.map((i: { itemId: string; quantity: number }) => ({ itemId: i.itemId, quantity: i.quantity })) },
      },
    });
  }

  async approveIssue(hotelId: string, id: string, userId?: string) {
    const issue = await this.prisma.stockIssue.findFirst({
      where: { id, hotelId },
      include: { items: true },
    });
    if (!issue) throw new NotFoundException('Issue not found');

    for (const line of issue.items) {
      const qty = Number(line.quantity);
      const item = await this.prisma.inventoryItem.findUnique({ where: { id: line.itemId } });
      const cost = Number(item?.costPrice ?? 0);
      const balance = await this.adjustBalance(hotelId, issue.storeId, line.itemId, -qty, cost, userId);

      await this.prisma.stockMovement.create({
        data: {
          hotelId, itemId: line.itemId, storeId: issue.storeId,
          type: StockMovementType.ISSUE, quantity: -qty, balanceAfter: balance,
          unitCost: cost, department: issue.department, reference: issue.issueNumber,
          referenceId: issue.id, createdBy: userId,
        },
      });

      await this.prisma.stockConsumption.create({
        data: {
          hotelId, storeId: issue.storeId, itemId: line.itemId,
          department: issue.department, quantity: qty, unitCost: cost,
          reference: issue.issueNumber, sourceModule: 'issue', sourceId: issue.id,
        },
      });
    }

    await this.prisma.stockIssue.update({
      where: { id },
      data: { status: IssueStatus.ISSUED, approvedById: userId, issuedById: userId },
    });

    this.realtime.emitConsumption(hotelId, id);
    this.realtime.notifyDashboard(hotelId);
    return { approved: true };
  }

  async listConsumptions(hotelId: string) {
    const rows = await this.prisma.stockConsumption.findMany({
      where: { hotelId },
      include: {
        item: { select: { name: true, sku: true } },
        store: { select: { name: true } },
      },
      orderBy: { consumedAt: 'desc' },
      take: 100,
    });
    return rows.map((c) => ({
      id: c.id,
      itemName: c.item.name,
      sku: c.item.sku,
      storeName: c.store.name,
      department: c.department,
      quantity: Number(c.quantity),
      unitCost: Number(c.unitCost),
      totalCost: Number(c.quantity) * Number(c.unitCost),
      sourceModule: c.sourceModule,
      consumedAt: c.consumedAt.toISOString(),
    }));
  }

  async recordConsumption(hotelId: string, dto: CreateConsumptionSchema, userId?: string) {
    const item = await this.prisma.inventoryItem.findFirst({ where: { id: dto.itemId, hotelId } });
    if (!item) throw new NotFoundException('Item not found');

    const cost = Number(item.costPrice);
    const balance = await this.adjustBalance(hotelId, dto.storeId, dto.itemId, -dto.quantity, cost, userId);

    await this.prisma.stockMovement.create({
      data: {
        hotelId, itemId: dto.itemId, storeId: dto.storeId,
        type: StockMovementType.CONSUMPTION, quantity: -dto.quantity, balanceAfter: balance,
        unitCost: cost, department: dto.department, reference: dto.reference,
        referenceId: dto.sourceId, notes: dto.notes, createdBy: userId,
      },
    });

    const consumption = await this.prisma.stockConsumption.create({
      data: {
        hotelId, storeId: dto.storeId, itemId: dto.itemId,
        department: dto.department, quantity: dto.quantity, unitCost: cost,
        reference: dto.reference, sourceModule: dto.sourceModule, sourceId: dto.sourceId, notes: dto.notes,
      },
    });

    this.realtime.emitConsumption(hotelId, consumption.id);
    this.realtime.notifyDashboard(hotelId);
    return consumption;
  }

  async listAdjustments(hotelId: string) {
    const rows = await this.prisma.stockAdjustment.findMany({
      where: { hotelId },
      include: {
        item: { select: { name: true } },
        store: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((a) => ({
      id: a.id,
      adjustNumber: a.adjustNumber,
      itemName: a.item.name,
      storeName: a.store.name,
      type: a.type,
      status: a.status,
      quantity: Number(a.quantity),
      reason: a.reason,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  async createAdjustment(hotelId: string, dto: CreateAdjustmentSchema, userId?: string) {
    const adjustNumber = await this.nextNumber(hotelId, 'ADJ', 'stockAdjustment');
    return this.prisma.stockAdjustment.create({
      data: {
        hotelId,
        adjustNumber,
        storeId: dto.storeId,
        itemId: dto.itemId,
        type: dto.type,
        status: AdjustmentStatus.PENDING_APPROVAL,
        quantity: dto.quantity,
        reason: dto.reason,
      },
    });
  }

  async approveAdjustment(hotelId: string, id: string, userId?: string) {
    const adj = await this.prisma.stockAdjustment.findFirst({ where: { id, hotelId } });
    if (!adj) throw new NotFoundException('Adjustment not found');

    const item = await this.prisma.inventoryItem.findUnique({ where: { id: adj.itemId } });
    const cost = Number(item?.costPrice ?? 0);
    const delta = Number(adj.quantity);
    const balance = await this.adjustBalance(hotelId, adj.storeId, adj.itemId, delta, cost, userId);

    await this.prisma.stockMovement.create({
      data: {
        hotelId, itemId: adj.itemId, storeId: adj.storeId,
        type: StockMovementType.ADJUSTMENT, quantity: delta, balanceAfter: balance,
        unitCost: cost, reference: adj.adjustNumber, referenceId: adj.id, createdBy: userId,
      },
    });

    await this.prisma.stockAdjustment.update({
      where: { id },
      data: { status: AdjustmentStatus.APPROVED, approvedById: userId },
    });

    this.realtime.notifyDashboard(hotelId);
    return { approved: true };
  }
}
