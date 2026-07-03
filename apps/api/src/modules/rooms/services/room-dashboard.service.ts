import { Injectable } from '@nestjs/common';
import { ReservationStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';

import type { RoomDashboardStats, RoomOwnerStats } from '@tungaos/shared';

@Injectable()
export class RoomDashboardService {
  constructor(
    private prisma: PrismaService,
    private realtime: PmsRealtimeGateway,
  ) {}

  notifyRefresh(hotelId: string) {
    this.realtime.emitDashboardUpdate(hotelId);
    this.realtime.emitToHotel(hotelId, {
      type: 'occupancy:update',
      hotelId,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  async getDashboard(hotelId: string): Promise<RoomDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [
      totalRooms,
      statusCounts,
      vipReservations,
      corporateReservations,
      revenueToday,
      revenueMonth,
      checkedInReservations,
      bookingCounts,
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
          status: ReservationStatus.CHECKED_IN,
          deletedAt: null,
          guest: { vipStatus: true },
        },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          status: ReservationStatus.CHECKED_IN,
          deletedAt: null,
          guest: { isCorporate: true },
        },
      }),
      this.prisma.payment.aggregate({
        where: { hotelId, paidAt: { gte: today, lt: tomorrow }, status: 'CAPTURED', deletedAt: null },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { hotelId, paidAt: { gte: monthStart, lt: nextMonth }, status: 'CAPTURED', deletedAt: null },
        _sum: { amount: true },
      }),
      this.prisma.reservation.findMany({
        where: { hotelId, status: ReservationStatus.CHECKED_IN, deletedAt: null },
        select: { checkInDate: true, totalAmount: true },
      }),
      this.prisma.reservation.groupBy({
        by: ['roomId'],
        where: { hotelId, roomId: { not: null }, deletedAt: null, status: { not: ReservationStatus.CANCELLED } },
        _count: true,
      }),
    ]);

    const map = Object.fromEntries(statusCounts.map((s) => [s.status, s._count]));
    const available =
      (map[RoomStatus.VACANT_CLEAN] ?? 0) +
      (map[RoomStatus.VACANT] ?? 0) +
      (map[RoomStatus.INSPECTED] ?? 0);
    const dirty = (map[RoomStatus.VACANT_DIRTY] ?? 0) + (map[RoomStatus.DIRTY] ?? 0);
    const maintenance =
      (map[RoomStatus.OUT_OF_ORDER] ?? 0) +
      (map[RoomStatus.UNDER_MAINTENANCE] ?? 0) +
      (map[RoomStatus.OUT_OF_SERVICE] ?? 0);

    const occupied = map[RoomStatus.OCCUPIED] ?? 0;
    const reserved = map[RoomStatus.RESERVED] ?? 0;
    const occupancyPct = totalRooms > 0 ? ((occupied + reserved) / totalRooms) * 100 : 0;

    let totalStayNights = 0;
    let totalRevenue = 0;
    for (const r of checkedInReservations) {
      const nights = Math.max(1, Math.ceil((today.getTime() - r.checkInDate.getTime()) / 86400000));
      totalStayNights += nights;
      totalRevenue += Number(r.totalAmount);
    }
    const averageStay = checkedInReservations.length > 0 ? totalStayNights / checkedInReservations.length : 0;
    const averageRoomRate = totalStayNights > 0 ? totalRevenue / totalStayNights : 0;

    const roomIds = bookingCounts.map((b) => b.roomId).filter(Boolean) as string[];
    const rooms = roomIds.length
      ? await this.prisma.room.findMany({ where: { id: { in: roomIds } }, select: { id: true, roomNumber: true } })
      : [];
    const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));
    const ranked = bookingCounts
      .filter((b) => b.roomId)
      .map((b) => ({ roomNumber: roomMap[b.roomId!] ?? '—', count: b._count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalRooms,
      availableRooms: available,
      occupiedRooms: occupied,
      reservedRooms: reserved,
      dirtyRooms: dirty,
      cleaningRooms: map[RoomStatus.CLEANING] ?? 0,
      inspectedRooms: map[RoomStatus.INSPECTED] ?? 0,
      blockedRooms: map[RoomStatus.BLOCKED] ?? 0,
      outOfOrderRooms: map[RoomStatus.OUT_OF_ORDER] ?? 0,
      maintenanceRooms: maintenance,
      vipRooms: vipReservations,
      corporateRooms: corporateReservations,
      averageOccupancy: Math.round(occupancyPct * 10) / 10,
      revenueToday: Number(revenueToday._sum.amount ?? 0),
      revenueThisMonth: Number(revenueMonth._sum.amount ?? 0),
      averageRoomRate: Math.round(averageRoomRate * 100) / 100,
      averageStay: Math.round(averageStay * 10) / 10,
      mostBookedRoom: ranked[0] ?? null,
      leastBookedRoom: ranked.length > 1 ? ranked[ranked.length - 1]! : ranked[0] ?? null,
    };
  }

  async getOwnerStats(hotelId: string): Promise<RoomOwnerStats> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const rooms = await this.prisma.room.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: {
        folioCharges: {
          where: { postedAt: { gte: monthStart }, deletedAt: null },
          select: { totalAmount: true },
        },
        reservations: {
          where: { status: ReservationStatus.CHECKED_IN, deletedAt: null },
          take: 1,
        },
      },
    });

    const totalRooms = rooms.length;
    const occupied = rooms.filter((r) => r.reservations.length > 0).length;

    const performance = rooms.map((r) => ({
      roomNumber: r.roomNumber,
      revenue: r.folioCharges.reduce((s, c) => s + Number(c.totalAmount), 0),
      occupancyPct: r.reservations.length > 0 ? 100 : 0,
    }));

    performance.sort((a, b) => b.revenue - a.revenue);

    const [maintenanceCost] = await Promise.all([
      this.prisma.maintenanceRequest.aggregate({
        where: { hotelId, reportedAt: { gte: monthStart }, deletedAt: null },
        _count: true,
      }),
    ]);

    return {
      topPerforming: performance.slice(0, 5),
      leastPerforming: [...performance].reverse().slice(0, 5),
      maintenanceCost: maintenanceCost._count * 500,
      cleaningCost: totalRooms * 150,
      utilizationPct: totalRooms > 0 ? Math.round((occupied / totalRooms) * 1000) / 10 : 0,
    };
  }
}
