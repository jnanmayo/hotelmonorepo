import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsRoomService } from '@/modules/pms/services/pms-room.service';
import { RoomDashboardService } from '@/modules/rooms/services/room-dashboard.service';

import type {
  AmenityItem,
  BuildingSummary,
  CreateAmenitySchema,
  CreateBuildingSchema,
  CreateFloorSchema,
  CreateRoomSchema,
  CreateRoomTypeSchema,
  RoomInventory,
  RoomProfile,
  RoomSearchResult,
  RoomTimelineEvent,
  RoomTypeSummary,
} from '@tungaos/shared';

@Injectable()
export class RoomPropertyService {
  constructor(
    private prisma: PrismaService,
    private pmsRooms: PmsRoomService,
    private dashboard: RoomDashboardService,
  ) {}

  async getInventory(hotelId: string): Promise<RoomInventory> {
    const data = await this.pmsRooms.getInventory(hotelId);
    const roomCounts = await this.prisma.room.groupBy({
      by: ['floorId', 'roomTypeId'],
      where: { hotelId, isActive: true, deletedAt: null },
      _count: true,
    });

    const buildings: BuildingSummary[] = data.buildings.map((b) => ({
      id: b.id,
      name: b.name,
      code: b.code,
      description: b.description,
      floors: b.floors.map((f) => ({
        id: f.id,
        name: f.name,
        floorNumber: f.floorNumber,
        buildingId: b.id,
        roomCount: roomCounts.filter((c) => c.floorId === f.id).reduce((s, c) => s + c._count, 0),
      })),
    }));

    const roomTypes: RoomTypeSummary[] = data.roomTypes.map((rt) => ({
      id: rt.id,
      name: rt.name,
      code: rt.code,
      baseRate: Number(rt.baseRate),
      maxOccupancy: rt.maxOccupancy,
      bedType: rt.bedType,
      viewType: rt.viewType,
      sizeSqm: rt.sizeSqm ? Number(rt.sizeSqm) : null,
      roomCount: roomCounts.filter((c) => c.roomTypeId === rt.id).reduce((s, c) => s + c._count, 0),
    }));

    return { buildings, roomTypes, totalRooms: data.totalRooms };
  }

