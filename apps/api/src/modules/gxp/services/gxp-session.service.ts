import { randomBytes } from 'crypto';

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { GxpSessionContext, GxpSessionSchema } from '@tungaos/shared';

@Injectable()
export class GxpSessionService {
  constructor(private prisma: PrismaService) {}

  async createSession(input: GxpSessionSchema): Promise<GxpSessionContext> {
    let reservation;

    if (input.qrToken) {
      const qr = await this.prisma.roomQrCode.findFirst({
        where: { token: input.qrToken, isActive: true },
      });
      if (!qr) throw new NotFoundException('Invalid QR code');

      await this.prisma.roomQrCode.update({
        where: { id: qr.id },
        data: { scanCount: { increment: 1 } },
      });

      reservation = await this.prisma.reservation.findFirst({
        where: {
          hotelId: qr.hotelId,
          roomId: qr.roomId,
          status: ReservationStatus.CHECKED_IN,
          deletedAt: null,
        },
        include: { guest: true, room: true, roomType: true, hotel: true },
        orderBy: { actualCheckIn: 'desc' },
      });
    } else if (input.reservationCode && input.lastName) {
      reservation = await this.prisma.reservation.findFirst({
        where: {
          reservationCode: input.reservationCode.toUpperCase(),
          deletedAt: null,
          status: { in: [ReservationStatus.CHECKED_IN, ReservationStatus.CONFIRMED] },
          guest: { lastName: { equals: input.lastName, mode: 'insensitive' } },
        },
        include: { guest: true, room: true, roomType: true, hotel: true },
      });
    }

    if (!reservation) throw new NotFoundException('No active stay found for this room or booking');

    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.guestPortalSession.create({
      data: {
        hotelId: reservation.hotelId,
        reservationId: reservation.id,
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        sessionToken,
        expiresAt,
      },
    });

    return this.buildContext(sessionToken, reservation, expiresAt);
  }

  async validateSession(token: string): Promise<GxpSessionContext> {
    const session = await this.prisma.guestPortalSession.findFirst({
      where: { sessionToken: token, isActive: true, expiresAt: { gt: new Date() } },
    });
    if (!session) throw new UnauthorizedException('Session expired or invalid');

    const reservation = await this.prisma.reservation.findFirst({
      where: { id: session.reservationId, deletedAt: null },
      include: { guest: true, room: true, roomType: true, hotel: true },
    });
    if (!reservation) throw new UnauthorizedException('Reservation not found');

    await this.prisma.guestPortalSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    return this.buildContext(token, reservation, session.expiresAt);
  }

  private buildContext(
    sessionToken: string,
    reservation: {
      id: string;
      hotelId: string;
      reservationCode: string;
      guestId: string;
      roomId: string | null;
      checkInDate: Date;
      checkOutDate: Date;
      guest: { firstName: string; lastName: string };
      room: { roomNumber: string } | null;
      roomType: { name: string };
      hotel: { name: string };
    },
    expiresAt: Date,
  ): GxpSessionContext {
    const nightsRemaining = Math.max(
      0,
      Math.ceil((reservation.checkOutDate.getTime() - Date.now()) / 86400000),
    );

    return {
      sessionToken,
      hotelId: reservation.hotelId,
      hotelName: reservation.hotel.name,
      reservationId: reservation.id,
      reservationCode: reservation.reservationCode,
      guestId: reservation.guestId,
      guestName: `${reservation.guest.firstName} ${reservation.guest.lastName}`,
      roomId: reservation.roomId,
      roomNumber: reservation.room?.roomNumber ?? null,
      roomType: reservation.roomType.name,
      checkInDate: reservation.checkInDate.toISOString(),
      checkOutDate: reservation.checkOutDate.toISOString(),
      nightsRemaining,
      expiresAt: expiresAt.toISOString(),
    };
  }
}
