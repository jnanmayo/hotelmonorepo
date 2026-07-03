import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseStatus, IncomeType } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FinanceRealtimeGateway } from '@/modules/finance/gateways/finance-realtime.gateway';

import type {
  CreateBankAccountSchema,
  CreateBudgetSchema,
  CreateCashTransactionSchema,
  CreateExpenseSchema,
  CreateGstEntrySchema,
  CreateIncomeSchema,
} from '@tungaos/shared';
import type {
  FinAnalyticsData,
  FinApprovalItem,
  FinBankAccountItem,
  FinBudgetItem,
  FinCostCenterItem,
  FinExpenseItem,
  FinGstSummary,
  FinIncomeItem,
  FinOwnerDashboardStats,
  FinPayableItem,
  FinReceivableItem,
} from '@tungaos/shared';

@Injectable()
export class FinSupportService {
  constructor(
    private prisma: PrismaService,
    private realtime: FinanceRealtimeGateway,
  ) {}

  async listReceivables(hotelId: string): Promise<FinReceivableItem[]> {
    const rows = await this.prisma.finReceivable.findMany({
      where: { hotelId },
      orderBy: { dueDate: 'asc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      type: r.type,
      partyName: r.partyName,
      amount: Number(r.amount),
      paidAmount: Number(r.paidAmount),
      balance: Number(r.amount) - Number(r.paidAmount),
      dueDate: r.dueDate?.toISOString() ?? null,
      status: r.status,
      sourceModule: r.sourceModule,
    }));
  }

  async listPayables(hotelId: string): Promise<FinPayableItem[]> {
    const rows = await this.prisma.finPayable.findMany({
      where: { hotelId },
      orderBy: { dueDate: 'asc' },
      take: 100,
    });
    return rows.map((p) => ({
      id: p.id,
      type: p.type,
      partyName: p.partyName,
      amount: Number(p.amount),
      paidAmount: Number(p.paidAmount),
      balance: Number(p.amount) - Number(p.paidAmount),
      dueDate: p.dueDate?.toISOString() ?? null,
      status: p.status,
      paymentTerms: p.paymentTerms,
    }));
  }

  async listExpenses(hotelId: string): Promise<FinExpenseItem[]> {
    const rows = await this.prisma.expense.findMany({
      where: { hotelId, deletedAt: null },
      include: { category: true },
      orderBy: { expenseDate: 'desc' },
      take: 100,
    });
    return rows.map((e) => ({
      id: e.id,
      expenseNumber: e.expenseNumber,
      categoryName: e.category.name,
      amount: Number(e.amount),
      gstAmount: Number(e.gstAmount),
      status: e.status,
      department: e.department,
      vendorName: e.vendorName,
      expenseDate: e.expenseDate.toISOString(),
    }));
  }

  async createExpense(hotelId: string, dto: CreateExpenseSchema, userId?: string) {
    const count = await this.prisma.expense.count({ where: { hotelId } });
    const expense = await this.prisma.expense.create({
      data: {
        hotelId,
        categoryId: dto.categoryId,
        accountId: dto.accountId,
        costCenterId: dto.costCenterId,
        expenseNumber: `EXP-${String(count + 1).padStart(5, '0')}`,
        amount: dto.amount,
        gstAmount: dto.gstAmount,
        tdsAmount: dto.tdsAmount,
        description: dto.description,
        department: dto.department,
        vendorName: dto.vendorName,
        expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date(),
        createdBy: userId,
      },
      include: { category: true },
    });
    this.realtime.notifyDashboard(hotelId);
    return expense;
  }

  async seedExpenseCategories(hotelId: string, userId?: string) {
    const existing = await this.prisma.expenseCategory.count({ where: { hotelId } });
    if (existing > 0) return existing;

    const cats = ['Purchase', 'Maintenance', 'Utilities', 'Marketing', 'Office', 'Miscellaneous'];
    await this.prisma.expenseCategory.createMany({
      data: cats.map((name) => ({ hotelId, name, code: name.toUpperCase().slice(0, 10), createdBy: userId })),
    });
    return cats.length;
  }

