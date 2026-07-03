import { Injectable } from '@nestjs/common';
import {
  GrnStatus,
  ProcPrStatus,
  PurchaseOrderStatus,
  QuotationStatus,
  RfqStatus,
  VendorInvoiceStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { ProcDashboardStats } from '@tungaos/shared';

@Injectable()
export class ProcDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<ProcDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      pendingPR,
      pendingRfqs,
      pendingQuotations,
      pendingPO,
      pendingGRN,
      pendingInvoices,
      todayPOs,
      monthlyPOs,
      monthlyValue,
      latePOs,
      rejectedGrns,
      topVendorsRaw,
      deptSpending,
      budgets,
    ] = await Promise.all([
      this.prisma.procPurchaseRequest.count({
        where: { hotelId, status: { in: [ProcPrStatus.SUBMITTED, ProcPrStatus.PENDING_APPROVAL, ProcPrStatus.DEPT_APPROVED] } },
      }),
      this.prisma.rfq.count({ where: { hotelId, status: { in: [RfqStatus.DRAFT, RfqStatus.SENT] } } }),
      this.prisma.vendorQuotation.count({ where: { hotelId, status: { in: [QuotationStatus.SUBMITTED, QuotationStatus.UNDER_REVIEW] } } }),
      this.prisma.purchaseOrder.count({
        where: { hotelId, status: { in: [PurchaseOrderStatus.DRAFT, PurchaseOrderStatus.PENDING_APPROVAL, PurchaseOrderStatus.APPROVED, PurchaseOrderStatus.SENT] } },
      }),
      this.prisma.goodsReceiptNote.count({ where: { hotelId, status: { in: [GrnStatus.DRAFT, GrnStatus.RECEIVED, GrnStatus.INSPECTING] } } }),
      this.prisma.vendorInvoice.count({ where: { hotelId, status: { in: [VendorInvoiceStatus.SUBMITTED, VendorInvoiceStatus.PENDING_MATCH, VendorInvoiceStatus.MISMATCH] } } }),
      this.prisma.purchaseOrder.count({ where: { hotelId, createdAt: { gte: today } } }),
      this.prisma.purchaseOrder.count({ where: { hotelId, createdAt: { gte: monthStart } } }),
      this.prisma.purchaseOrder.aggregate({ where: { hotelId, createdAt: { gte: monthStart } }, _sum: { totalAmount: true } }),
      this.prisma.purchaseOrder.count({
        where: { hotelId, expectedDate: { lt: today }, status: { in: [PurchaseOrderStatus.SENT, PurchaseOrderStatus.APPROVED, PurchaseOrderStatus.PARTIALLY_RECEIVED] } },
      }),
      this.prisma.goodsReceiptNote.count({ where: { hotelId, status: GrnStatus.REJECTED } }),
      this.prisma.purchaseOrder.groupBy({
        by: ['vendorId'],
        where: { hotelId, vendorId: { not: null }, createdAt: { gte: monthStart } },
        _sum: { totalAmount: true },
        _count: true,
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 5,
      }),
      this.prisma.procPurchaseRequest.groupBy({
        by: ['department'],
        where: { hotelId },
        _count: true,
      }),
      this.prisma.procurementBudget.findMany({ where: { hotelId, fiscalYear: today.getFullYear() } }),
    ]);

    const vendorIds = topVendorsRaw.map((v) => v.vendorId).filter(Boolean) as string[];
    const vendors = vendorIds.length
      ? await this.prisma.vendor.findMany({ where: { id: { in: vendorIds } }, select: { id: true, name: true } })
      : [];
    const vendorMap = Object.fromEntries(vendors.map((v) => [v.id, v.name]));

    const totalBudget = budgets.reduce((s, b) => s + Number(b.budgetAmount), 0);
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spentAmount), 0);

    return {
      pendingPurchaseRequests: pendingPR,
      pendingRfqs,
      pendingQuotations,
      pendingPurchaseOrders: pendingPO,
      pendingGoodsReceipt: pendingGRN,
      pendingInvoices,
      pendingPayments: pendingInvoices,
      todayPurchases: todayPOs,
      monthlyPurchases: monthlyPOs,
      purchaseValue: Number(monthlyValue._sum.totalAmount ?? 0),
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 10000) / 100 : 0,
      lateDeliveries: latePOs,
      rejectedDeliveries: rejectedGrns,
      topVendors: topVendorsRaw.map((v) => ({
        name: v.vendorId ? vendorMap[v.vendorId] ?? 'Unknown' : 'Unknown',
        value: Number(v._sum.totalAmount ?? 0),
      })),
      departmentSpending: deptSpending.map((d) => ({ department: d.department, amount: d._count })),
    };
  }
}
