import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingSource, PaymentMethod, PaymentStatus, ReservationStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FrontDeskLogService } from '@/modules/front-desk/services/front-desk-log.service';
import { FrontDeskRealtimeGateway } from '@/modules/front-desk/gateways/front-desk-realtime.gateway';
import { FrontDeskDashboardService } from '@/modules/front-desk/services/front-desk-dashboard.service';
import { PmsCheckInService } from '@/modules/pms/services/pms-checkin.service';
import { PmsReservationService } from '@/modules/pms/services/pms-reservation.service';
import { PmsRoomService } from '@/modules/pms/services/pms-room.service';

import type {
  ArrivalBoardRow,
  AssignRoomInput,
  CollectPaymentInput,
  DepartureBoardRow,
  GuestFolioView,
  RoomAssignmentOption,
  WalkInInput,
} from '@tungaos/shared';

@Injectable()
export class FrontDeskOperationsService {
  constructor(
    private prisma: PrismaService,
    private log: FrontDeskLogService,
    private realtime: FrontDeskRealtimeGateway,
    private dashboard: FrontDeskDashboardService,
    private reservations: PmsReservationService,
    private rooms: PmsRoomService,
    private checkIn: PmsCheckInService,
  ) {}

  async getArrivalBoard(hotelId: string): Promise<ArrivalBoardRow[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const items = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        deletedAt: null,
        checkInDate: { gte: today, lt: tomorrow },
        status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.GUARANTEED, ReservationStatus.PENDING, ReservationStatus.CHECKED_IN] },
      },
      include: { guest: true, room: true, roomType: true, checkInRecord: true },
      orderBy: { checkInDate: 'asc' },
    });

    return items.map((r) => ({
      id: r.id,
      reservationCode: r.reservationCode,
      guestName: `${r.guest.firstName} ${r.guest.lastName}`,
      arrivalTime: r.checkInDate.toISOString().split('T')[0]!,
      roomTypeName: r.roomType.name,
      assignedRoom: r.room?.roomNumber ?? null,
      roomId: r.roomId,
      isVip: r.guest.vipStatus,
      isCorporate: r.guest.isCorporate,
      paymentStatus: Number(r.paidAmount) >= Number(r.totalAmount) ? 'PAID' : Number(r.paidAmount) > 0 ? 'PARTIAL' : 'PENDING',
      checkInStatus: r.checkInRecord?.completedAt ? 'CHECKED_IN' : r.checkInRecord ? 'IN_PROGRESS' : 'PENDING',
      balanceAmount: Number(r.balanceAmount),
      guestId: r.guestId,
    }));
  }

  async getDepartureBoard(hotelId: string): Promise<DepartureBoardRow[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const items = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        deletedAt: null,
        checkOutDate: { gte: today, lt: tomorrow },
        status: ReservationStatus.CHECKED_IN,
      },
      include: { guest: true, room: true, invoices: { orderBy: { createdAt: 'desc' }, take: 1 }, folioCharges: true },
    });

    return items.map((r) => {
      const restaurant = r.folioCharges.filter((c) => c.category === 'RESTAURANT').reduce((s, c) => s + Number(c.totalAmount), 0);
      const laundry = r.folioCharges.filter((c) => c.category === 'LAUNDRY').reduce((s, c) => s + Number(c.totalAmount), 0);
      const miniBar = r.folioCharges.filter((c) => c.category === 'MINI_BAR').reduce((s, c) => s + Number(c.totalAmount), 0);
      const invoice = r.invoices[0];
      return {
        id: r.id,
        reservationCode: r.reservationCode,
        guestName: `${r.guest.firstName} ${r.guest.lastName}`,
        roomNumber: r.room?.roomNumber ?? null,
        checkoutTime: r.checkOutDate.toISOString().split('T')[0]!,
        outstandingBalance: Number(r.balanceAmount),
        restaurantCharges: restaurant,
        laundryCharges: laundry,
        miniBarCharges: miniBar,
        paymentStatus: Number(r.paidAmount) >= Number(r.totalAmount) ? 'PAID' : 'PENDING',
        invoiceStatus: invoice?.status ?? 'NONE',
        guestId: r.guestId,
      };
    });
  }

  async walkIn(hotelId: string, input: WalkInInput, userId?: string) {
    const reservation = await this.reservations.create(
      hotelId,
      {
        guest: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          email: input.email,
        },
        roomTypeId: input.roomTypeId,
        roomId: input.roomId,
        source: BookingSource.WALK_IN,
        checkInDate: input.checkInDate,
        checkOutDate: input.checkOutDate,
        adults: input.adults,
        roomRate: input.roomRate,
        isGuaranteed: true,
      },
      userId,
    );

    if (input.paymentAmount > 0) {
      await this.collectPayment(
        hotelId,
        {
          reservationId: reservation.id,
          amount: input.paymentAmount,
          method: input.paymentMethod,
          paymentType: 'ADVANCE',
        },
        userId,
      );
    }

    if (input.roomId) {
      await this.assignRoom(hotelId, { reservationId: reservation.id, roomId: input.roomId }, userId);
    }

    await this.log.log({
      hotelId,
      userId,
      action: 'WALK_IN',
      reservationId: reservation.id,
      description: `Walk-in: ${input.firstName} ${input.lastName}`,
    });

    this.realtime.emit(hotelId, {
      type: 'arrival:update',
      hotelId,
      payload: { reservationId: reservation.id },
      timestamp: new Date().toISOString(),
    });
    this.dashboard.refresh(hotelId);

    return reservation;
  }

  async assignRoom(hotelId: string, input: AssignRoomInput, userId?: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: input.reservationId, hotelId, deletedAt: null },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');

    const room = await this.prisma.room.findFirst({
      where: { id: input.roomId, hotelId, isActive: true },
    });
    if (!room) throw new NotFoundException('Room not found');

    if (reservation.roomId && reservation.roomId !== input.roomId) {
      await this.rooms.roomTransfer(
        hotelId,
        {
          reservationId: input.reservationId,
          toRoomId: input.roomId,
          transferType: input.transferType === 'UPGRADE' ? 'UPGRADE' : input.transferType === 'DOWNGRADE' ? 'DOWNGRADE' : 'TRANSFER',
          reason: input.reason,
        },
        userId,
      );
    } else {
      await this.prisma.reservation.update({
        where: { id: input.reservationId },
        data: { roomId: input.roomId, updatedBy: userId },
      });
      await this.prisma.room.update({
        where: { id: input.roomId },
        data: { status: reservation.status === ReservationStatus.CHECKED_IN ? RoomStatus.OCCUPIED : RoomStatus.RESERVED },
      });
    }

    await this.log.log({
      hotelId,
      userId,
      action: 'ROOM_ASSIGN',
      reservationId: input.reservationId,
      entityType: 'Room',
      entityId: input.roomId,
      description: `Assigned room ${room.roomNumber}`,
    });

    this.realtime.emit(hotelId, {
      type: 'room:assigned',
      hotelId,
      payload: { reservationId: input.reservationId, roomId: input.roomId },
      timestamp: new Date().toISOString(),
    });
    this.dashboard.refresh(hotelId);

    return { reservationId: input.reservationId, roomId: input.roomId, roomNumber: room.roomNumber };
  }

  async suggestRooms(hotelId: string, reservationId: string): Promise<RoomAssignmentOption[]> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, hotelId },
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

    return rooms
      .map((r) => {
        let score = 50;
        if (reservation.guest.vipStatus) score += 20;
        if (r.status === RoomStatus.VACANT_CLEAN) score += 15;
        if (r.isAccessible && reservation.guest.preferences) score += 5;
        if (!reservation.guest.preferences && !r.isSmoking) score += 5;
        return {
          id: r.id,
          roomNumber: r.roomNumber,
          roomTypeName: r.roomType.name,
          floorName: r.floor.name,
          floorNumber: r.floor.floorNumber,
          viewType: r.roomType.viewType,
          status: r.status,
          isAccessible: r.isAccessible,
          isSmoking: r.isSmoking,
          score,
          currentGuest: null,
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  async getFolio(hotelId: string, reservationId: string): Promise<GuestFolioView> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, hotelId, deletedAt: null },
      include: { guest: true, room: true, folioCharges: true, payments: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');

    const charges = reservation.folioCharges.map((c) => ({
      id: c.id,
      category: c.category,
      description: c.description,
      amount: Number(c.totalAmount),
      postedAt: c.postedAt.toISOString(),
    }));

    if (charges.length === 0) {
      charges.push({
        id: 'room',
        category: 'ROOM',
        description: 'Room charges',
        amount: Number(reservation.totalAmount) - Number(reservation.taxAmount),
        postedAt: reservation.createdAt.toISOString(),
      });
    }

    const subtotal = charges.reduce((s, c) => s + c.amount, 0);

    return {
      reservationId: reservation.id,
      reservationCode: reservation.reservationCode,
      guestName: `${reservation.guest.firstName} ${reservation.guest.lastName}`,
      roomNumber: reservation.room?.roomNumber ?? null,
      charges,
      payments: reservation.payments.map((p) => ({
        id: p.id,
        method: p.method,
        amount: Number(p.amount),
        paidAt: p.paidAt?.toISOString() ?? null,
        status: p.status,
      })),
      subtotal,
      taxAmount: Number(reservation.taxAmount),
      discountAmount: Number(reservation.discountAmount),
      totalAmount: Number(reservation.totalAmount),
      paidAmount: Number(reservation.paidAmount),
      outstandingBalance: Number(reservation.balanceAmount),
    };
  }

  async collectPayment(hotelId: string, input: CollectPaymentInput, userId?: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: input.reservationId, hotelId, deletedAt: null },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');

    const payments = input.splitPayments?.length
      ? input.splitPayments
      : [{ method: input.method, amount: input.amount }];

    const count = await this.prisma.payment.count({ where: { hotelId } });
    let paidTotal = 0;

    for (const [i, p] of payments.entries()) {
      const amount = input.paymentType === 'REFUND' ? -Math.abs(p.amount) : p.amount;
      await this.prisma.payment.create({
        data: {
          hotelId,
          guestId: reservation.guestId,
          reservationId: input.reservationId,
          paymentNumber: `FD-PAY-${String(count + i + 1).padStart(6, '0')}`,
          amount: Math.abs(amount),
          method: p.method as PaymentMethod,
          status: PaymentStatus.CAPTURED,
          paidAt: new Date(),
          notes: `${input.paymentType}${input.notes ? `: ${input.notes}` : ''}`,
          createdBy: userId,
        },
      });
      paidTotal += Math.abs(amount);
    }

    const newPaid = Number(reservation.paidAmount) + (input.paymentType === 'REFUND' ? -paidTotal : paidTotal);
    const balance = Math.max(0, Number(reservation.totalAmount) - newPaid);

    await this.prisma.reservation.update({
      where: { id: input.reservationId },
      data: { paidAmount: newPaid, balanceAmount: balance, updatedBy: userId },
    });

    await this.log.log({
      hotelId,
      userId,
      action: 'PAYMENT',
      reservationId: input.reservationId,
      description: `${input.paymentType} ₹${paidTotal}`,
    });

    this.dashboard.refresh(hotelId);
    return { paidAmount: newPaid, balanceAmount: balance };
  }

  async startCheckIn(hotelId: string, reservationId: string, userId?: string) {
    const result = await this.checkIn.start(hotelId, reservationId, userId);
    this.realtime.emit(hotelId, {
      type: 'checkin:complete',
      hotelId,
      payload: { reservationId },
      timestamp: new Date().toISOString(),
    });
    this.dashboard.refresh(hotelId);
    return result;
  }
}
