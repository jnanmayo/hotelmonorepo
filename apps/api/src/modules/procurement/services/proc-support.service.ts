import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { CreateContractSchema, CreateReturnSchema } from '@tungaos/shared';
import type { ProcAnalyticsData } from '@tungaos/shared';

@Injectable()
export class ProcSupportService {
  constructor(private prisma: PrismaService) {}

  async listReturns(hotelId: string) {
    const rows = await this.prisma.purchaseReturn.findMany({
      where: { hotelId },
      include: { vendor: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      returnNumber: r.returnNumber,
      vendorName: r.vendor.name,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createReturn(hotelId: string, dto: CreateReturnSchema) {
    const count = await this.prisma.purchaseReturn.count({ where: { hotelId } });
    const returnNumber = `RET-${String(count + 1).padStart(5, '0')}`;
    return this.prisma.purchaseReturn.create({
      data: {
        hotelId,
        returnNumber,
        vendorId: dto.vendorId,
        orderId: dto.orderId,
        reason: dto.reason,
        notes: dto.notes,
        items: { create: dto.items.map((i) => ({ itemId: i.itemId, quantity: i.quantity, notes: i.notes })) },
      },
    });
  }

  async listContracts(hotelId: string) {
    const rows = await this.prisma.vendorContract.findMany({
      where: { hotelId },
      include: { vendor: { select: { name: true } } },
      orderBy: { endDate: 'asc' },
      take: 100,
    });
    return rows.map((c) => ({
      id: c.id,
      contractNumber: c.contractNumber,
      vendorName: c.vendor.name,
      title: c.title,
      status: c.status,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      autoRenew: c.autoRenew,
    }));
  }

  async createContract(hotelId: string, dto: CreateContractSchema) {
    const count = await this.prisma.vendorContract.count({ where: { hotelId } });
    const contractNumber = `CON-${String(count + 1).padStart(5, '0')}`;
    return this.prisma.vendorContract.create({
      data: {
        hotelId,
        vendorId: dto.vendorId,
        contractNumber,
        title: dto.title,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        renewalDate: dto.renewalDate ? new Date(dto.renewalDate) : undefined,
        terms: dto.terms,
        autoRenew: dto.autoRenew,
      },
    });
  }

  async listBudgets(hotelId: string) {
    const year = new Date().getFullYear();
    const rows = await this.prisma.procurementBudget.findMany({ where: { hotelId, fiscalYear: year } });
    return rows.map((b) => ({
      id: b.id,
      department: b.department,
      fiscalYear: b.fiscalYear,
      budgetAmount: Number(b.budgetAmount),
      spentAmount: Number(b.spentAmount),
      remaining: Number(b.budgetAmount) - Number(b.spentAmount),
      utilizationPercent: Number(b.budgetAmount) > 0 ? Math.round((Number(b.spentAmount) / Number(b.budgetAmount)) * 10000) / 100 : 0,
    }));
  }

  async seedBudgets(hotelId: string) {
    const year = new Date().getFullYear();
    const existing = await this.prisma.procurementBudget.count({ where: { hotelId, fiscalYear: year } });
    if (existing > 0) return { seeded: false };

    const depts = ['KITCHEN', 'RESTAURANT', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE', 'SPA', 'BANQUET', 'STORES'] as const;
    for (const department of depts) {
      await this.prisma.procurementBudget.create({
        data: { hotelId, department, fiscalYear: year, budgetAmount: 500000 },
      });
    }
    return { seeded: true };
  }

  async listInvoices(hotelId: string) {
    const rows = await this.prisma.vendorInvoice.findMany({
      where: { hotelId },
      include: {
        vendor: { select: { name: true } },
        order: { select: { poNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((i) => ({
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      vendorName: i.vendor.name,
      poNumber: i.order?.poNumber ?? null,
      status: i.status,
      totalAmount: Number(i.totalAmount),
      dueDate: i.dueDate?.toISOString() ?? null,
    }));
  }

  async getAnalytics(hotelId: string): Promise<ProcAnalyticsData> {
    const monthlyPurchases: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const sum = await this.prisma.purchaseOrder.aggregate({
        where: { hotelId, createdAt: { gte: start, lt: end } },
        _sum: { totalAmount: true },
      });
      monthlyPurchases.push({
        month: start.toLocaleString('en', { month: 'short', year: '2-digit' }),
        value: Number(sum._sum.totalAmount ?? 0),
      });
    }

    const vendors = await this.prisma.vendor.findMany({
      where: { hotelId, deletedAt: null },
      include: { ratings: { take: 1, orderBy: { createdAt: 'desc' } } },
      take: 10,
      orderBy: { rating: 'desc' },
    });

    const deptSpending = await this.prisma.procPurchaseRequest.groupBy({
      by: ['department'],
      where: { hotelId },
      _count: true,
    });

    return {
      monthlyPurchases,
      vendorPerformance: vendors.map((v) => ({
        name: v.name,
        rating: Number(v.rating),
        onTime: Number(v.ratings[0]?.onTimeDeliveryScore ?? 0),
      })),
      departmentSpending: deptSpending.map((d) => ({ department: d.department, amount: d._count })),
      purchaseCycleDays: 14,
      costSavings: 0,
      priceVariance: 0,
      purchaseForecast: monthlyPurchases.map((m) => ({ month: m.month, forecast: m.value * 1.05 })),
    };
  }

  async getReport(hotelId: string, type: string) {
    switch (type) {
      case 'register':
        return this.prisma.purchaseOrder.findMany({ where: { hotelId }, include: { vendor: true }, orderBy: { createdAt: 'desc' }, take: 200 });
      case 'grn':
        return this.prisma.goodsReceiptNote.findMany({ where: { hotelId }, include: { vendor: true }, orderBy: { createdAt: 'desc' }, take: 200 });
      case 'quotations':
        return this.prisma.vendorQuotation.findMany({ where: { hotelId }, include: { vendor: true }, orderBy: { createdAt: 'desc' }, take: 200 });
      case 'vendors':
        return this.prisma.vendor.findMany({ where: { hotelId, deletedAt: null }, orderBy: { name: 'asc' } });
      case 'budget':
        return this.listBudgets(hotelId);
      default:
        return [];
    }
  }

  async getVendorPortalDashboard(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const [pos, rfqs, quotations, invoices] = await Promise.all([
      this.prisma.purchaseOrder.count({ where: { vendorId } }),
      this.prisma.rfqVendor.count({ where: { vendorId } }),
      this.prisma.vendorQuotation.count({ where: { vendorId } }),
      this.prisma.vendorInvoice.count({ where: { vendorId } }),
    ]);

    return { vendorName: vendor.name, purchaseOrders: pos, rfqs, quotations, invoices };
  }

  async getVendorPortalPos(vendorId: string) {
    return this.prisma.purchaseOrder.findMany({
      where: { vendorId },
      include: { items: { include: { item: { select: { name: true, sku: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getVendorPortalRfqs(vendorId: string) {
    const links = await this.prisma.rfqVendor.findMany({
      where: { vendorId },
      include: { rfq: { include: { items: true } } },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });
    return links.map((l) => l.rfq);
  }
}
