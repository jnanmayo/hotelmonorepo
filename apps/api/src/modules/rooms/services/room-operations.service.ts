import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsRoomService } from '@/modules/pms/services/pms-room.service';
import { RoomDashboardService } from '@/modules/rooms/services/room-dashboard.service';

import type {
  CreateDamageSchema,
  CreateInspectionSchema,
  RoomBlockItem,
  RoomBlockSchema,
  RoomDamageItem,
  RoomInspectionItem,
  UpdateRoomStatusSchema,
} from '@tungaos/shared';

@Injectable()
export class RoomOperationsService {
  constructor(
    private prisma: PrismaService,
    private pmsRooms: PmsRoomService,
    private dashboard: RoomDashboardService,
  ) {}

  async updateStatus(hotelId: string, roomId: string, input: UpdateRoomStatusSchema, userId?: string) {
    const result = await this.pmsRooms.updateStatus(hotelId, roomId, input.status, input.reason, userId);
    this.dashboard.notifyRefresh(hotelId);
    return result;
  }

  async listBlocks(hotelId: string): Promise<RoomBlockItem[]> {
    const blocks = await this.prisma.roomBlock.findMany({
      where: { hotelId, isActive: true, deletedAt: null, endDate: { gte: new Date() } },
      include: { room: { select: { roomNumber: true } } },
      orderBy: { startDate: 'asc' },
    });
    return blocks.map((b) => ({
      id: b.id,
      roomId: b.roomId,
      roomNumber: b.room.roomNumber,
      reason: b.reason,
      title: b.title,
      description: b.description,
      startDate: b.startDate.toISOString().split('T')[0]!,
      endDate: b.endDate.toISOString().split('T')[0]!,
    }));
  }

  async createBlock(hotelId: string, input: RoomBlockSchema, userId?: string) {
    const block = await this.pmsRooms.createBlock(hotelId, input, userId);
    this.dashboard.notifyRefresh(hotelId);
    return block;
  }

  async listMaintenance(hotelId: string, roomId?: string) {
    return this.prisma.maintenanceRequest.findMany({
      where: { hotelId, deletedAt: null, ...(roomId ? { roomId } : {}) },
      include: { room: { select: { roomNumber: true } } },
      orderBy: { reportedAt: 'desc' },
      take: 100,
    });
  }

  async listInspections(hotelId: string): Promise<RoomInspectionItem[]> {
    const items = await this.prisma.roomInspection.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: { room: { select: { roomNumber: true } } },
      orderBy: { inspectedAt: 'desc' },
      take: 100,
    });
    return items.map((i) => ({
      id: i.id,
      roomId: i.roomId,
      roomNumber: i.room.roomNumber,
      qualityScore: i.qualityScore,
      status: i.status,
      remarks: i.remarks,
      inspectedAt: i.inspectedAt.toISOString(),
    }));
  }

  async createInspection(hotelId: string, input: CreateInspectionSchema, userId?: string) {
    const room = await this.prisma.room.findFirst({ where: { id: input.roomId, hotelId, deletedAt: null } });
    if (!room) throw new NotFoundException('Room not found');

    const inspection = await this.prisma.roomInspection.create({
      data: {
        hotelId,
        roomId: input.roomId,
        qualityScore: input.qualityScore,
        remarks: input.remarks,
        checklist: input.checklistItems ?? [],
        status: input.qualityScore >= 80 ? 'APPROVED' : 'NEEDS_ATTENTION',
        createdBy: userId,
      },
    });

    if (input.qualityScore >= 80) {
      await this.pmsRooms.updateStatus(hotelId, input.roomId, RoomStatus.INSPECTED, 'Inspection passed', userId);
    }

    this.dashboard.notifyRefresh(hotelId);
    return inspection;
  }

  async listDamages(hotelId: string): Promise<RoomDamageItem[]> {
    const items = await this.prisma.roomDamage.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: {
        room: { select: { roomNumber: true } },
      },
      orderBy: { reportedAt: 'desc' },
      take: 100,
    });

    const guestIds = items.map((d) => d.responsibleGuestId).filter(Boolean) as string[];
    const guests = guestIds.length
      ? await this.prisma.guest.findMany({ where: { id: { in: guestIds } }, select: { id: true, firstName: true, lastName: true } })
      : [];
    const guestMap = Object.fromEntries(guests.map((g) => [g.id, `${g.firstName} ${g.lastName}`]));

    return items.map((d) => ({
      id: d.id,
      roomId: d.roomId,
      roomNumber: d.room.roomNumber,
      itemName: d.itemName,
      estimatedCost: Number(d.estimatedCost),
      recoveryAmount: Number(d.recoveryAmount),
      repairStatus: d.repairStatus,
      responsibleGuest: d.responsibleGuestId ? guestMap[d.responsibleGuestId] ?? null : null,
    }));
  }

  async createDamage(hotelId: string, input: CreateDamageSchema, userId?: string) {
    const room = await this.prisma.room.findFirst({ where: { id: input.roomId, hotelId, deletedAt: null } });
    if (!room) throw new NotFoundException('Room not found');

    return this.prisma.roomDamage.create({
      data: {
        hotelId,
        roomId: input.roomId,
        itemName: input.itemName,
        description: input.description,
        estimatedCost: input.estimatedCost,
        recoveryAmount: input.recoveryAmount,
        responsibleGuestId: input.responsibleGuestId,
        createdBy: userId,
      },
    });
  }
}

