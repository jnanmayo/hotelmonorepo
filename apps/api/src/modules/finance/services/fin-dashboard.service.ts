import { Injectable } from '@nestjs/common';
import { ExpenseStatus, JournalEntryStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { FinDashboardStats } from '@tungaos/shared';

@Injectable()
export class FinDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<FinDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayIncome,
      todayExpense,
      monthIncome,
      monthExpense,
      cashAccounts,
      bankAccounts,
      receivables,
      payables,
      gstOutput,
      gstInput,
      budgets,
      folioToday,
      deptIncome,
      deptExpense,
    ] = await Promise.all([
      this.prisma.income.aggregate({ where: { hotelId, incomeDate: { gte: today } }, _sum: { amount: true } }),
      this.prisma.expense.aggregate({ where: { hotelId, expenseDate: { gte: today }, status: { not: ExpenseStatus.REJECTED } }, _sum: { amount: true } }),
      this.prisma.income.aggregate({ where: { hotelId, incomeDate: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.expense.aggregate({ where: { hotelId, expenseDate: { gte: monthStart }, status: { not: ExpenseStatus.REJECTED } }, _sum: { amount: true } }),
      this.prisma.finBankAccount.aggregate({ where: { hotelId, type: { in: ['CASH', 'PETTY_CASH'] } }, _sum: { currentBalance: true } }),
      this.prisma.finBankAccount.aggregate({ where: { hotelId, type: { in: ['CURRENT', 'SAVINGS', 'UPI_WALLET'] } }, _sum: { currentBalance: true } }),
      this.prisma.finReceivable.aggregate({ where: { hotelId, status: 'OPEN' }, _sum: { amount: true, paidAmount: true } }),
      this.prisma.finPayable.aggregate({ where: { hotelId, status: 'OPEN' }, _sum: { amount: true, paidAmount: true } }),
      this.prisma.finGstEntry.aggregate({ where: { hotelId, isOutput: true, periodYear: today.getFullYear(), periodMonth: today.getMonth() + 1 }, _sum: { gstAmount: true } }),
      this.prisma.finGstEntry.aggregate({ where: { hotelId, isOutput: false, periodYear: today.getFullYear(), periodMonth: today.getMonth() + 1 }, _sum: { gstAmount: true } }),
      this.prisma.finBudget.findMany({ where: { hotelId, fiscalYear: today.getFullYear() } }),
      this.prisma.folioCharge.aggregate({ where: { hotelId, postedAt: { gte: today } }, _sum: { totalAmount: true } }),
      this.prisma.income.groupBy({ by: ['type'], where: { hotelId, incomeDate: { gte: monthStart } }, _sum: { amount: true } }),
      this.prisma.expense.groupBy({ by: ['department'], where: { hotelId, expenseDate: { gte: monthStart } }, _sum: { amount: true } }),
    ]);

    const todayRev = Number(todayIncome._sum.amount ?? 0) + Number(folioToday._sum.totalAmount ?? 0);
    const todayExp = Number(todayExpense._sum.amount ?? 0);
    const monthRev = Number(monthIncome._sum.amount ?? 0);
    const monthExp = Number(monthExpense._sum.amount ?? 0);

    const totalBudget = budgets.reduce((s, b) => s + Number(b.budgetAmount), 0);
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spentAmount), 0);

    const arTotal = Number(receivables._sum.amount ?? 0) - Number(receivables._sum.paidAmount ?? 0);
    const apTotal = Number(payables._sum.amount ?? 0) - Number(payables._sum.paidAmount ?? 0);
    const gstLiab = Number(gstOutput._sum.gstAmount ?? 0) - Number(gstInput._sum.gstAmount ?? 0);

    return {
      todayRevenue: todayRev,
      todayExpenses: todayExp,
      todayProfit: todayRev - todayExp,
      cashBalance: Number(cashAccounts._sum.currentBalance ?? 0),
      bankBalance: Number(bankAccounts._sum.currentBalance ?? 0),
      outstandingReceivables: arTotal,
      outstandingPayables: apTotal,
      gstLiability: gstLiab,
      monthlyRevenue: monthRev,
      monthlyExpenses: monthExp,
      monthlyProfit: monthRev - monthExp,
      budgetUtilization: totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0,
      departmentRevenue: deptIncome.map((d) => ({
        department: d.type.replace(/_/g, ' '),
        amount: Number(d._sum.amount ?? 0),
      })),
      departmentCost: deptExpense
        .filter((d) => d.department)
        .map((d) => ({ department: d.department!, amount: Number(d._sum.amount ?? 0) })),
      cashFlow: [{ date: today.toISOString().slice(0, 10), inflow: todayRev, outflow: todayExp }],
    };
  }
}
