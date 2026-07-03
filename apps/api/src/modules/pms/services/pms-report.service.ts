import { Injectable } from '@nestjs/common';
import { NightAuditStatus, Prisma, ReservationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsDashboardService } from '@/modules/pms/services/pms-dashboard.service';

import type { NightAuditSummary, PmsSearchResult } from '@tungaos/shared';

@Injectable()
export class PmsNightAuditService {
  constructor(
    private prisma: PrismaService,
    private dashboard: PmsDashboardService,
  ) {}

  async run(hotelId: string, auditDate: string, userId?: string): Promise<NightAuditSummary> {
    const date = new Date(auditDate);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const ownerStats = await this.dashboard.getOwnerDashboard(hotelId);
    const execStats = await this.dashboard.getExecutiveDashboard(hotelId);

    const [cashPayments, openFolios, pendingCheckouts] = await Promise.all([
      this.prisma.payment.aggregate({
        where: {
          hotelId,
          method: 'CASH',
          paidAt: { gte: date, lt: nextDay },
          status: 'CAPTURED',
        },
        _sum: { amount: true },
      }),
      this.prisma.reservation.count({
        where: { hotelId, status: ReservationStatus.CHECKED_IN, deletedAt: null },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          checkOutDate: { lte: date },
          status: ReservationStatus.CHECKED_IN,
          deletedAt: null,
        },
      }),
    ]);

    const audit = await this.prisma.nightAudit.upsert({
      where: { hotelId_auditDate: { hotelId, auditDate: date } },
      create: {
        hotelId,
        auditDate: date,
        status: NightAuditStatus.COMPLETED,
        roomRevenue: execStats.roomRevenue,
        restaurantRevenue: execStats.restaurantRevenue,
        totalRevenue: execStats.revenueToday,
        occupancyPct: execStats.occupancyPct,
        adr: ownerStats.adr,
        revPar: ownerStats.revPar,
        cashReconciliation: Number(cashPayments._sum.amount ?? 0),
        openFolios,
        pendingCheckouts,
        startedAt: new Date(),
        completedAt: new Date(),
        createdBy: userId,
        summary: { ownerStats, execStats } as unknown as Prisma.InputJsonValue,
      },
      update: {
        status: NightAuditStatus.COMPLETED,
        completedAt: new Date(),
        roomRevenue: execStats.roomRevenue,
        restaurantRevenue: execStats.restaurantRevenue,
        totalRevenue: execStats.revenueToday,
        occupancyPct: execStats.occupancyPct,
        adr: ownerStats.adr,
        revPar: ownerStats.revPar,
        cashReconciliation: Number(cashPayments._sum.amount ?? 0),
        openFolios,
        pendingCheckouts,
      },
    });

    return {
      id: audit.id,
      auditDate: audit.auditDate.toISOString().split('T')[0]!,
      status: audit.status,
      roomRevenue: Number(audit.roomRevenue),
      restaurantRevenue: Number(audit.restaurantRevenue),
      totalRevenue: Number(audit.totalRevenue),
      occupancyPct: Number(audit.occupancyPct),
      adr: Number(audit.adr),
      revPar: Number(audit.revPar),
      cashReconciliation: Number(audit.cashReconciliation),
      openFolios: audit.openFolios,
      pendingCheckouts: audit.pendingCheckouts,
    };
  }

  async list(hotelId: string, limit = 30) {
    return this.prisma.nightAudit.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { auditDate: 'desc' },
      take: limit,
    });
  }
}

@Injectable()
export class PmsSearchService {
  constructor(private prisma: PrismaService) {}

