import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { RoomPricingPlan, RoomRevenueStats } from '@tungaos/shared';

@Injectable()
export class RoomPricingService {
  constructor(private prisma: PrismaService) {}

  async listPlans(hotelId: string): Promise<RoomPricingPlan[]> {
    const plans = await this.prisma.ratePlan.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: { roomType: true },
      orderBy: [{ roomTypeId: 'asc' }, { sortOrder: 'asc' }],
    });

    return plans.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      planType: p.planType,
      baseRate: Number(p.baseRate),
      roomTypeId: p.roomTypeId,
      roomTypeName: p.roomType.name,
      corporateOnly: p.corporateOnly,
      memberOnly: p.memberOnly,
    }));
  }

  async getDynamicRules(hotelId: string) {
    return this.prisma.dynamicPriceRule.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: { roomType: { select: { name: true, code: true } } },
      orderBy: { priority: 'desc' },
    });
  }
}

@Injectable()
export class RoomRevenueService {
  constructor(private prisma: PrismaService) {}

  async getStats(hotelId: string, roomId?: string): Promise<RoomRevenueStats> {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const chargeWhere = {
      hotelId,
      deletedAt: null,
      ...(roomId ? { roomId } : {}),
    };

    const [monthly, yearly, rooms, reservations] = await Promise.all([
      this.prisma.folioCharge.aggregate({
        where: { ...chargeWhere, category: 'ROOM', postedAt: { gte: monthStart } },
        _sum: { totalAmount: true },
      }),
      this.prisma.folioCharge.aggregate({
        where: { ...chargeWhere, category: 'ROOM', postedAt: { gte: yearStart } },
        _sum: { totalAmount: true },
      }),
      this.prisma.room.count({ where: { hotelId, isActive: true, deletedAt: null } }),
      this.prisma.reservation.findMany({
        where: {
          hotelId,
          deletedAt: null,
          status: { in: ['CHECKED_IN', 'CHECKED_OUT'] },
          ...(roomId ? { roomId } : {}),
        },
        select: { checkInDate: true, checkOutDate: true, totalAmount: true, source: true, guest: { select: { isCorporate: true } } },
        take: 500,
      }),
    ]);

    let totalNights = 0;
    let totalAmount = 0;
    let corporate = 0;
    let direct = 0;
    let ota = 0;

    for (const r of reservations) {
      const nights = Math.max(1, Math.ceil((r.checkOutDate.getTime() - r.checkInDate.getTime()) / 86400000));
      totalNights += nights;
      totalAmount += Number(r.totalAmount);
      if (r.guest.isCorporate) corporate += Number(r.totalAmount);
      else if (String(r.source).startsWith('OTA_')) ota += Number(r.totalAmount);
      else direct += Number(r.totalAmount);
    }

    const adr = totalNights > 0 ? totalAmount / totalNights : 0;
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    const availableRoomNights = rooms * daysInMonth;
    const revPar = availableRoomNights > 0 ? Number(monthly._sum.totalAmount ?? 0) / availableRoomNights : 0;
    const occupiedNights = reservations.filter((r) => r.checkInDate <= new Date()).length;
    const occupancyPct = availableRoomNights > 0 ? (occupiedNights / availableRoomNights) * 100 : 0;

    let roomNumber: string | undefined;
    if (roomId) {
      const room = await this.prisma.room.findUnique({ where: { id: roomId }, select: { roomNumber: true } });
      roomNumber = room?.roomNumber;
    }

    return {
      roomId,
      roomNumber,
      monthlyRevenue: Number(monthly._sum.totalAmount ?? 0),
      yearlyRevenue: Number(yearly._sum.totalAmount ?? 0),
      adr: Math.round(adr * 100) / 100,
      revPar: Math.round(revPar * 100) / 100,
      occupancyPct: Math.round(occupancyPct * 10) / 10,
      averageStay: reservations.length > 0 ? totalNights / reservations.length : 0,
      corporateRevenue: corporate,
      directRevenue: direct,
      otaRevenue: ota,
    };
  }
}
