import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, ReservationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsAuditService } from '@/modules/pms/services/pms-audit.service';
import { PmsDashboardService } from '@/modules/pms/services/pms-dashboard.service';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';

import type { CreatePmsReservationInput, PmsReservationDetail, PmsRoomStatus } from '@tungaos/shared';

const RESERVATION_INCLUDE = {
  guest: true,
  room: true,
  roomType: true,
  history: { orderBy: { createdAt: 'desc' as const }, take: 20 },
  bookingEvents: { orderBy: { createdAt: 'desc' as const }, take: 30 },
};

@Injectable()
export class PmsReservationService {
  constructor(
    private prisma: PrismaService,
    private audit: PmsAuditService,
    private dashboard: PmsDashboardService,
    private realtime: PmsRealtimeGateway,
  ) {}

  private async generateCode(hotelId: string): Promise<string> {
    const count = await this.prisma.reservation.count({ where: { hotelId } });
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `RES-${date}-${String(count + 1).padStart(4, '0')}`;
  }

  async list(
    hotelId: string,
    params: {
      page?: number;
      limit?: number;
      status?: ReservationStatus;
      search?: string;
      checkInFrom?: string;
      checkInTo?: string;
    },
  ) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const where = {
      hotelId,
      deletedAt: null,
      ...(params.status ? { status: params.status } : {}),
      ...(params.checkInFrom || params.checkInTo
        ? {
            checkInDate: {
              ...(params.checkInFrom ? { gte: new Date(params.checkInFrom) } : {}),
              ...(params.checkInTo ? { lte: new Date(params.checkInTo) } : {}),
            },
          }
        : {}),
      ...(params.search
        ? {
            OR: [
              { reservationCode: { contains: params.search, mode: 'insensitive' as const } },
              { guest: { firstName: { contains: params.search, mode: 'insensitive' as const } } },
              { guest: { lastName: { contains: params.search, mode: 'insensitive' as const } } },
              { guest: { phone: { contains: params.search } } },
              { guest: { email: { contains: params.search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        include: { guest: true, room: true, roomType: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return {
      items: items.map((r) => this.mapSummary(r)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getById(hotelId: string, id: string): Promise<PmsReservationDetail> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id, hotelId, deletedAt: null },
      include: RESERVATION_INCLUDE,
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return this.mapDetail(reservation as Parameters<typeof this.mapDetail>[0]);
  }

  async create(hotelId: string, input: CreatePmsReservationInput, userId?: string) {
    const checkIn = new Date(input.checkInDate);
    const checkOut = new Date(input.checkOutDate);
    if (checkOut <= checkIn) throw new BadRequestException('Check-out must be after check-in');

    let guestId = input.guestId;
    if (!guestId && input.guest) {
      const guestCount = await this.prisma.guest.count({ where: { hotelId } });
      const guest = await this.prisma.guest.create({
        data: {
          hotelId,
          guestCode: `GST-${String(guestCount + 1).padStart(5, '0')}`,
          firstName: input.guest.firstName,
          lastName: input.guest.lastName,
          email: input.guest.email,
          phone: input.guest.phone,
          nationality: input.guest.nationality,
          companyName: input.guest.companyName,
          isCorporate: !!input.guest.companyName,
          createdBy: userId,
        },
      });
      guestId = guest.id;
    }
    if (!guestId) throw new BadRequestException('Guest is required');

    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
    const totalAmount = input.roomRate * nights;
    const taxAmount = Math.round(totalAmount * 0.12 * 100) / 100;
    const status = input.isGuaranteed ? ReservationStatus.GUARANTEED : ReservationStatus.CONFIRMED;

    const reservation = await this.prisma.reservation.create({
      data: {
        hotelId,
        guestId,
        roomTypeId: input.roomTypeId,
        roomId: input.roomId,
        reservationCode: await this.generateCode(hotelId),
        status,
        source: input.source,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: input.adults,
        children: input.children ?? 0,
        roomRate: input.roomRate,
        totalAmount: totalAmount + taxAmount,
        taxAmount,
        balanceAmount: totalAmount + taxAmount,
        specialRequests: input.specialRequests,
        corporateBookingId: input.corporateBookingId,
        groupBookingId: input.groupBookingId,
        travelAgentId: input.travelAgentId,
        isGuaranteed: input.isGuaranteed ?? false,
        createdBy: userId,
        history: {
          create: {
            hotelId,
            toStatus: status,
            changeReason: 'Reservation created',
            createdBy: userId,
          },
        },
        bookingEvents: {
          create: {
            hotelId,
            eventType: 'RESERVATION_CREATED',
            description: `Reservation created via ${input.source}`,
          },
        },
      },
      include: RESERVATION_INCLUDE,
    });

    if (input.roomId) {
      await this.prisma.room.update({
        where: { id: input.roomId },
        data: { status: 'RESERVED' },
      });
      this.realtime.emitRoomStatus(hotelId, input.roomId, 'RESERVED');
    }

    await this.audit.log({
      hotelId,
      userId,
      action: AuditAction.CREATE,
      entityType: 'Reservation',
      entityId: reservation.id,
      newValues: { status, source: input.source },
    });

    this.realtime.emitReservationUpdate(hotelId, reservation.id, status);
    this.dashboard.notifyDashboardRefresh(hotelId);

    return this.mapDetail(reservation as Parameters<typeof this.mapDetail>[0]);
  }

  async update(
    hotelId: string,
    id: string,
    data: Partial<CreatePmsReservationInput> & { status?: ReservationStatus; changeReason?: string },
    userId?: string,
  ) {
    const existing = await this.prisma.reservation.findFirst({
      where: { id, hotelId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Reservation not found');

    const reservation = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.reservation.update({
        where: { id },
        data: {
          ...(data.roomTypeId ? { roomTypeId: data.roomTypeId } : {}),
          ...(data.roomId !== undefined ? { roomId: data.roomId } : {}),
          ...(data.checkInDate ? { checkInDate: new Date(data.checkInDate) } : {}),
          ...(data.checkOutDate ? { checkOutDate: new Date(data.checkOutDate) } : {}),
          ...(data.adults ? { adults: data.adults } : {}),
          ...(data.children !== undefined ? { children: data.children } : {}),
          ...(data.roomRate ? { roomRate: data.roomRate } : {}),
          ...(data.specialRequests !== undefined ? { specialRequests: data.specialRequests } : {}),
          ...(data.status ? { status: data.status } : {}),
          ...(data.isGuaranteed !== undefined ? { isGuaranteed: data.isGuaranteed } : {}),
          updatedBy: userId,
        },
        include: RESERVATION_INCLUDE,
      });

      if (data.status && data.status !== existing.status) {
        await tx.reservationHistory.create({
          data: {
            hotelId,
            reservationId: id,
            fromStatus: existing.status,
            toStatus: data.status,
            changeReason: data.changeReason ?? 'Status updated',
            createdBy: userId,
          },
        });
        await tx.bookingEvent.create({
          data: {
            hotelId,
            reservationId: id,
            eventType: 'STATUS_CHANGE',
            description: `${existing.status} → ${data.status}`,
            metadata: { changeReason: data.changeReason },
          },
        });
      }

      return updated;
    });

    if (data.status) {
      this.realtime.emitReservationUpdate(hotelId, id, data.status);
    }
    this.dashboard.notifyDashboardRefresh(hotelId);
    return this.mapDetail(reservation as Parameters<typeof this.mapDetail>[0]);
  }

  async cancel(hotelId: string, id: string, reason: string, userId?: string) {
    return this.update(hotelId, id, { status: ReservationStatus.CANCELLED, changeReason: reason }, userId);
  }

  async duplicate(hotelId: string, id: string, userId?: string) {
    const source = await this.getById(hotelId, id);
    return this.create(
      hotelId,
      {
        guestId: source.guest.id,
        roomTypeId: source.roomType.id,
        source: source.source,
        checkInDate: source.checkInDate,
        checkOutDate: source.checkOutDate,
        adults: source.adults,
        children: source.children,
        roomRate: source.roomRate,
        specialRequests: source.specialRequests ?? undefined,
        isGuaranteed: source.isGuaranteed,
      },
      userId,
    );
  }

  async transfer(hotelId: string, id: string, newRoomId: string, userId?: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id, hotelId, deletedAt: null },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');

    const oldRoomId = reservation.roomId;
    await this.prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id },
        data: { roomId: newRoomId, updatedBy: userId },
      });
      if (oldRoomId) {
        await tx.room.update({ where: { id: oldRoomId }, data: { status: 'VACANT_DIRTY' } });
      }
      await tx.room.update({ where: { id: newRoomId }, data: { status: 'OCCUPIED' } });
      if (oldRoomId) {
        await tx.roomTransfer.create({
          data: {
            hotelId,
            reservationId: id,
            fromRoomId: oldRoomId,
            toRoomId: newRoomId,
            transferType: 'TRANSFER',
            createdBy: userId,
          },
        });
      }
    });

    if (oldRoomId) this.realtime.emitRoomStatus(hotelId, oldRoomId, 'VACANT_DIRTY');
    this.realtime.emitRoomStatus(hotelId, newRoomId, 'OCCUPIED');
    return this.getById(hotelId, id);
  }

  private mapSummary(r: {
    id: string;
    reservationCode: string;
    status: ReservationStatus;
    checkInDate: Date;
    checkOutDate: Date;
    totalAmount: unknown;
    room?: { roomNumber: string } | null;
  }) {
    return {
      id: r.id,
      reservationCode: r.reservationCode,
      status: r.status,
      checkInDate: r.checkInDate.toISOString().split('T')[0]!,
      checkOutDate: r.checkOutDate.toISOString().split('T')[0]!,
      roomNumber: r.room?.roomNumber ?? null,
      totalAmount: Number(r.totalAmount),
    };
  }

  private mapDetail(r: {
    id: string;
    reservationCode: string;
    status: ReservationStatus;
    source: string;
    checkInDate: Date;
    checkOutDate: Date;
    adults: number;
    children: number;
    roomRate: unknown;
    taxAmount: unknown;
    discountAmount: unknown;
    paidAmount: unknown;
    balanceAmount: unknown;
    specialRequests: string | null;
    internalNotes: string | null;
    isGuaranteed: boolean;
    totalAmount: unknown;
    guest: { id: string; firstName: string; lastName: string; email: string | null; phone: string | null; vipStatus: boolean };
    roomType: { id: string; name: string; code: string };
    room: { id: string; roomNumber: string; status: string } | null;
    history: { id: string; fromStatus: ReservationStatus | null; toStatus: ReservationStatus; changeReason: string | null; createdAt: Date }[];
    bookingEvents: { id: string; eventType: string; description: string | null; createdAt: Date; metadata: unknown }[];
  }): PmsReservationDetail {
    return {
      ...this.mapSummary(r),
      source: r.source as PmsReservationDetail['source'],
      guest: r.guest,
      roomType: r.roomType,
      room: r.room
        ? { id: r.room.id, roomNumber: r.room.roomNumber, status: r.room.status as PmsRoomStatus }
        : null,
      adults: r.adults,
      children: r.children,
      roomRate: Number(r.roomRate),
      taxAmount: Number(r.taxAmount),
      discountAmount: Number(r.discountAmount),
      paidAmount: Number(r.paidAmount),
      balanceAmount: Number(r.balanceAmount),
      specialRequests: r.specialRequests,
      internalNotes: r.internalNotes,
      isGuaranteed: r.isGuaranteed,
      history: r.history.map((h) => ({
        id: h.id,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        changeReason: h.changeReason,
        createdAt: h.createdAt.toISOString(),
      })),
      timeline: r.bookingEvents.map((e) => ({
        id: e.id,
        eventType: e.eventType,
        description: e.description,
        createdAt: e.createdAt.toISOString(),
        metadata: e.metadata as Record<string, unknown> | null,
      })),
    };
  }
}
