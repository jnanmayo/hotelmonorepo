import { Injectable } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { PmsCalendarDay } from '@tungaos/shared';

@Injectable()
export class PmsCalendarService {
  constructor(private prisma: PrismaService) {}

  async getCalendar(
    hotelId: string,
    startDate: string,
    endDate: string,
    view: 'daily' | 'weekly' | 'monthly' = 'monthly',
  ): Promise<PmsCalendarDay[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: PmsCalendarDay[] = [];

    const totalRooms = await this.prisma.room.count({
      where: { hotelId, isActive: true, deletedAt: null },
    });

    const cursor = new Date(start);
    while (cursor <= end) {
      const dayStart = new Date(cursor);
      const dayEnd = new Date(cursor);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const [reservations, blocked, maintenance] = await Promise.all([
        this.prisma.reservation.findMany({
          where: {
            hotelId,
            deletedAt: null,
            checkInDate: { lte: dayStart },
            checkOutDate: { gt: dayStart },
            status: {
              in: [
                ReservationStatus.CONFIRMED,
                ReservationStatus.GUARANTEED,
                ReservationStatus.CHECKED_IN,
              ],
            },
          },
          include: { guest: true, room: true, roomType: true },
        }),
        this.prisma.room.count({
          where: { hotelId, status: 'BLOCKED', isActive: true, deletedAt: null },
        }),
        this.prisma.room.count({
          where: {
            hotelId,
            status: { in: ['OUT_OF_ORDER', 'UNDER_MAINTENANCE'] },
            isActive: true,
            deletedAt: null,
          },
        }),
      ]);

      const occupied = reservations.filter((r) => r.status === ReservationStatus.CHECKED_IN).length;
      const reserved = reservations.length;

      days.push({
        date: dayStart.toISOString().split('T')[0]!,
        totalRooms,
        occupied,
        available: Math.max(0, totalRooms - reserved - blocked - maintenance),
        blocked,
        maintenance,
        occupancyPct: totalRooms > 0 ? Math.round((reserved / totalRooms) * 100) : 0,
        reservations: reservations.map((r) => ({
          id: r.id,
          reservationCode: r.reservationCode,
          guestName: `${r.guest.firstName} ${r.guest.lastName}`,
          roomNumber: r.room?.roomNumber ?? null,
          roomTypeName: r.roomType.name,
          status: r.status,
          checkInDate: r.checkInDate.toISOString().split('T')[0]!,
          checkOutDate: r.checkOutDate.toISOString().split('T')[0]!,
        })),
      });

      if (view === 'daily') break;
      cursor.setDate(cursor.getDate() + (view === 'weekly' ? 7 : 1));
    }

    return days;
  }

  async getAvailability(hotelId: string, checkIn: string, checkOut: string) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const roomTypes = await this.prisma.roomType.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: {
        rooms: { where: { isActive: true, deletedAt: null } },
      },
    });

    const reservedRoomIds = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        deletedAt: null,
        status: { notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW] },
        checkInDate: { lt: end },
        checkOutDate: { gt: start },
        roomId: { not: null },
      },
      select: { roomId: true },
    });
    const reservedSet = new Set(reservedRoomIds.map((r) => r.roomId));

    return roomTypes.map((rt) => ({
      roomTypeId: rt.id,
      name: rt.name,
      code: rt.code,
      baseRate: Number(rt.baseRate),
      totalRooms: rt.rooms.length,
      availableRooms: rt.rooms.filter(
        (r) =>
          !reservedSet.has(r.id) &&
          !['BLOCKED', 'OUT_OF_ORDER', 'UNDER_MAINTENANCE'].includes(r.status),
      ).length,
    }));
  }
}
