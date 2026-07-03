import { Injectable } from '@nestjs/common';
import { EventQuotationStatus, EventStatus, EventTaskStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  EventsDashboardStats,
  EventsOperationsStats,
  EventsOwnerDashboardStats,
} from '@tungaos/shared';

const ACTIVE_LEAD_STATUSES = [
  'NEW',
  'ASSIGNED',
  'VENUE_VISIT',
  'PROPOSAL',
  'QUOTATION',
  'NEGOTIATION',
] as const;

const WEDDING_TYPES = ['Wedding', 'Reception', 'Engagement'];
const CORPORATE_TYPES = ['Corporate Meeting', 'Conference', 'Seminar', 'Training', 'Product Launch'];
const BIRTHDAY_TYPES = ['Birthday', 'Baby Shower'];

@Injectable()
export class EventsDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<EventsDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const [
      todaysEvents,
      upcomingEvents,
      activeLeads,
      confirmedBookings,
      pendingQuotations,
      pendingPayments,
      todaysPayments,
      monthlyPayments,
      halls,
      hallBlocks,
      totalLeads,
      wonLeads,
      paymentAvg,
      upcomingList,
      revenueGroups,
    ] = await Promise.all([
      this.prisma.event.count({
        where: {
          hotelId,
          deletedAt: null,
          startDate: { gte: today, lt: tomorrow },
          status: { in: [EventStatus.CONFIRMED, EventStatus.IN_PROGRESS] },
        },
      }),
      this.prisma.event.count({
        where: {
          hotelId,
          deletedAt: null,
          startDate: { gte: tomorrow },
          status: { in: [EventStatus.TENTATIVE, EventStatus.CONFIRMED] },
        },
      }),
      this.prisma.eventLead.count({
        where: {
          hotelId,
          deletedAt: null,
          status: { in: [...ACTIVE_LEAD_STATUSES] },
        },
      }),
      this.prisma.event.count({
        where: { hotelId, deletedAt: null, status: EventStatus.CONFIRMED },
      }),
      this.prisma.eventQuotation.count({
        where: {
          hotelId,
          status: { in: [EventQuotationStatus.DRAFT, EventQuotationStatus.SENT, EventQuotationStatus.REVISION] },
        },
      }),
      this.prisma.event.count({
        where: {
          hotelId,
          deletedAt: null,
          status: { in: [EventStatus.CONFIRMED, EventStatus.IN_PROGRESS, EventStatus.COMPLETED] },
          payments: { none: { paymentType: 'FINAL_SETTLEMENT' } },
        },
      }),
      this.prisma.eventPayment.aggregate({
        where: { hotelId, paidAt: { gte: today, lt: tomorrow } },
        _sum: { amount: true },
      }),
      this.prisma.eventPayment.aggregate({
        where: { hotelId, paidAt: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
      this.prisma.banquetHall.count({ where: { hotelId, isActive: true, deletedAt: null } }),
      this.prisma.hallAvailability.count({
        where: {
          hotelId,
          blockDate: { gte: today, lt: tomorrow },
          blockType: 'BOOKING',
        },
      }),
      this.prisma.eventLead.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.eventLead.count({
        where: {
          hotelId,
          deletedAt: null,
          status: { in: ['CONFIRMED', 'COMPLETED', 'ADVANCE_PAID', 'PLANNING', 'OPERATIONS', 'EXECUTION', 'BILLING'] },
        },
      }),
      this.prisma.eventPayment.aggregate({
        where: { hotelId },
        _avg: { amount: true },
      }),
      this.listUpcomingBookings(hotelId),
      this.prisma.eventPayment.groupBy({
        by: ['eventId'],
        where: { hotelId, paidAt: { gte: monthStart, lte: monthEnd } },
        _sum: { amount: true },
      }),
    ]);

    const eventTypes = await this.prisma.event.findMany({
      where: { hotelId, deletedAt: null },
      select: { id: true, eventType: true },
    });
    const typeMap = new Map(eventTypes.map((e) => [e.id, e.eventType]));

    let weddingRevenue = 0;
    let corporateRevenue = 0;
    let birthdayRevenue = 0;
    for (const g of revenueGroups) {
      const type = typeMap.get(g.eventId) ?? '';
      const amount = Number(g._sum.amount ?? 0);
      if (WEDDING_TYPES.some((t) => type.includes(t))) weddingRevenue += amount;
      else if (CORPORATE_TYPES.some((t) => type.includes(t))) corporateRevenue += amount;
      else if (BIRTHDAY_TYPES.some((t) => type.includes(t))) birthdayRevenue += amount;
    }

    const hallOccupancyPct = halls > 0 ? Math.round((hallBlocks / halls) * 100) : 0;
    const leadConversionPct = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    const revenueByType = [
      { type: 'Wedding', amount: weddingRevenue },
      { type: 'Corporate', amount: corporateRevenue },
      { type: 'Birthday', amount: birthdayRevenue },
    ];

    return {
      todaysEvents,
      upcomingEvents,
      activeLeads,
      confirmedBookings,
      pendingQuotations,
      pendingPayments,
      todaysRevenue: Number(todaysPayments._sum.amount ?? 0),
      monthlyRevenue: Number(monthlyPayments._sum.amount ?? 0),
      hallOccupancyPct,
      weddingRevenue,
      corporateRevenue,
      birthdayRevenue,
      leadConversionPct,
      averageEventValue: Math.round(Number(paymentAvg._avg.amount ?? 0)),
      revenueByType,
      upcomingList,
    };
  }

  async getOwnerDashboard(hotelId: string): Promise<EventsOwnerDashboardStats> {
    const dashboard = await this.getDashboard(hotelId);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const halls = await this.prisma.banquetHall.count({
      where: { hotelId, isActive: true, deletedAt: null },
    });
    const bookedHalls = await this.prisma.hallAvailability.groupBy({
      by: ['hallId'],
      where: {
        hotelId,
        blockDate: { gte: monthStart },
        blockType: 'BOOKING',
      },
    });

    return {
      monthlyEventRevenue: dashboard.monthlyRevenue,
      averageBookingValue: dashboard.averageEventValue,
      leadConversionPct: dashboard.leadConversionPct,
      weddingRevenue: dashboard.weddingRevenue,
      corporateRevenue: dashboard.corporateRevenue,
      topSalesExecutive: null,
      hallUtilizationPct: halls > 0 ? Math.round((bookedHalls.length / halls) * 100) : 0,
      profitMarginPct: 32,
    };
  }

  async getOperationsDashboard(hotelId: string): Promise<EventsOperationsStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const eventIds = (
      await this.prisma.event.findMany({
        where: {
          hotelId,
          deletedAt: null,
          startDate: { gte: today, lt: tomorrow },
        },
        select: { id: true },
      })
    ).map((e) => e.id);

    const [tasks, kitchenTasks, decorTasks, roomBlocks] = await Promise.all([
      this.prisma.eventTask.findMany({
        where: { hotelId, eventId: { in: eventIds } },
      }),
      this.prisma.eventTask.count({
        where: {
          hotelId,
          eventId: { in: eventIds },
          category: 'Kitchen',
          status: EventTaskStatus.COMPLETED,
        },
      }),
      this.prisma.eventTask.count({
        where: {
          hotelId,
          eventId: { in: eventIds },
          category: 'Decoration',
          status: EventTaskStatus.COMPLETED,
        },
      }),
      this.prisma.eventRoomBlock.findMany({
        where: { hotelId, eventId: { in: eventIds } },
      }),
    ]);

    const categories = ['Decoration', 'Kitchen', 'Housekeeping', 'Audio', 'Lighting', 'Security'];
    const tasksByCategory = categories.map((category) => {
      const catTasks = tasks.filter((t) => t.category === category);
      return {
        category,
        pending: catTasks.filter((t) => t.status !== EventTaskStatus.COMPLETED).length,
        completed: catTasks.filter((t) => t.status === EventTaskStatus.COMPLETED).length,
      };
    });

    const pmsSynced = roomBlocks.filter((r) => r.pmsSynced).length;
    const roomReadinessPct = roomBlocks.length > 0 ? Math.round((pmsSynced / roomBlocks.length) * 100) : 100;

    return {
      todaysTasks: tasks.length,
      staffAssigned: new Set(tasks.map((t) => t.ownerName).filter(Boolean)).size,
      kitchenReady: kitchenTasks,
      decorationReady: decorTasks,
      roomReadinessPct,
      pendingDeliverables: tasks.filter((t) => t.status === EventTaskStatus.PENDING).length,
      tasksByCategory,
    };
  }

  private async listUpcomingBookings(hotelId: string) {
    const rows = await this.prisma.event.findMany({
      where: {
        hotelId,
        deletedAt: null,
        startDate: { gte: new Date() },
        status: { in: [EventStatus.TENTATIVE, EventStatus.CONFIRMED, EventStatus.IN_PROGRESS] },
      },
      include: {
        hall: true,
        client: true,
        banquetBookings: true,
      },
      orderBy: { startDate: 'asc' },
      take: 5,
    });

    return rows.map((e) => ({
      id: e.id,
      eventCode: e.eventCode,
      name: e.name,
      eventType: e.eventType,
      status: e.status,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      hallName: e.hall?.name ?? e.venue,
      expectedGuests: e.expectedGuests,
      totalAmount: Number(e.banquetBookings[0]?.totalAmount ?? e.expectedRevenue ?? 0),
      clientName: e.client?.name ?? e.organizerName,
    }));
  }

  async getReport(hotelId: string, type: string) {
    const summary: Record<string, number> = {};

    switch (type) {
      case 'register':
        summary.totalEvents = await this.prisma.event.count({ where: { hotelId, deletedAt: null } });
        summary.confirmed = await this.prisma.event.count({
          where: { hotelId, deletedAt: null, status: EventStatus.CONFIRMED },
        });
        summary.completed = await this.prisma.event.count({
          where: { hotelId, deletedAt: null, status: EventStatus.COMPLETED },
        });
        break;
      case 'revenue': {
        const agg = await this.prisma.eventPayment.aggregate({
          where: { hotelId },
          _sum: { amount: true },
          _count: true,
        });
        summary.totalRevenue = Number(agg._sum.amount ?? 0);
        summary.paymentCount = agg._count;
        break;
      }
      case 'leads':
        summary.totalLeads = await this.prisma.eventLead.count({ where: { hotelId, deletedAt: null } });
        summary.activeLeads = await this.prisma.eventLead.count({
          where: { hotelId, deletedAt: null, status: { in: [...ACTIVE_LEAD_STATUSES] } },
        });
        summary.lostLeads = await this.prisma.eventLead.count({
          where: { hotelId, deletedAt: null, status: 'LOST' },
        });
        break;
      case 'quotations':
        summary.total = await this.prisma.eventQuotation.count({ where: { hotelId } });
        summary.pending = await this.prisma.eventQuotation.count({
          where: {
            hotelId,
            status: { in: [EventQuotationStatus.DRAFT, EventQuotationStatus.SENT] },
          },
        });
        summary.approved = await this.prisma.eventQuotation.count({
          where: { hotelId, status: EventQuotationStatus.APPROVED },
        });
        break;
      case 'halls':
        summary.totalHalls = await this.prisma.banquetHall.count({ where: { hotelId, deletedAt: null } });
        summary.activeHalls = await this.prisma.banquetHall.count({
          where: { hotelId, deletedAt: null, isActive: true },
        });
        break;
      case 'vendors':
        summary.totalVendors = await this.prisma.eventVendor.count({ where: { hotelId } });
        summary.preferred = await this.prisma.eventVendor.count({ where: { hotelId, isPreferred: true } });
        break;
      case 'tasks':
        summary.totalTasks = await this.prisma.eventTask.count({ where: { hotelId } });
        summary.pending = await this.prisma.eventTask.count({
          where: { hotelId, status: EventTaskStatus.PENDING },
        });
        summary.completed = await this.prisma.eventTask.count({
          where: { hotelId, status: EventTaskStatus.COMPLETED },
        });
        break;
      default:
        summary.events = await this.prisma.event.count({ where: { hotelId, deletedAt: null } });
        summary.leads = await this.prisma.eventLead.count({ where: { hotelId, deletedAt: null } });
        summary.quotations = await this.prisma.eventQuotation.count({ where: { hotelId } });
    }

    return { type, summary };
  }
}
