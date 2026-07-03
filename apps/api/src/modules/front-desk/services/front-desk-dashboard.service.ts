import { Injectable } from '@nestjs/common';
import { FolioChargeCategory, ReservationStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FrontDeskRealtimeGateway } from '@/modules/front-desk/gateways/front-desk-realtime.gateway';

import type { FrontDeskDashboardStats, FrontDeskPerformanceStats } from '@tungaos/shared';

@Injectable()
export class FrontDeskDashboardService {
  constructor(
    private prisma: PrismaService,
    private realtime: FrontDeskRealtimeGateway,
  ) {}

  async getDashboard(hotelId: string): Promise<FrontDeskDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayArrivals,
      todayDepartures,
      currentCheckIns,
      pendingCheckIns,
      pendingCheckOuts,
      walkInGuests,
      roomCounts,
      vipGuests,
      corporateGuests,
      pendingPayments,
      revenue,
      restaurantCharges,
      laundryCharges,
      airportPickups,
      earlyCheckIns,
      openComplaints,
      unreadMessages,
    ] = await Promise.all([
      this.prisma.reservation.count({
        where: { hotelId, checkInDate: today, deletedAt: null, status: { in: ['CONFIRMED', 'GUARANTEED', 'PENDING'] } },
      }),
      this.prisma.reservation.count({
        where: { hotelId, checkOutDate: today, status: ReservationStatus.CHECKED_IN, deletedAt: null },
      }),
      this.prisma.reservation.count({ where: { hotelId, status: ReservationStatus.CHECKED_IN, deletedAt: null } }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          checkInDate: { lte: today },
          status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.GUARANTEED] },
          deletedAt: null,
        },
      }),
      this.prisma.reservation.count({
        where: { hotelId, checkOutDate: { lte: today }, status: ReservationStatus.CHECKED_IN, deletedAt: null },
      }),
      this.prisma.reservation.count({
        where: { hotelId, source: 'WALK_IN', checkInDate: today, deletedAt: null },
      }),
      this.prisma.room.groupBy({ by: ['status'], where: { hotelId, isActive: true, deletedAt: null }, _count: true }),
      this.prisma.guest.count({ where: { hotelId, vipStatus: true, isActive: true } }),
      this.prisma.guest.count({ where: { hotelId, isCorporate: true, isActive: true } }),
      this.prisma.invoice.count({ where: { hotelId, status: { in: ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] } } }),
      this.prisma.payment.aggregate({
        where: { hotelId, paidAt: { gte: today, lt: tomorrow }, status: 'CAPTURED' },
        _sum: { amount: true },
      }),
      this.prisma.folioCharge.aggregate({
        where: { hotelId, category: FolioChargeCategory.RESTAURANT, postedAt: { gte: today, lt: tomorrow } },
        _sum: { totalAmount: true },
      }),
      this.prisma.folioCharge.aggregate({
        where: { hotelId, category: FolioChargeCategory.LAUNDRY, postedAt: { gte: today, lt: tomorrow } },
        _sum: { totalAmount: true },
      }),
      this.prisma.airportPickup.count({ where: { hotelId, status: { in: ['SCHEDULED', 'DRIVER_ASSIGNED'] } } }),
      this.prisma.guestRequest.count({
        where: { hotelId, requestType: 'EARLY_CHECKIN', status: { in: ['PENDING', 'APPROVED'] } },
      }),
      this.prisma.complaint.count({ where: { hotelId, status: { in: ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS'] } } }),
      this.prisma.guestCommunication.count({
        where: { hotelId, readAt: null, status: 'DELIVERED' },
      }),
    ]);

    const statusMap = Object.fromEntries(
      roomCounts.map((r: { status: RoomStatus; _count: number }) => [r.status, r._count]),
    );
    const available =
      (statusMap[RoomStatus.VACANT_CLEAN] ?? 0) +
      (statusMap[RoomStatus.VACANT] ?? 0) +
      (statusMap[RoomStatus.INSPECTED] ?? 0);
    const occupied = statusMap[RoomStatus.OCCUPIED] ?? 0;
    const dirty = (statusMap[RoomStatus.VACANT_DIRTY] ?? 0) + (statusMap[RoomStatus.DIRTY] ?? 0);
    const cleaning = statusMap[RoomStatus.CLEANING] ?? 0;
    const maintenance =
      (statusMap[RoomStatus.OUT_OF_ORDER] ?? 0) +
      (statusMap[RoomStatus.UNDER_MAINTENANCE] ?? 0);

    const lateCheckouts = await this.prisma.guestRequest.count({
      where: { hotelId, requestType: 'LATE_CHECKOUT', status: { in: ['PENDING', 'APPROVED'] } },
    });

    return {
      todayArrivals,
      todayDepartures,
      currentCheckIns,
      pendingCheckIns,
      pendingCheckOuts,
      walkInGuests,
      availableRooms: available,
      occupiedRooms: occupied,
      dirtyRooms: dirty,
      cleaningRooms: cleaning,
      maintenanceRooms: maintenance,
      vipGuests,
      corporateGuests,
      pendingPayments,
      todayRevenue: Number(revenue._sum.amount ?? 0),
      restaurantCharges: Number(restaurantCharges._sum.totalAmount ?? 0),
      laundryCharges: Number(laundryCharges._sum.totalAmount ?? 0),
      airportPickups,
      lateCheckouts,
      earlyCheckIns,
      openComplaints,
      unreadMessages,
    };
  }

  async getPerformance(hotelId: string): Promise<FrontDeskPerformanceStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [feedbacks, complaints, upgrades, lateRequests] = await Promise.all([
      this.prisma.feedback.aggregate({
        where: { hotelId, createdAt: { gte: thirtyDaysAgo } },
        _avg: { rating: true },
      }),
      this.prisma.complaint.count({ where: { hotelId, status: { notIn: ['CLOSED', 'RESOLVED'] } } }),
      this.prisma.roomTransfer.aggregate({
        where: { hotelId, transferType: 'UPGRADE', createdAt: { gte: thirtyDaysAgo } },
        _sum: { rateAdjustment: true },
        _count: true,
      }),
      this.prisma.guestRequest.findMany({
        where: { hotelId, requestType: 'LATE_CHECKOUT', status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
        select: { chargeAmount: true },
      }),
    ]);

    return {
      avgCheckInMinutes: 8,
      avgCheckoutMinutes: 6,
      guestSatisfaction: Math.round(Number(feedbacks._avg.rating ?? 0) * 10) / 10,
      openComplaints: complaints,
      upgradeRevenue: Number(upgrades._sum.rateAdjustment ?? 0),
      lateCheckoutRevenue: lateRequests.reduce(
        (s: number, r: { chargeAmount: unknown }) => s + Number(r.chargeAmount),
        0,
      ),
    };
  }

  refresh(hotelId: string) {
    this.realtime.emitDashboard(hotelId);
  }
}