  async listIncome(hotelId: string): Promise<FinIncomeItem[]> {
    const rows = await this.prisma.income.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { incomeDate: 'desc' },
      take: 100,
    });
    return rows.map((i) => ({
      id: i.id,
      incomeNumber: i.incomeNumber,
      type: i.type,
      amount: Number(i.amount),
      description: i.description,
      incomeDate: i.incomeDate.toISOString(),
      reference: i.reference,
    }));
  }

  async createIncome(hotelId: string, dto: CreateIncomeSchema, userId?: string) {
    const count = await this.prisma.income.count({ where: { hotelId } });
    const income = await this.prisma.income.create({
      data: {
        hotelId,
        accountId: dto.accountId,
        type: dto.type as IncomeType,
        incomeNumber: `INC-${String(count + 1).padStart(5, '0')}`,
        amount: dto.amount,
        description: dto.description,
        reference: dto.reference,
        incomeDate: dto.incomeDate ? new Date(dto.incomeDate) : new Date(),
        createdBy: userId,
      },
    });
    this.realtime.emitRevenueUpdate(hotelId);
    return income;
  }

  async listBankAccounts(hotelId: string): Promise<FinBankAccountItem[]> {
    const rows = await this.prisma.finBankAccount.findMany({ where: { hotelId, isActive: true } });
    return rows.map((b) => ({
      id: b.id,
      name: b.name,
      bankName: b.bankName,
      accountNumber: b.accountNumber,
      type: b.type,
      currentBalance: Number(b.currentBalance),
      currency: b.currency,
    }));
  }

  async createBankAccount(hotelId: string, dto: CreateBankAccountSchema) {
    return this.prisma.finBankAccount.create({
      data: {
        hotelId,
        name: dto.name,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        ifscCode: dto.ifscCode,
        type: dto.type,
        openingBalance: dto.openingBalance,
        currentBalance: dto.openingBalance,
        accountId: dto.accountId,
      },
    });
  }

  async listCashTransactions(hotelId: string) {
    return this.prisma.finCashTransaction.findMany({
      where: { hotelId },
      orderBy: { transactionDate: 'desc' },
      take: 50,
    });
  }

  async recordCashTransaction(hotelId: string, dto: CreateCashTransactionSchema, userId?: string) {
    const tx = await this.prisma.finCashTransaction.create({
      data: {
        hotelId,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        counterName: dto.counterName,
        createdBy: userId,
      },
    });
    this.realtime.emitCashUpdate(hotelId);
    return tx;
  }

  async listBudgets(hotelId: string): Promise<FinBudgetItem[]> {
    const rows = await this.prisma.finBudget.findMany({
      where: { hotelId },
      include: { costCenter: true },
      orderBy: { fiscalYear: 'desc' },
    });
    return rows.map((b) => ({
      id: b.id,
      name: b.name,
      fiscalYear: b.fiscalYear,
      budgetAmount: Number(b.budgetAmount),
      spentAmount: Number(b.spentAmount),
      utilizationPct: Number(b.budgetAmount) ? Math.round((Number(b.spentAmount) / Number(b.budgetAmount)) * 100) : 0,
      costCenterName: b.costCenter?.name ?? null,
      status: b.status,
    }));
  }

  async createBudget(hotelId: string, dto: CreateBudgetSchema) {
    return this.prisma.finBudget.create({
      data: {
        hotelId,
        name: dto.name,
        fiscalYear: dto.fiscalYear,
        budgetAmount: dto.budgetAmount,
        costCenterId: dto.costCenterId,
        category: dto.category,
      },
    });
  }

  async listCostCenters(hotelId: string): Promise<FinCostCenterItem[]> {
    const rows = await this.prisma.costCenter.findMany({ where: { hotelId, isActive: true } });
    return rows.map((c) => ({ id: c.id, code: c.code, name: c.name, department: c.department }));
  }

  async getGstSummary(hotelId: string): Promise<FinGstSummary> {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [output, input] = await Promise.all([
      this.prisma.finGstEntry.groupBy({
        by: ['gstType'],
        where: { hotelId, isOutput: true, periodMonth: month, periodYear: year },
        _sum: { gstAmount: true },
      }),
      this.prisma.finGstEntry.groupBy({
        by: ['gstType'],
        where: { hotelId, isOutput: false, periodMonth: month, periodYear: year },
        _sum: { gstAmount: true },
      }),
    ]);

    const outMap = Object.fromEntries(output.map((o) => [o.gstType, Number(o._sum.gstAmount ?? 0)]));
    const inMap = Object.fromEntries(input.map((i) => [i.gstType, Number(i._sum.gstAmount ?? 0)]));

    const outTotal = Object.values(outMap).reduce((s, v) => s + v, 0);
    const inTotal = Object.values(inMap).reduce((s, v) => s + v, 0);

    return {
      cgstOutput: outMap.CGST ?? 0,
      sgstOutput: outMap.SGST ?? 0,
      igstOutput: outMap.IGST ?? 0,
      cgstInput: inMap.CGST ?? 0,
      sgstInput: inMap.SGST ?? 0,
      igstInput: inMap.IGST ?? 0,
      netLiability: outTotal - inTotal,
      periodMonth: month,
      periodYear: year,
    };
  }

  async recordGstEntry(hotelId: string, dto: CreateGstEntrySchema) {
    const now = new Date();
    return this.prisma.finGstEntry.create({
      data: {
        hotelId,
        gstType: dto.gstType,
        taxableAmount: dto.taxableAmount,
        gstAmount: dto.gstAmount,
        gstRate: dto.gstRate,
        hsnSac: dto.hsnSac,
        isOutput: dto.isOutput,
        reference: dto.reference,
        periodMonth: now.getMonth() + 1,
        periodYear: now.getFullYear(),
      },
    });
  }

  async listApprovals(hotelId: string): Promise<FinApprovalItem[]> {
    const rows = await this.prisma.finApproval.findMany({
      where: { hotelId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((a) => ({
      id: a.id,
      entityType: a.entityType,
      entityId: a.entityId,
      level: a.level,
      status: a.status,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  async getOwnerDashboard(hotelId: string): Promise<FinOwnerDashboardStats> {
    const monthStart = new Date();
    monthStart.setDate(1);

    const [income, expense, receivables, payables, gst, nightAudit] = await Promise.all([
      this.prisma.income.aggregate({ where: { hotelId, incomeDate: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.expense.aggregate({ where: { hotelId, expenseDate: { gte: monthStart }, status: { not: ExpenseStatus.REJECTED } }, _sum: { amount: true } }),
      this.prisma.finReceivable.aggregate({ where: { hotelId, status: 'OPEN' }, _sum: { amount: true, paidAmount: true } }),
      this.prisma.finPayable.aggregate({ where: { hotelId, status: 'OPEN' }, _sum: { amount: true, paidAmount: true } }),
      this.prisma.finGstEntry.aggregate({ where: { hotelId, isOutput: true }, _sum: { gstAmount: true } }),
      this.prisma.nightAudit.findFirst({ where: { hotelId }, orderBy: { auditDate: 'desc' } }),
    ]);

    const revenue = Number(income._sum.amount ?? 0);
    const expenses = Number(expense._sum.amount ?? 0);
    const profit = revenue - expenses;

    return {
      revenue,
      expenses,
      profit,
      netProfitMargin: revenue ? Math.round((profit / revenue) * 100) : 0,
      ebitda: profit,
      cashFlow: profit,
      gstLiability: Number(gst._sum.gstAmount ?? 0),
      outstandingReceivables: Number(receivables._sum.amount ?? 0) - Number(receivables._sum.paidAmount ?? 0),
      outstandingPayables: Number(payables._sum.amount ?? 0) - Number(payables._sum.paidAmount ?? 0),
      departmentProfitability: [],
      revenueTrend: [{ month: monthStart.toISOString().slice(0, 7), revenue }],
      expenseTrend: [{ month: monthStart.toISOString().slice(0, 7), expense: expenses }],
    };
  }

  async getAnalytics(hotelId: string): Promise<FinAnalyticsData> {
    const monthStart = new Date();
    monthStart.setDate(1);
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

    const [incomeByType, expenseByCat, nightAudit, totalRooms] = await Promise.all([
      this.prisma.income.groupBy({ by: ['type'], where: { hotelId, incomeDate: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.expense.groupBy({ by: ['categoryId'], where: { hotelId, expenseDate: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.nightAudit.findFirst({ where: { hotelId }, orderBy: { auditDate: 'desc' } }),
      this.prisma.room.count({ where: { hotelId, isActive: true } }),
    ]);

    const totalRevenue = incomeByType.reduce((s, i) => s + Number(i._sum.amount ?? 0), 0);
    const foodCost = expenseByCat.length ? Number(expenseByCat[0]?._sum.amount ?? 0) : 0;

    return {
      revPar: nightAudit ? Number(nightAudit.revPar) : 0,
      adr: nightAudit ? Number(nightAudit.adr) : 0,
      occupancyPct: nightAudit ? Number(nightAudit.occupancyPct) : 0,
      foodCostPct: totalRevenue ? Math.round((foodCost / totalRevenue) * 100) : 0,
      payrollPct: 0,
      avgDailyRevenue: daysInMonth ? Math.round(totalRevenue / daysInMonth) : 0,
      revenueBySource: incomeByType.map((i) => ({ source: i.type.replace(/_/g, ' '), amount: Number(i._sum.amount ?? 0) })),
      expenseByCategory: expenseByCat.map((e) => ({ category: e.categoryId, amount: Number(e._sum.amount ?? 0) })),
      cashFlowForecast: [{ month: monthStart.toISOString().slice(0, 7), projected: totalRevenue - foodCost }],
    };
  }

  async getReport(hotelId: string, type: string) {
    switch (type) {
      case 'trial-balance':
        return this.prisma.account.findMany({ where: { hotelId }, orderBy: { code: 'asc' } });
      case 'profit-loss':
        return {
          revenue: await this.prisma.income.aggregate({ where: { hotelId }, _sum: { amount: true } }),
          expense: await this.prisma.expense.aggregate({ where: { hotelId }, _sum: { amount: true } }),
        };
      case 'balance-sheet':
        return {
          assets: await this.prisma.account.aggregate({ where: { hotelId, type: 'ASSET' }, _sum: { balance: true } }),
          liabilities: await this.prisma.account.aggregate({ where: { hotelId, type: 'LIABILITY' }, _sum: { balance: true } }),
          equity: await this.prisma.account.aggregate({ where: { hotelId, type: 'EQUITY' }, _sum: { balance: true } }),
        };
      case 'gst':
        return this.getGstSummary(hotelId);
      case 'ageing-receivables':
        return this.listReceivables(hotelId);
      case 'ageing-payables':
        return this.listPayables(hotelId);
      default:
        return { type, generatedAt: new Date().toISOString() };
    }
  }

  async approveEntity(hotelId: string, entityType: string, entityId: string, userId?: string) {
    const approval = await this.prisma.finApproval.findFirst({
      where: { hotelId, entityType, entityId, status: 'PENDING' },
    });
    if (!approval) throw new NotFoundException('Approval not found');

    await this.prisma.finApproval.update({
      where: { id: approval.id },
      data: { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() },
    });

    if (entityType === 'EXPENSE') {
      await this.prisma.expense.update({
        where: { id: entityId },
        data: { status: ExpenseStatus.APPROVED, approvalStatus: 'APPROVED' },
      });
    }

    this.realtime.notifyDashboard(hotelId);
    return { approved: true };
  }
}
