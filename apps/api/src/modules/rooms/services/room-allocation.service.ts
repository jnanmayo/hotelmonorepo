import { Injectable, NotFoundException } from '@nestjs/common';
import { ReservationStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { RoomAllocationSchema, RoomAllocationSuggestion } from '@tungaos/shared';

@Injectable()
export class RoomAllocationService {
  constructor(private prisma: PrismaService) {}

  async suggest(hotelId: string, input: RoomAllocationSchema): Promise<RoomAllocationSuggestion[]> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: input.reservationId, hotelId, deletedAt: null },
      include: { guest: true, roomType: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');

    const rooms = await this.prisma.room.findMany({
      where: {
        hotelId,
        isActive: true,
        deletedAt: null,
        roomTypeId: reservation.roomTypeId,
        status: { in: [RoomStatus.VACANT_CLEAN, RoomStatus.VACANT, RoomStatus.INSPECTED] },
      },
      include: { floor: { include: { building: true } }, roomType: true },
    });

    const prefs = input.preferences;

    return rooms
      .map((r) => {
        const reasons: string[] = [];
        let score = 50;

        if (reservation.guest.vipStatus) {
          score += 20;
          reasons.push('VIP guest priority');
        }
        if (reservation.guest.isCorporate) {
          score += 15;
          reasons.push('Corporate guest');
        }
        if (r.status === RoomStatus.VACANT_CLEAN) {
          score += 15;
          reasons.push('Room is clean and ready');
        } else if (r.status === RoomStatus.INSPECTED) {
          score += 12;
          reasons.push('Recently inspected');
        }
        if (prefs?.nonSmoking && !r.isSmoking) {
          score += 10;
          reasons.push('Non-smoking preference');
        }
        if (prefs?.accessible && r.isAccessible) {
          score += 10;
          reasons.push('Accessible room');
        }
        if (prefs?.floor !== undefined && r.floor.floorNumber === prefs.floor) {
          score += 8;
          reasons.push(`Preferred floor ${prefs.floor}`);
        }
        if (prefs?.view && r.roomType.viewType?.toLowerCase().includes(prefs.view.toLowerCase())) {
          score += 8;
          reasons.push(`Preferred view: ${prefs.view}`);
        }

        return {
          id: r.id,
          roomNumber: r.roomNumber,
          roomTypeName: r.roomType.name,
          floorName: r.floor.name,
          floorNumber: r.floor.floorNumber,
          buildingName: r.floor.building.name,
          status: r.status,
          score: Math.min(100, score),
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  async autoAssign(hotelId: string, reservationId: string, userId?: string) {
    const suggestions = await this.suggest(hotelId, { reservationId });
    if (!suggestions.length) throw new NotFoundException('No available rooms for assignment');

    const best = suggestions[0]!;
    await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { roomId: best.id, updatedBy: userId },
    });
    await this.prisma.room.update({
      where: { id: best.id },
      data: {
        status:
          (await this.prisma.reservation.findUnique({ where: { id: reservationId } }))?.status ===
          ReservationStatus.CHECKED_IN
            ? RoomStatus.OCCUPIED
            : RoomStatus.RESERVED,
      },
    });

    return { roomId: best.id, roomNumber: best.roomNumber, score: best.score };
  }
}
