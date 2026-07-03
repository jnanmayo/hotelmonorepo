import { Injectable } from '@nestjs/common';
import { HousekeepingStatus, ReservationStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';

import type { OwnerDashboardStats, PmsDashboardStats } from '@tungaos/shared';

@Injectable()
export class PmsDashboardService {
  constructor(
    private prisma: PrismaService,
    private realtime: PmsRealtimeGateway,
  ) {}

  async getExecutiveDashboard(hotelId: string): Promise<PmsDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalRooms,
      roomStatusCounts,
      todayArrivals,
      todayDepartures,
      checkedIn,
      vipGuests,
      corporateGuests,
      pendingPayments,
      pendingCheckIns,
      pendingCheckOuts,
      roomRevenue,
      restaurantRevenue,
    ] = await Promise.all([
      this.prisma.room.count({ where: { hotelId, isActive: true, deletedAt: null } }),
      this.prisma.room.groupBy({
        by: ['status'],
        where: { hotelId, isActive: true, deletedAt: null },
        _count: true,
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          checkInDate: today,
          status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.GUARANTEED, ReservationStatus.PENDING] },
          deletedAt: null,
        },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          checkOutDate: today,
          status: ReservationStatus.CHECKED_IN,
          deletedAt: null,
        },
      }),
      this.prisma.reservation.count({
        where: { hotelId, status: ReservationStatus.CHECKED_IN, deletedAt: null },
      }),
      this.prisma.guest.count({
        where: { hotelId, vipStatus: true, isActive: true, deletedAt: null },
      }),
      this.prisma.guest.count({
        where: { hotelId, isCorporate: true, isActive: true, deletedAt: null },
      }),
      this.prisma.invoice.count({
        where: {
          hotelId,
          status: { in: ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] },
          deletedAt: null,
        },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          checkInDate: { lte: today },
          status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.GUARANTEED] },
          deletedAt: null,
        },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          checkOutDate: { lte: today },
          status: ReservationStatus.CHECKED_IN,
          deletedAt: null,
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          hotelId,
          paidAt: { gte: today, lt: tomorrow },
          status: 'CAPTURED',
          deletedAt: null,
        },
        _sum: { amount: true },
      }),
      this.prisma.folioCharge.aggregate({
        where: {
          hotelId,
          category: 'RESTAURANT',
          postedAt: { gte: today, lt: tomorrow },
          deletedAt: null,
        },
        _sum: { totalAmount: true },
      }),
    ]);

    const statusMap = Object.fromEntries(roomStatusCounts.map((s) => [s.status, s._count]));
    const dirtyRooms =
      (statusMap[RoomStatus.VACANT_DIRTY] ?? 0) + (statusMap[RoomStatus.DIRTY] ?? 0);
    const cleaningRooms = statusMap[RoomStatus.CLEANING] ?? 0;
    const underMaintenance =
      (statusMap[RoomStatus.OUT_OF_ORDER] ?? 0) +
      (statusMap[RoomStatus.UNDER_MAINTENANCE] ?? 0) +
      (statusMap[RoomStatus.OUT_OF_SERVICE] ?? 0);
    const blockedRooms = statusMap[RoomStatus.BLOCKED] ?? 0;
    const occupied =
      (statusMap[RoomStatus.OCCUPIED] ?? 0) + (statusMap[RoomStatus.RESERVED] ?? 0);
    const available =
      (statusMap[RoomStatus.VACANT_CLEAN] ?? 0) +
      (statusMap[RoomStatus.VACANT] ?? 0) +
      (statusMap[RoomStatus.INSPECTED] ?? 0);

    const roomRev = Number(roomRevenue._sum.amount ?? 0);
    const restRev = Number(restaurantRevenue._sum.totalAmount ?? 0);

    return {
      todayArrivals,
      todayDepartures,
      currentOccupancy: checkedIn,
      occupancyPct: totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0,
      availableRooms: available,
      dirtyRooms,
      cleaningRooms,
      underMaintenance,
      blockedRooms,
      vipGuests,
      corporateGuests,
      pendingPayments,
      pendingCheckIns,
      pendingCheckOuts,
      revenueToday: roomRev + restRev,
      restaurantRevenue: restRev,
      roomRevenue: roomRev,
      totalRooms,
    };
  }

  async getOwnerDashboard(hotelId: string): Promise<OwnerDashboardStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [reservations, payments, feedbacks, totalRooms] = await Promise.all([
      this.prisma.reservation.findMany({
        where: {
          hotelId,
          checkInDate: { gte: thirtyDaysAgo },
          status: { in: [ReservationStatus.CHECKED_IN, ReservationStatus.CHECKED_OUT] },
          deletedAt: null,
        },
        select: {
          roomRate: true,
          checkInDate: true,
          checkOutDate: true,
          source: true,
          corporateBookingId: true,
          totalAmount: true,
        },
      }),
      this.prisma.payment.aggregate({
        where: { hotelId, paidAt: { gte: thirtyDaysAgo }, status: 'CAPTURED', deletedAt: null },
        _sum: { amount: true },
      }),
      this.prisma.feedback.aggregate({
        where: { hotelId, createdAt: { gte: thirtyDaysAgo }, deletedAt: null },
        _avg: { rating: true },
      }),
      this.prisma.room.count({ where: { hotelId, isActive: true, deletedAt: null } }),
    ]);

    const nights = reservations.reduce((sum, r) => {
      const days = Math.max(
        1,
        Math.ceil((r.checkOutDate.getTime() - r.checkInDate.getTime()) / 86400000),
      );
      return sum + days;
    }, 0);

    const roomRevenue = reservations.reduce((s, r) => s + Number(r.totalAmount), 0);
    const adr = nights > 0 ? roomRevenue / nights : 0;
    const daysInPeriod = 30;
    const revPar = totalRooms > 0 ? roomRevenue / (totalRooms * daysInPeriod) : 0;
    const occupancy = totalRooms > 0 ? (nights / (totalRooms * daysInPeriod)) * 100 : 0;
    const avgStay = reservations.length > 0 ? nights / reservations.length : 0;

    const otaSources = ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT', 'CHANNEL_MANAGER'];
    const otaCount = reservations.filter((r) => otaSources.includes(r.source)).length;
    const directCount = reservations.filter((r) => r.source === 'DIRECT_WEBSITE' || r.source === 'WALK_IN').length;
    const corporateRevenue = reservations
      .filter((r) => r.corporateBookingId)
      .reduce((s, r) => s + Number(r.totalAmount), 0);
    const otaRevenue = reservations
      .filter((r) => otaSources.includes(r.source))
      .reduce((s, r) => s + Number(r.totalAmount), 0);

    return {
      adr: Math.round(adr),
      revPar: Math.round(revPar),
      occupancy: Math.round(occupancy),
      averageStay: Math.round(avgStay * 10) / 10,
      revenue: Number(payments._sum.amount ?? roomRevenue),
      guestSatisfaction: Math.round(Number(feedbacks._avg.rating ?? 0) * 10) / 10,
      corporateRevenue,
      otaRevenue,
      directBookingPct: reservations.length > 0 ? Math.round((directCount / reservations.length) * 100) : 0,
    };
  }

  notifyDashboardRefresh(hotelId: string) {
    this.realtime.emitDashboardUpdate(hotelId);
  }
}