  async search(hotelId: string, query: string, limit = 20): Promise<PmsSearchResult[]> {
    if (!query || query.length < 2) return [];

    const [guests, reservations, rooms, invoices] = await Promise.all([
      this.prisma.guest.findMany({
        where: {
          hotelId,
          deletedAt: null,
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
            { guestCode: { contains: query, mode: 'insensitive' } },
            { companyName: { contains: query, mode: 'insensitive' } },
            { passportNumber: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
      this.prisma.reservation.findMany({
        where: {
          hotelId,
          deletedAt: null,
          OR: [
            { reservationCode: { contains: query, mode: 'insensitive' } },
            { otaReference: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { guest: true },
        take: limit,
      }),
      this.prisma.room.findMany({
        where: {
          hotelId,
          deletedAt: null,
          roomNumber: { contains: query, mode: 'insensitive' },
        },
        take: limit,
      }),
      this.prisma.invoice.findMany({
        where: {
          hotelId,
          deletedAt: null,
          invoiceNumber: { contains: query, mode: 'insensitive' },
        },
        take: limit,
      }),
    ]);

    const results: PmsSearchResult[] = [
      ...guests.map((g) => ({
        type: 'guest' as const,
        id: g.id,
        title: `${g.firstName} ${g.lastName}`,
        subtitle: g.phone ?? g.email ?? g.guestCode,
        href: `/app/crm/guests/${g.id}`,
      })),
      ...reservations.map((r) => ({
        type: 'reservation' as const,
        id: r.id,
        title: r.reservationCode,
        subtitle: `${r.guest.firstName} ${r.guest.lastName}`,
        href: `/app/reservations/${r.id}`,
      })),
      ...rooms.map((r) => ({
        type: 'room' as const,
        id: r.id,
        title: `Room ${r.roomNumber}`,
        subtitle: r.status,
        href: `/app/rooms/${r.id}`,
      })),
      ...invoices.map((i) => ({
        type: 'invoice' as const,
        id: i.id,
        title: i.invoiceNumber,
        subtitle: i.status,
        href: `/app/finance/invoices/${i.id}`,
      })),
    ];

    return results.slice(0, limit);
  }
}

@Injectable()
export class PmsReportService {
  constructor(private prisma: PrismaService) {}

  async generate(hotelId: string, reportType: string, from?: string, to?: string) {
    const start = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = to ? new Date(to) : new Date();

    switch (reportType) {
      case 'occupancy':
        return this.occupancyReport(hotelId, start, end);
      case 'arrivals':
        return this.arrivalsReport(hotelId, start, end);
      case 'departures':
        return this.departuresReport(hotelId, start, end);
      case 'revenue':
        return this.revenueReport(hotelId, start, end);
      case 'cancellation':
        return this.cancellationReport(hotelId, start, end);
      case 'no-show':
        return this.noShowReport(hotelId, start, end);
      case 'corporate':
        return this.corporateReport(hotelId, start, end);
      case 'housekeeping':
        return this.housekeepingReport(hotelId);
      default:
        return { reportType, message: 'Report generated', period: { start, end } };
    }
  }

  private async occupancyReport(hotelId: string, start: Date, end: Date) {
    const totalRooms = await this.prisma.room.count({ where: { hotelId, isActive: true } });
    const reservations = await this.prisma.reservation.count({
      where: {
        hotelId,
        checkInDate: { gte: start, lte: end },
        status: { in: ['CHECKED_IN', 'CHECKED_OUT'] },
      },
    });
    return {
      reportType: 'occupancy',
      totalRooms,
      reservations,
      generatedAt: new Date().toISOString(),
    };
  }

  private async arrivalsReport(hotelId: string, start: Date, end: Date) {
    const items = await this.prisma.reservation.findMany({
      where: { hotelId, checkInDate: { gte: start, lte: end }, deletedAt: null },
      include: { guest: true, roomType: true, room: true },
      orderBy: { checkInDate: 'asc' },
    });
    return { reportType: 'arrivals', count: items.length, items, generatedAt: new Date().toISOString() };
  }

  private async departuresReport(hotelId: string, start: Date, end: Date) {
    const items = await this.prisma.reservation.findMany({
      where: { hotelId, checkOutDate: { gte: start, lte: end }, deletedAt: null },
      include: { guest: true, room: true },
      orderBy: { checkOutDate: 'asc' },
    });
    return { reportType: 'departures', count: items.length, items, generatedAt: new Date().toISOString() };
  }

  private async revenueReport(hotelId: string, start: Date, end: Date) {
    const payments = await this.prisma.payment.aggregate({
      where: { hotelId, paidAt: { gte: start, lte: end }, status: 'CAPTURED' },
      _sum: { amount: true },
      _count: true,
    });
    return {
      reportType: 'revenue',
      totalRevenue: Number(payments._sum.amount ?? 0),
      transactionCount: payments._count,
      generatedAt: new Date().toISOString(),
    };
  }

  private async cancellationReport(hotelId: string, start: Date, end: Date) {
    const items = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        status: 'CANCELLED',
        updatedAt: { gte: start, lte: end },
      },
      include: { guest: true },
    });
    return { reportType: 'cancellation', count: items.length, items, generatedAt: new Date().toISOString() };
  }

  private async noShowReport(hotelId: string, start: Date, end: Date) {
    const items = await this.prisma.reservation.findMany({
      where: { hotelId, status: 'NO_SHOW', checkInDate: { gte: start, lte: end } },
      include: { guest: true },
    });
    return { reportType: 'no-show', count: items.length, items, generatedAt: new Date().toISOString() };
  }

  private async corporateReport(hotelId: string, start: Date, end: Date) {
    const items = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        corporateBookingId: { not: null },
        checkInDate: { gte: start, lte: end },
      },
      include: { guest: true, corporateBooking: { include: { company: true } } },
    });
    const total = items.reduce((s, r) => s + Number(r.totalAmount), 0);
    return { reportType: 'corporate', count: items.length, totalRevenue: total, items, generatedAt: new Date().toISOString() };
  }

  private async housekeepingReport(hotelId: string) {
    const tasks = await this.prisma.housekeepingTask.groupBy({
      by: ['status'],
      where: { hotelId, isActive: true },
      _count: true,
    });
    const roomStatus = await this.prisma.room.groupBy({
      by: ['status'],
      where: { hotelId, isActive: true },
      _count: true,
    });
    return { reportType: 'housekeeping', tasks, roomStatus, generatedAt: new Date().toISOString() };
  }
}