  async listRooms(hotelId: string, filters?: { status?: RoomStatus; search?: string; buildingId?: string; floorId?: string }) {
    const rooms = await this.pmsRooms.listRooms(hotelId, {
      status: filters?.status,
      floorId: filters?.floorId,
      buildingId: filters?.buildingId,
    });

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      return rooms.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.roomType.name.toLowerCase().includes(q) ||
          r.building.name.toLowerCase().includes(q) ||
          (r.currentGuest?.toLowerCase().includes(q) ?? false),
      );
    }
    return rooms;
  }

  async getProfile(hotelId: string, roomId: string): Promise<RoomProfile> {
    const room = await this.prisma.room.findFirst({
      where: { id: roomId, hotelId, deletedAt: null },
      include: {
        floor: { include: { building: true } },
        roomType: {
          include: {
            amenities: { include: { amenity: true }, where: { isActive: true, deletedAt: null } },
          },
        },
        reservations: {
          where: { status: 'CHECKED_IN', deletedAt: null },
          include: { guest: true },
          take: 1,
        },
      },
    });
    if (!room) throw new NotFoundException('Room not found');

    const active = room.reservations[0];
    return {
      id: room.id,
      roomNumber: room.roomNumber,
      status: room.status,
      category: room.category,
      isSmoking: room.isSmoking,
      isAccessible: room.isAccessible,
      notes: room.notes,
      floor: { id: room.floor.id, name: room.floor.name, floorNumber: room.floor.floorNumber },
      building: { id: room.floor.building.id, name: room.floor.building.name, code: room.floor.building.code },
      roomType: {
        id: room.roomType.id,
        name: room.roomType.name,
        code: room.roomType.code,
        baseRate: Number(room.roomType.baseRate),
        maxOccupancy: room.roomType.maxOccupancy,
        bedType: room.roomType.bedType,
        viewType: room.roomType.viewType,
        sizeSqm: room.roomType.sizeSqm ? Number(room.roomType.sizeSqm) : null,
      },
      amenities: room.roomType.amenities.map((a) => ({
        id: a.amenity.id,
        name: a.amenity.name,
        icon: a.amenity.icon,
      })),
      currentGuest: active ? `${active.guest.firstName} ${active.guest.lastName}` : null,
      currentReservationId: active?.id ?? null,
    };
  }

  async getTimeline(hotelId: string, roomId: string): Promise<RoomTimelineEvent[]> {
    const [statusHistory, blocks, maintenance, housekeeping, reservations] = await Promise.all([
      this.prisma.roomStatusHistory.findMany({
        where: { hotelId, roomId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.roomBlock.findMany({
        where: { hotelId, roomId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.maintenanceRequest.findMany({
        where: { hotelId, roomId, deletedAt: null },
        orderBy: { reportedAt: 'desc' },
        take: 20,
      }),
      this.prisma.housekeepingTask.findMany({
        where: { hotelId, roomId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.reservation.findMany({
        where: { hotelId, roomId, deletedAt: null },
        include: { guest: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    const events: RoomTimelineEvent[] = [
      ...statusHistory.map((h) => ({
        id: h.id,
        type: 'STATUS',
        title: `${h.fromStatus ?? '—'} → ${h.toStatus}`,
        description: h.reason,
        timestamp: h.createdAt.toISOString(),
      })),
      ...blocks.map((b) => ({
        id: b.id,
        type: 'BLOCK',
        title: b.title,
        description: b.description,
        timestamp: b.createdAt.toISOString(),
        metadata: { reason: b.reason },
      })),
      ...maintenance.map((m) => ({
        id: m.id,
        type: 'MAINTENANCE',
        title: m.title,
        description: m.description,
        timestamp: m.reportedAt.toISOString(),
        metadata: { status: m.status, priority: m.priority },
      })),
      ...housekeeping.map((h) => ({
        id: h.id,
        type: 'HOUSEKEEPING',
        title: `Cleaning — ${h.taskType}`,
        description: h.notes,
        timestamp: h.createdAt.toISOString(),
        metadata: { status: h.status },
      })),
      ...reservations.map((r) => ({
        id: r.id,
        type: 'RESERVATION',
        title: `${r.guest.firstName} ${r.guest.lastName} — ${r.status}`,
        description: r.reservationCode,
        timestamp: r.createdAt.toISOString(),
        metadata: { checkIn: r.checkInDate, checkOut: r.checkOutDate },
      })),
    ];

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async search(hotelId: string, query: string): Promise<RoomSearchResult[]> {
    const rooms = await this.listRooms(hotelId, { search: query });
    return rooms.map((r) => ({
      id: r.id,
      roomNumber: r.roomNumber,
      status: r.status,
      category: r.category,
      buildingName: r.building.name,
      floorNumber: r.floor.floorNumber,
      roomTypeName: r.roomType.name,
      currentGuest: r.currentGuest,
    }));
  }

  async createBuilding(hotelId: string, input: CreateBuildingSchema, userId?: string) {
    const building = await this.prisma.building.create({
      data: { hotelId, ...input, createdBy: userId },
    });
    this.dashboard.notifyRefresh(hotelId);
    return building;
  }

  async createFloor(hotelId: string, input: CreateFloorSchema, userId?: string) {
    const building = await this.prisma.building.findFirst({
      where: { id: input.buildingId, hotelId, deletedAt: null },
    });
    if (!building) throw new NotFoundException('Building not found');

    const floor = await this.prisma.floor.create({
      data: { hotelId, buildingId: input.buildingId, name: input.name, floorNumber: input.floorNumber, createdBy: userId },
    });
    this.dashboard.notifyRefresh(hotelId);
    return floor;
  }

  async createRoomType(hotelId: string, input: CreateRoomTypeSchema, userId?: string) {
    const { amenityIds, ...data } = input;
    const roomType = await this.prisma.roomType.create({
      data: { hotelId, ...data, createdBy: userId },
    });

    if (amenityIds?.length) {
      await this.prisma.roomTypeAmenity.createMany({
        data: amenityIds.map((amenityId) => ({ hotelId, roomTypeId: roomType.id, amenityId, createdBy: userId })),
      });
    }

    this.dashboard.notifyRefresh(hotelId);
    return roomType;
  }

  async createRoom(hotelId: string, input: CreateRoomSchema, userId?: string) {
    const [floor, roomType] = await Promise.all([
      this.prisma.floor.findFirst({ where: { id: input.floorId, hotelId, deletedAt: null } }),
      this.prisma.roomType.findFirst({ where: { id: input.roomTypeId, hotelId, deletedAt: null } }),
    ]);
    if (!floor) throw new NotFoundException('Floor not found');
    if (!roomType) throw new NotFoundException('Room type not found');

    const existing = await this.prisma.room.findFirst({
      where: { hotelId, roomNumber: input.roomNumber, deletedAt: null },
    });
    if (existing) throw new BadRequestException('Room number already exists');

    const room = await this.prisma.room.create({
      data: { hotelId, ...input, createdBy: userId },
    });
    this.dashboard.notifyRefresh(hotelId);
    return room;
  }

  async listAmenities(hotelId: string): Promise<AmenityItem[]> {
    const items = await this.prisma.amenity.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return items.map((a) => ({ id: a.id, name: a.name, icon: a.icon, category: a.category }));
  }

  async createAmenity(hotelId: string, input: CreateAmenitySchema, userId?: string) {
    return this.prisma.amenity.create({
      data: { hotelId, ...input, createdBy: userId },
    });
  }
}
