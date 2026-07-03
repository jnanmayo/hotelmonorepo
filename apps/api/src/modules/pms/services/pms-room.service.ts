import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsAuditService } from '@/modules/pms/services/pms-audit.service';
import { PmsDashboardService } from '@/modules/pms/services/pms-dashboard.service';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';

import type { PmsRoom, RoomBlockSchema, RoomTransferSchema } from '@tungaos/shared';

@Injectable()
export class PmsRoomService {
  constructor(
    private prisma: PrismaService,
    private audit: PmsAuditService,
    private dashboard: PmsDashboardService,
    private realtime: PmsRealtimeGateway,
  ) {}

  async listRooms(hotelId: string, filters?: { status?: RoomStatus; floorId?: string; buildingId?: string }) {
    const rooms = await this.prisma.room.findMany({
      where: {
        hotelId,
        isActive: true,
        deletedAt: null,
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.floorId ? { floorId: filters.floorId } : {}),
        ...(filters?.buildingId ? { floor: { buildingId: filters.buildingId } } : {}),
      },
      include: {
        floor: { include: { building: true } },
        roomType: true,
        reservations: {
          where: { status: 'CHECKED_IN', deletedAt: null },
          include: { guest: true },
          take: 1,
        },
      },
      orderBy: [{ floor: { floorNumber: 'asc' } }, { roomNumber: 'asc' }],
    });

    return rooms.map((r) => this.mapRoom(r));
  }

  async updateStatus(hotelId: string, roomId: string, status: RoomStatus, reason?: string, userId?: string) {
    const room = await this.prisma.room.findFirst({
      where: { id: roomId, hotelId, deletedAt: null },
    });
    if (!room) throw new NotFoundException('Room not found');

    await this.prisma.$transaction([
      this.prisma.room.update({ where: { id: roomId }, data: { status, updatedBy: userId } }),
      this.prisma.roomStatusHistory.create({
        data: {
          hotelId,
          roomId,
          fromStatus: room.status,
          toStatus: status,
          reason,
          createdBy: userId,
        },
      }),
    ]);

    this.realtime.emitRoomStatus(hotelId, roomId, status);
    this.dashboard.notifyDashboardRefresh(hotelId);

    await this.audit.log({
      hotelId,
      userId,
      action: AuditAction.UPDATE,
      entityType: 'Room',
      entityId: roomId,
      oldValues: { status: room.status },
      newValues: { status },
    });

    return { roomId, status };
  }

  async createBlock(hotelId: string, input: RoomBlockSchema, userId?: string) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    if (end < start) throw new BadRequestException('End date must be after start date');

    const block = await this.prisma.roomBlock.create({
      data: {
        hotelId,
        roomId: input.roomId,
        reason: input.reason,
        title: input.title,
        description: input.description,
        startDate: start,
        endDate: end,
        createdBy: userId,
      },
    });

    await this.updateStatus(hotelId, input.roomId, RoomStatus.BLOCKED, input.title, userId);
    return block;
  }

  async roomTransfer(hotelId: string, input: RoomTransferSchema, userId?: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: input.reservationId, hotelId, deletedAt: null },
    });
    if (!reservation?.roomId) throw new BadRequestException('Reservation has no assigned room');

    await this.prisma.$transaction(async (tx) => {
      await tx.roomTransfer.create({
        data: {
          hotelId,
          reservationId: input.reservationId,
          fromRoomId: reservation.roomId!,
          toRoomId: input.toRoomId,
          transferType: input.transferType,
          reason: input.reason,
          rateAdjustment: input.rateAdjustment ?? 0,
          createdBy: userId,
        },
      });
      await tx.reservation.update({
        where: { id: input.reservationId },
        data: { roomId: input.toRoomId, updatedBy: userId },
      });
      await tx.room.update({
        where: { id: reservation.roomId! },
        data: { status: RoomStatus.VACANT_DIRTY },
      });
      await tx.room.update({
        where: { id: input.toRoomId },
        data: { status: RoomStatus.OCCUPIED },
      });
    });

    this.realtime.emitRoomStatus(hotelId, reservation.roomId!, RoomStatus.VACANT_DIRTY);
    this.realtime.emitRoomStatus(hotelId, input.toRoomId, RoomStatus.OCCUPIED);
    return { success: true };
  }

  async getInventory(hotelId: string) {
    const [buildings, roomTypes, rooms] = await Promise.all([
      this.prisma.building.findMany({
        where: { hotelId, isActive: true, deletedAt: null },
        include: { floors: { where: { isActive: true, deletedAt: null }, orderBy: { floorNumber: 'asc' } } },
      }),
      this.prisma.roomType.findMany({
        where: { hotelId, isActive: true, deletedAt: null },
        orderBy: { name: 'asc' },
      }),
      this.prisma.room.count({ where: { hotelId, isActive: true, deletedAt: null } }),
    ]);

    return { buildings, roomTypes, totalRooms: rooms };
  }

  private mapRoom(r: {
    id: string;
    roomNumber: string;
    status: RoomStatus;
    category: string;
    isSmoking: boolean;
    isAccessible: boolean;
    floor: { id: string; name: string; floorNumber: number; building: { id: string; name: string; code: string } };
    roomType: { id: string; name: string; code: string };
    reservations: { id: string; guest: { firstName: string; lastName: string } }[];
  }): PmsRoom {
    const active = r.reservations[0];
    return {
      id: r.id,
      roomNumber: r.roomNumber,
      status: r.status,
      category: r.category,
      isSmoking: r.isSmoking,
      isAccessible: r.isAccessible,
      floor: { id: r.floor.id, name: r.floor.name, floorNumber: r.floor.floorNumber },
      building: { id: r.floor.building.id, name: r.floor.building.name, code: r.floor.building.code },
      roomType: r.roomType,
      currentGuest: active ? `${active.guest.firstName} ${active.guest.lastName}` : null,
      currentReservationId: active?.id ?? null,
    };
  }
}