@Injectable()
export class RoomAssetService {
  constructor(private prisma: PrismaService) {}

  async listByRoom(hotelId: string, roomId: string) {
    return this.prisma.roomAsset.findMany({
      where: { hotelId, roomId, isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async listAll(hotelId: string) {
    return this.prisma.roomAsset.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      include: { room: { select: { roomNumber: true } } },
      orderBy: { name: 'asc' },
      take: 200,
    });
  }

  async create(hotelId: string, roomId: string, data: {
    name: string;
    assetType: string;
    serialNumber?: string;
    purchaseDate?: string;
    warrantyUntil?: string;
    amcUntil?: string;
    condition?: string;
  }) {
    return this.prisma.roomAsset.create({
      data: {
        hotelId,
        roomId,
        name: data.name,
        assetType: data.assetType,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        warrantyUntil: data.warrantyUntil ? new Date(data.warrantyUntil) : undefined,
        amcUntil: data.amcUntil ? new Date(data.amcUntil) : undefined,
        condition: data.condition ?? 'GOOD',
      },
    });
  }
}

@Injectable()
export class RoomReportService {
  constructor(private prisma: PrismaService) {}

  async generate(hotelId: string, type: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (type) {
      case 'status': {
        const counts = await this.prisma.room.groupBy({
          by: ['status'],
          where: { hotelId, isActive: true, deletedAt: null },
          _count: true,
        });
        return { type, generatedAt: new Date().toISOString(), data: counts };
      }
      case 'occupancy': {
        const total = await this.prisma.room.count({ where: { hotelId, isActive: true, deletedAt: null } });
        const occupied = await this.prisma.room.count({
          where: { hotelId, status: { in: ['OCCUPIED', 'RESERVED'] }, isActive: true, deletedAt: null },
        });
        return { type, generatedAt: new Date().toISOString(), data: { total, occupied, occupancyPct: total ? (occupied / total) * 100 : 0 } };
      }
      case 'maintenance': {
        const items = await this.prisma.maintenanceRequest.findMany({
          where: { hotelId, deletedAt: null },
          include: { room: { select: { roomNumber: true } } },
          orderBy: { reportedAt: 'desc' },
          take: 100,
        });
        return { type, generatedAt: new Date().toISOString(), data: items };
      }
      case 'damage': {
        const items = await this.prisma.roomDamage.findMany({
          where: { hotelId, isActive: true, deletedAt: null },
          include: { room: { select: { roomNumber: true } } },
          orderBy: { reportedAt: 'desc' },
        });
        return { type, generatedAt: new Date().toISOString(), data: items };
      }
      default:
        return { type, generatedAt: new Date().toISOString(), data: [] };
    }
  }
}
