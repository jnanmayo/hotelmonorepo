import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

const BLOCKING_ROOM_STATUSES = ['OUT_OF_ORDER', 'OUT_OF_SERVICE', 'BLOCKED'] as const;
const ACTIVE_RESERVATION_STATUSES = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'ON_HOLD'] as const;

export interface AvailabilityQuery {
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  rooms: number;
  sessionId?: string;
}

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async search(query: AvailabilityQuery) {
    const roomTypes = await this.prisma.roomType.findMany({
      where: {
        hotelId: query.hotelId,
        isActive: true,
        deletedAt: null,
        maxAdults: { gte: Math.ceil(query.adults / query.rooms) },
        maxOccupancy: { gte: query.adults + query.children },
      },
      include: {
        amenities: { include: { amenity: true } },
        images: { include: { file: true }, orderBy: { sortOrder: 'asc' }, take: 5 },
        cmsWebsiteRooms: { where: { deletedAt: null, status: 'PUBLISHED' }, take: 1 },
        ratePlans: { where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { baseRate: 'asc' },
    });

    const results = [];
    for (const rt of roomTypes) {
      const available = await this.getAvailableCount(query.hotelId, rt.id, query.checkIn, query.checkOut, query.sessionId);
      if (available < query.rooms) continue;

      const cms = rt.cmsWebsiteRooms[0];
      results.push({
        roomTypeId: rt.id,
        name: cms?.name ?? rt.name,
        code: rt.code,
        description: cms?.description ?? rt.description,
        baseRate: Number(rt.baseRate),
        maxOccupancy: rt.maxOccupancy,
        maxAdults: rt.maxAdults,
        maxChildren: rt.maxChildren,
        sizeSqm: rt.sizeSqm ? Number(rt.sizeSqm) : null,
        bedType: cms?.bedType ?? rt.bedType,
        viewType: rt.viewType,
        amenities: rt.amenities.map((a) => a.amenity.name),
        images: this.extractImages(rt, cms),
        availableCount: available,
        cmsSlug: cms?.slug,
        ratePlans: rt.ratePlans.map((rp) => ({
          id: rp.id,
          name: rp.name,
          code: rp.code,
          planType: rp.planType,
          breakfastIncluded: rp.breakfastIncluded,
          cancellationPolicy: rp.cancellationPolicy,
          description: rp.description,
        })),
      });
    }

    return results;
  }

  async getAvailableCount(
    hotelId: string,
    roomTypeId: string,
    checkIn: Date,
    checkOut: Date,
    excludeSessionId?: string,
  ): Promise<number> {
    const now = new Date();

    const [totalRooms, blockedRooms, overlappingReservations, activeHolds] = await Promise.all([
      this.prisma.room.count({
        where: { hotelId, roomTypeId, isActive: true, deletedAt: null },
      }),
      this.prisma.room.count({
        where: {
          hotelId,
          roomTypeId,
          isActive: true,
          deletedAt: null,
          status: { in: [...BLOCKING_ROOM_STATUSES] },
        },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          roomTypeId,
          deletedAt: null,
          status: { in: [...ACTIVE_RESERVATION_STATUSES] },
          checkInDate: { lt: checkOut },
          checkOutDate: { gt: checkIn },
        },
      }),
      this.prisma.inventoryHold.aggregate({
        where: {
          hotelId,
          roomTypeId,
          status: 'ACTIVE',
          expiresAt: { gt: now },
          checkInDate: { lt: checkOut },
          checkOutDate: { gt: checkIn },
          ...(excludeSessionId ? { sessionId: { not: excludeSessionId } } : {}),
        },
        _sum: { roomCount: true },
      }),
    ]);

    const unavailable = blockedRooms + overlappingReservations + (activeHolds._sum.roomCount ?? 0);
    return Math.max(0, totalRooms - unavailable);
  }

  async createHold(params: {
    hotelId: string;
    sessionId: string;
    roomTypeId: string;
    roomCount: number;
    checkIn: Date;
    checkOut: Date;
    ttlMinutes?: number;
  }) {
    const available = await this.getAvailableCount(
      params.hotelId,
      params.roomTypeId,
      params.checkIn,
      params.checkOut,
      params.sessionId,
    );
    if (available < params.roomCount) {
      throw new Error('INSUFFICIENT_AVAILABILITY');
    }

    await this.prisma.inventoryHold.updateMany({
      where: { sessionId: params.sessionId, status: 'ACTIVE' },
      data: { status: 'RELEASED' },
    });

    const expiresAt = new Date(Date.now() + (params.ttlMinutes ?? 15) * 60_000);
    return this.prisma.inventoryHold.create({
      data: {
        hotelId: params.hotelId,
        sessionId: params.sessionId,
        roomTypeId: params.roomTypeId,
        roomCount: params.roomCount,
        checkInDate: params.checkIn,
        checkOutDate: params.checkOut,
        expiresAt,
      },
    });
  }

  async releaseHold(sessionId: string) {
    await this.prisma.inventoryHold.updateMany({
      where: { sessionId, status: 'ACTIVE' },
      data: { status: 'RELEASED' },
    });
  }

  private extractImages(
    rt: { images: { file: { fileUrl: string } }[] },
    cms: { images: Prisma.JsonValue } | undefined,
  ): string[] {
    const cmsImages = Array.isArray(cms?.images)
      ? (cms.images as { url?: string }[]).map((i) => i.url).filter(Boolean) as string[]
      : [];
    const dbImages = rt.images.map((i) => i.file.fileUrl).filter(Boolean);
    return cmsImages.length > 0 ? cmsImages : dbImages;
  }
}
