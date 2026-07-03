import { Injectable, NotFoundException } from '@nestjs/common';
import { EventTaskStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventsRealtimeGateway } from '@/modules/events/gateways/events-realtime.gateway';

import type {
  CreateBanquetHallSchema,
  CreateEventTaskSchema,
  EventsBookingItem,
  EventsCalendarDay,
  EventsChecklistItem,
  EventsHallItem,
  EventsMenuItem,
  EventsPackageItem,
  EventsResourceItem,
  EventsRoomBlockItem,
  EventsSeatingPlanItem,
  EventsTaskItem,
  EventsTimelineItem,
  EventsVendorItem,
  UpdateEventTaskStatusSchema,
} from '@tungaos/shared';

@Injectable()
export class EventsOperationsService {
  constructor(
    private prisma: PrismaService,
    private realtime: EventsRealtimeGateway,
  ) {}

  async listHalls(hotelId: string): Promise<EventsHallItem[]> {
    const halls = await this.prisma.banquetHall.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { name: 'asc' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const blocks = await this.prisma.hallAvailability.groupBy({
      by: ['hallId'],
      where: { hotelId, blockDate: { gte: today }, blockType: 'BOOKING' },
      _count: true,
    });

    return halls.map((h) => {
      const block = blocks.find((b) => b.hallId === h.id);
      const amenities = Array.isArray(h.amenities) ? (h.amenities as string[]) : [];
      return {
        id: h.id,
        hallCode: h.hallCode,
        name: h.name,
        capacity: h.capacity,
        minGuests: h.minGuests,
        maxGuests: h.maxGuests,
        baseRate: Number(h.baseRate),
        amenities,
        isActive: h.isActive,
        occupancyPct: block ? Math.min(100, block._count * 25) : 0,
      };
    });
  }

  async createHall(hotelId: string, dto: CreateBanquetHallSchema) {
    const hall = await this.prisma.banquetHall.create({
      data: {
        hotelId,
        hallCode: dto.hallCode,
        name: dto.name,
        description: dto.description,
        capacity: dto.capacity,
        minGuests: dto.minGuests,
        maxGuests: dto.maxGuests,
        baseRate: dto.baseRate,
        amenities: dto.amenities ?? [],
      },
    });
    this.realtime.emitHallAvailability(hotelId, hall.id);
    return hall;
  }

  async getCalendar(hotelId: string, from?: string, to?: string): Promise<EventsCalendarDay[]> {
    const start = from ? new Date(from) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = to ? new Date(to) : new Date(start);
    end.setDate(end.getDate() + 6);

    const halls = await this.prisma.banquetHall.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
    });

    const blocks = await this.prisma.hallAvailability.findMany({
      where: {
        hotelId,
        blockDate: { gte: start, lte: end },
      },
      include: { event: true },
    });

    const days: EventsCalendarDay[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const dateStr = cursor.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        halls: halls.map((hall) => ({
          hallId: hall.id,
          hallName: hall.name,
          blocks: blocks
            .filter((b) => b.hallId === hall.id && b.blockDate.toISOString().slice(0, 10) === dateStr)
            .map((b) => ({
              id: b.id,
              blockType: b.blockType,
              title: b.title,
              startTime: b.startTime,
              endTime: b.endTime,
              eventName: b.event?.name ?? null,
            })),
        })),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }

  async listBookings(hotelId: string): Promise<EventsBookingItem[]> {
    const rows = await this.prisma.event.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        hall: true,
        client: true,
        banquetBookings: true,
      },
      orderBy: { startDate: 'desc' },
      take: 200,
    });

    return rows.map((e) => ({
      id: e.id,
      eventCode: e.eventCode,
      name: e.name,
      eventType: e.eventType,
      status: e.status,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      hallName: e.hall?.name ?? e.venue,
      expectedGuests: e.expectedGuests,
      totalAmount: Number(e.banquetBookings[0]?.totalAmount ?? e.expectedRevenue ?? 0),
      clientName: e.client?.name ?? e.organizerName,
    }));
  }

  async listPackages(hotelId: string): Promise<EventsPackageItem[]> {
    const rows = await this.prisma.eventPackage.findMany({
      where: { hotelId },
      orderBy: { name: 'asc' },
    });

    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      eventType: r.eventType,
      basePrice: Number(r.basePrice),
      inclusions: Array.isArray(r.inclusions) ? (r.inclusions as string[]) : [],
      isActive: r.isActive,
    }));
  }

  async listMenus(hotelId: string): Promise<EventsMenuItem[]> {
    const rows = await this.prisma.eventMenu.findMany({
      where: { hotelId },
      include: { event: true },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      mealType: r.mealType,
      style: r.style,
      guestCount: r.guestCount,
      totalAmount: Number(r.totalAmount),
      eventName: r.event?.name ?? null,
      posSynced: r.posSynced,
    }));
  }

  async listSeatingPlans(hotelId: string): Promise<EventsSeatingPlanItem[]> {
    const rows = await this.prisma.eventSeatingPlan.findMany({
      where: { hotelId },
      include: { event: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });

    return rows.map((r) => ({
      id: r.id,
      eventName: r.event.name,
      name: r.name,
      guestCount: r.guestCount,
      updatedAt: r.updatedAt.toISOString().slice(0, 10),
    }));
  }

  async listTasks(hotelId: string, eventId?: string): Promise<EventsTaskItem[]> {
    const rows = await this.prisma.eventTask.findMany({
      where: {
        hotelId,
        ...(eventId ? { eventId } : {}),
      },
      include: { event: true },
      orderBy: [{ priority: 'desc' }, { deadline: 'asc' }],
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      eventName: r.event.name,
      category: r.category,
      title: r.title,
      ownerName: r.ownerName,
      deadline: r.deadline?.toISOString() ?? null,
      status: r.status,
      priority: r.priority,
    }));
  }

  async createTask(hotelId: string, dto: CreateEventTaskSchema) {
    const task = await this.prisma.eventTask.create({
      data: {
        hotelId,
        eventId: dto.eventId,
        category: dto.category,
        title: dto.title,
        ownerName: dto.ownerName,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        priority: dto.priority,
      },
    });
    this.realtime.emitTaskUpdate(hotelId, task.id);
    return task;
  }

  async updateTaskStatus(hotelId: string, id: string, dto: UpdateEventTaskStatusSchema) {
    const task = await this.prisma.eventTask.findFirst({ where: { id, hotelId } });
    if (!task) throw new NotFoundException('Task not found');

    const updated = await this.prisma.eventTask.update({
      where: { id },
      data: { status: dto.status },
    });
    this.realtime.emitTaskUpdate(hotelId, id);
    return updated;
  }

  async listResources(hotelId: string): Promise<EventsResourceItem[]> {
    const rows = await this.prisma.eventResource.findMany({
      where: { hotelId, isActive: true },
      include: { allocations: { where: { returnedAt: null } } },
      orderBy: { category: 'asc' },
    });

    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      category: r.category,
      totalQty: r.totalQty,
      availableQty: r.availableQty,
      allocatedQty: r.allocations.reduce((s, a) => s + a.quantity, 0),
    }));
  }

  async listRoomBlocks(hotelId: string): Promise<EventsRoomBlockItem[]> {
    const rows = await this.prisma.eventRoomBlock.findMany({
      where: { hotelId },
      include: { event: true },
      orderBy: { checkInDate: 'asc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      eventName: r.event.name,
      guestCategory: r.guestCategory,
      guestName: r.guestName,
      roomCount: r.roomCount,
      checkInDate: r.checkInDate.toISOString().slice(0, 10),
      checkOutDate: r.checkOutDate.toISOString().slice(0, 10),
      pmsSynced: r.pmsSynced,
    }));
  }

  async listVendors(hotelId: string): Promise<EventsVendorItem[]> {
    const rows = await this.prisma.eventVendor.findMany({
      where: { hotelId, isActive: true },
      orderBy: [{ isPreferred: 'desc' }, { name: 'asc' }],
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      contactName: r.contactName,
      phone: r.phone,
      rating: Number(r.rating),
      isPreferred: r.isPreferred,
    }));
  }

  async listChecklists(hotelId: string): Promise<EventsChecklistItem[]> {
    const rows = await this.prisma.eventChecklist.findMany({
      where: { hotelId },
      include: { items: true },
      orderBy: { name: 'asc' },
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      eventType: r.eventType,
      isTemplate: r.isTemplate,
      totalItems: r.items.length,
      completedItems: r.items.filter((i) => i.isCompleted).length,
    }));
  }

  async listTimeline(hotelId: string): Promise<EventsTimelineItem[]> {
    const rows = await this.prisma.eventTimelineEntry.findMany({
      where: { hotelId },
      include: { event: true },
      orderBy: { occurredAt: 'desc' },
      take: 100,
    });

    return rows.map((r) => ({
      id: r.id,
      eventName: r.event.name,
      phase: r.phase,
      title: r.title,
      occurredAt: r.occurredAt.toISOString(),
    }));
  }
}
