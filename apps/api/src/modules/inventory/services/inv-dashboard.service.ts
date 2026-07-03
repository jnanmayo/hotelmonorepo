import { Injectable } from '@nestjs/common';
import {
  BatchStatus,
  InventoryDepartment,
  IssueStatus,
  PurchaseRequestStatus,
  TransferStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { InvDashboardStats } from '@tungaos/shared';

@Injectable()
export class InvDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<InvDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nearExpiryDate = new Date();
    nearExpiryDate.setDate(nearExpiryDate.getDate() + 30);

    const [
      totalItems,
      balances,
      expiredBatches,
      nearExpiryBatches,
      todayConsumption,
      todayReceipts,
      pendingRequests,
      pendingTransfers,
      pendingIssues,
      pendingAdjustments,
      storeBalances,
    ] = await Promise.all([
      this.prisma.inventoryItem.count({ where: { hotelId, deletedAt: null, isActive: true } }),
      this.prisma.stockBalance.findMany({
        where: { hotelId },
        include: { item: { select: { reorderLevel: true, minStock: true, costPrice: true } }, store: { select: { storeType: true } } },
      }),
      this.prisma.stockBatch.count({ where: { hotelId, status: BatchStatus.EXPIRED, remainingQty: { gt: 0 } } }),
      this.prisma.stockBatch.count({
        where: {
          hotelId,
          status: { in: [BatchStatus.ACTIVE, BatchStatus.NEAR_EXPIRY] },
          expiryDate: { lte: nearExpiryDate, gte: today },
          remainingQty: { gt: 0 },
        },
      }),
      this.prisma.stockConsumption.aggregate({
        where: { hotelId, consumedAt: { gte: today, lt: tomorrow } },
        _sum: { quantity: true },
      }),
      this.prisma.stockMovement.count({
        where: { hotelId, type: 'RECEIPT', movementDate: { gte: today, lt: tomorrow }, deletedAt: null },
      }),
      this.prisma.inventoryPurchaseRequest.count({
        where: { hotelId, status: { in: [PurchaseRequestStatus.SUBMITTED, PurchaseRequestStatus.DEPT_APPROVED, PurchaseRequestStatus.STORE_APPROVED] } },
      }),
      this.prisma.stockTransfer.count({
        where: { hotelId, status: { in: [TransferStatus.PENDING_APPROVAL, TransferStatus.IN_TRANSIT] } },
      }),
      this.prisma.stockIssue.count({
        where: { hotelId, status: { in: [IssueStatus.PENDING_APPROVAL, IssueStatus.APPROVED] } },
      }),
      this.prisma.stockAdjustment.count({
        where: { hotelId, status: 'PENDING_APPROVAL' },
      }),
      this.prisma.stockBalance.findMany({
        where: { hotelId },
        include: { store: { select: { storeType: true } }, item: { select: { costPrice: true } } },
      }),
    ]);

    let availableStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let stockValue = 0;

    for (const b of balances) {
      const qty = Number(b.quantity);
      const reorder = Number(b.item.reorderLevel || b.item.minStock);
      availableStock += qty;
      stockValue += qty * Number(b.item.costPrice);
      if (qty <= 0) outOfStock++;
      else if (qty <= reorder) lowStock++;
    }

    const deptStock = (types: string[]) =>
      storeBalances
        .filter((b) => types.includes(b.store.storeType))
        .reduce((sum, b) => sum + Number(b.quantity), 0);

    return {
      totalItems,
      availableStock: Math.round(availableStock * 100) / 100,
      lowStock,
      outOfStock,
      expiredItems: expiredBatches,
      nearExpiry: nearExpiryBatches,
      todayConsumption: Number(todayConsumption._sum.quantity ?? 0),
      todayReceipts,
      pendingPurchaseRequests: pendingRequests,
      pendingApprovals: pendingTransfers + pendingIssues + pendingAdjustments,
      storeTransfers: pendingTransfers,
      stockValue: Math.round(stockValue * 100) / 100,
      inventoryCost: Math.round(stockValue * 100) / 100,
      foodCost: deptStock(['KITCHEN', 'RESTAURANT']),
      barStock: deptStock(['BAR']),
      laundryStock: deptStock(['LAUNDRY']),
      housekeepingStock: deptStock(['HOUSEKEEPING']),
      maintenanceStock: deptStock(['MAINTENANCE', 'ENGINEERING']),
    };
  }
}
