import { Injectable } from '@nestjs/common';
import { CorpContractStatus, CorpSalesLeadStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  CorpSalesAnalyticsData,
  CorpSalesDashboardStats,
  CorpSalesOwnerStats,
} from '@tungaos/shared';

const QUALIFIED_STATUSES = [
  'QUALIFIED',
  'MEETING_SCHEDULED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'LEGAL_REVIEW',
  'CONTRACT_DRAFT',
  'APPROVED',
  'WON',
  'RENEWAL',
] as const;

const PROPOSAL_STATUSES = ['PROPOSAL_SENT', 'NEGOTIATION', 'LEGAL_REVIEW', 'CONTRACT_DRAFT'] as const;

const PIPELINE_STAGES = [
  'NEW',
  'QUALIFIED',
  'MEETING_SCHEDULED',
  'PROPOSAL_SENT',
  'NEGOTIATION',
  'LEGAL_REVIEW',
  'CONTRACT_DRAFT',
  'APPROVED',
  'WON',
  'LOST',
  'RENEWAL',
] as const;

@Injectable()
export class CorpSalesDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<CorpSalesDashboardStats> {
    const today = new Date();
    const in90Days = new Date(today);
    in90Days.setDate(in90Days.getDate() + 90);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      corporateLeads,
      qualifiedLeads,
      proposalsSent,
      contractsActive,
      contractsExpiring,
      revenueAgg,
      contracts,
      bookings,
      creditAgg,
      invoices,
      paidInvoices,
      target,
      pipelineGroups,
      topCompanies,
    ] = await Promise.all([
      this.prisma.corpSalesLead.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.corpSalesLead.count({
        where: { hotelId, deletedAt: null, status: { in: [...QUALIFIED_STATUSES] } },
      }),
      this.prisma.corpSalesLead.count({
        where: { hotelId, deletedAt: null, status: { in: [...PROPOSAL_STATUSES] } },
      }),
      this.prisma.corporateContract.count({
        where: { hotelId, deletedAt: null, status: CorpContractStatus.ACTIVE },
      }),
      this.prisma.corporateContract.count({
        where: {
          hotelId,
          deletedAt: null,
          status: CorpContractStatus.ACTIVE,
          endsAt: { lte: in90Days, gte: today },
        },
      }),
      this.prisma.corporateBooking.aggregate({
        where: { hotelId, deletedAt: null, createdAt: { gte: monthStart } },
        _sum: { totalAmount: true },
      }),
      this.prisma.corporateContract.findMany({
        where: { hotelId, deletedAt: null, status: CorpContractStatus.ACTIVE },
        select: { discountPct: true },
      }),
      this.prisma.corporateBooking.findMany({
        where: { hotelId, deletedAt: null, checkInDate: { gte: monthStart } },
        select: { totalRooms: true, totalAmount: true, checkInDate: true, checkOutDate: true },
      }),
      this.prisma.corpCreditAccount.aggregate({
        where: { hotelId },
        _sum: { outstandingAmount: true },
      }),
      this.prisma.corpBillingInvoice.count({ where: { hotelId } }),
      this.prisma.corpBillingInvoice.count({
        where: { hotelId, status: 'PAID' },
      }),
      this.prisma.corpSalesTarget.findFirst({
        where: { hotelId, periodType: 'monthly' },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.corpSalesLead.groupBy({
        by: ['status'],
        where: { hotelId, deletedAt: null },
        _count: true,
        _sum: { expectedRevenue: true },
      }),
      this.prisma.corporateCompany.findMany({
        where: { hotelId, deletedAt: null },
        include: { bookings: { where: { deletedAt: null }, select: { totalAmount: true } } },
        take: 5,
      }),
    ]);

    const monthlyRoomNights = bookings.reduce((sum, b) => {
      const nights = Math.max(1, Math.ceil(
        (b.checkOutDate.getTime() - b.checkInDate.getTime()) / (1000 * 60 * 60 * 24),
      ));
      return sum + b.totalRooms * nights;
    }, 0);

    const corporateRevenue = Number(revenueAgg._sum.totalAmount ?? 0);
    const avgContractValue = contracts.length > 0
      ? Math.round(corporateRevenue / Math.max(contracts.length, 1))
      : 0;
    const corporateAdr = monthlyRoomNights > 0
      ? Math.round(corporateRevenue / monthlyRoomNights)
      : 0;
    const totalRooms = 100;
    const corporateRevpar = Math.round((corporateRevenue / (totalRooms * 30)) || 0);
    const corporateOccupancyPct = Math.min(100, Math.round((monthlyRoomNights / (totalRooms * 30)) * 100));

    const pipelineByStage = PIPELINE_STAGES.map((stage) => {
      const g = pipelineGroups.find((x) => x.status === stage);
      return {
        stage,
        count: g?._count ?? 0,
        value: Number(g?._sum.expectedRevenue ?? 0),
      };
    });

    const salesTarget = Number(target?.revenueTarget ?? corporateRevenue * 1.2);
    const salesAchievementPct = salesTarget > 0
      ? Math.round((corporateRevenue / salesTarget) * 100)
      : 0;

    return {
      corporateLeads,
      qualifiedLeads,
      proposalsSent,
      contractsActive,
      contractsExpiring,
      corporateRevenue,
      averageContractValue: avgContractValue,
      topCorporateClients: topCompanies
        .map((c) => ({
          name: c.name,
          revenue: c.bookings.reduce((s, b) => s + Number(b.totalAmount), 0),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      monthlyRoomNights,
      corporateOccupancyPct,
      corporateAdr,
      corporateRevpar,
      creditOutstanding: Number(creditAgg._sum.outstandingAmount ?? 0),
      collectionStatusPct: invoices > 0 ? Math.round((paidInvoices / invoices) * 100) : 100,
      salesTarget,
      salesAchievementPct,
      pipelineByStage,
    };
  }

  async getOwnerDashboard(hotelId: string): Promise<CorpSalesOwnerStats> {
    const dashboard = await this.getDashboard(hotelId);
    const renewals = await this.prisma.corpContractRenewal.count({ where: { hotelId, status: 'renewed' } });
    const totalRenewals = await this.prisma.corpContractRenewal.count({ where: { hotelId } });

    const companies = await this.prisma.corporateCompany.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        bookings: {
          where: { deletedAt: null },
          select: { totalAmount: true, totalRooms: true, checkInDate: true, checkOutDate: true },
        },
      },
      take: 10,
    });

    return {
      corporateRevenue: dashboard.corporateRevenue,
      topCompanies: companies.map((c) => ({
        name: c.name,
        revenue: c.bookings.reduce((s, b) => s + Number(b.totalAmount), 0),
        roomNights: c.bookings.reduce((s, b) => {
          const nights = Math.max(1, Math.ceil(
            (b.checkOutDate.getTime() - b.checkInDate.getTime()) / (1000 * 60 * 60 * 24),
          ));
          return s + b.totalRooms * nights;
        }, 0),
      })).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
      topSalesExecutive: null,
      revenueForecast: Math.round(dashboard.corporateRevenue * 1.15),
      contractRenewalRate: totalRenewals > 0 ? Math.round((renewals / totalRenewals) * 100) : 0,
      averageContractValue: dashboard.averageContractValue,
      roomNightForecast: Math.round(dashboard.monthlyRoomNights * 1.1),
      corporateOccupancyPct: dashboard.corporateOccupancyPct,
    };
  }

  async getAnalytics(hotelId: string): Promise<CorpSalesAnalyticsData> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const bookings = await this.prisma.corporateBooking.findMany({
      where: { hotelId, deletedAt: null },
      select: { totalAmount: true, checkInDate: true, totalRooms: true, checkOutDate: true },
      take: 200,
    });

    const pipelineGroups = await this.prisma.corpSalesLead.groupBy({
      by: ['status'],
      where: { hotelId, deletedAt: null },
      _count: true,
    });

    const industryGroups = await this.prisma.corporateCompany.groupBy({
      by: ['industry'],
      where: { hotelId, deletedAt: null, industry: { not: null } },
      _count: true,
    });

    return {
      revenueByMonth: months.map((month, i) => ({
        month,
        revenue: bookings
          .filter((b) => b.checkInDate.getMonth() === i)
          .reduce((s, b) => s + Number(b.totalAmount), 0),
      })),
      leadConversion: pipelineGroups.map((g) => ({ stage: g.status, count: g._count })),
      salesFunnel: PIPELINE_STAGES.map((stage) => ({
        stage,
        value: pipelineGroups.find((g) => g.status === stage)?._count ?? 0,
      })),
      industryAnalysis: industryGroups.map((g) => ({
        industry: g.industry ?? 'Other',
        revenue: g._count * 50000,
      })),
      roomNightTrend: months.map((month, i) => ({
        month,
        nights: bookings.filter((b) => b.checkInDate.getMonth() === i).reduce((s, b) => s + b.totalRooms * 2, 0),
      })),
      forecast: months.map((month, i) => ({
        month,
        projected: Math.round(bookings.reduce((s, b) => s + Number(b.totalAmount), 0) / 6 * (1 + i * 0.05)),
      })),
    };
  }

  async getReport(hotelId: string, type: string) {
    const summary: Record<string, number> = {};

    switch (type) {
      case 'companies':
        summary.total = await this.prisma.corporateCompany.count({ where: { hotelId, deletedAt: null } });
        summary.active = await this.prisma.corporateCompany.count({ where: { hotelId, deletedAt: null, isActive: true } });
        break;
      case 'contracts':
        summary.total = await this.prisma.corporateContract.count({ where: { hotelId, deletedAt: null } });
        summary.active = await this.prisma.corporateContract.count({
          where: { hotelId, deletedAt: null, status: CorpContractStatus.ACTIVE },
        });
        summary.expiring = await this.prisma.corporateContract.count({
          where: {
            hotelId,
            deletedAt: null,
            status: CorpContractStatus.ACTIVE,
            endsAt: { lte: new Date(Date.now() + 90 * 86400000) },
          },
        });
        break;
      case 'leads':
        summary.total = await this.prisma.corpSalesLead.count({ where: { hotelId, deletedAt: null } });
        summary.qualified = await this.prisma.corpSalesLead.count({
          where: { hotelId, deletedAt: null, status: { in: [...QUALIFIED_STATUSES] } },
        });
        summary.won = await this.prisma.corpSalesLead.count({
          where: { hotelId, deletedAt: null, status: CorpSalesLeadStatus.WON },
        });
        break;
      case 'outstanding':
        summary.invoices = await this.prisma.corpBillingInvoice.count({
          where: { hotelId, status: { in: ['SENT', 'OVERDUE', 'PARTIAL'] } },
        });
        break;
      case 'credit':
        summary.accounts = await this.prisma.corpCreditAccount.count({ where: { hotelId } });
        summary.blocked = await this.prisma.corpCreditAccount.count({ where: { hotelId, isBlocked: true } });
        break;
      case 'renewals':
        summary.pending = await this.prisma.corpContractRenewal.count({ where: { hotelId, status: 'pending' } });
        break;
      case 'meetings':
        summary.total = await this.prisma.corpSalesMeeting.count({ where: { hotelId } });
        break;
      default:
        summary.companies = await this.prisma.corporateCompany.count({ where: { hotelId, deletedAt: null } });
        summary.leads = await this.prisma.corpSalesLead.count({ where: { hotelId, deletedAt: null } });
        summary.contracts = await this.prisma.corporateContract.count({ where: { hotelId, deletedAt: null } });
    }

    return { type, summary };
  }
}
