import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BookingSource, ReservationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CHANNEL_PROVIDERS, mapBookingSourceToProvider } from '@/modules/channel/channel.constants';
import { ChannelSyncService } from '@/modules/channel/services/channel-sync.service';

export interface OtaWebhookPayload {
  eventType: 'BOOKING_CREATED' | 'BOOKING_MODIFIED' | 'BOOKING_CANCELLED' | 'PAYMENT_RECEIVED';
  externalRef: string;
  hotelCode?: string;
  roomTypeCode?: string;
  checkIn: string;
  checkOut: string;
  guest: { firstName: string; lastName: string; email?: string; phone?: string };
  totalAmount: number;
  currency?: string;
  adults?: number;
  children?: number;
  paymentStatus?: string;
}

@Injectable()
export class ChannelWebhookService {
  private readonly logger = new Logger(ChannelWebhookService.name);

  constructor(
    private prisma: PrismaService,
    private channelSync: ChannelSyncService,
  ) {}

  async handleWebhook(hotelId: string, provider: string, payload: OtaWebhookPayload, rawPayload: unknown) {
    const integration = await this.prisma.otaIntegration.findFirst({
      where: { hotelId, provider, isActive: true, deletedAt: null },
    });

    const event = await this.prisma.channelWebhookEvent.create({
      data: {
        hotelId,
        integrationId: integration?.id,
        eventType: payload.eventType,
        provider,
        externalRef: payload.externalRef,
        payload: rawPayload as object,
        signatureValid: true,
      },
    });

    try {
      let reservationId: string | undefined;

      if (payload.eventType === 'BOOKING_CREATED' || payload.eventType === 'BOOKING_MODIFIED') {
        reservationId = await this.createOrUpdateOtaReservation(hotelId, provider, integration?.id, payload);
      } else if (payload.eventType === 'BOOKING_CANCELLED') {
        reservationId = await this.cancelOtaReservation(hotelId, payload.externalRef);
      }

      await this.prisma.channelWebhookEvent.update({
        where: { id: event.id },
        data: { processed: true, processedAt: new Date(), reservationId },
      });

      if (payload.eventType === 'BOOKING_CREATED') {
        await this.channelSync.onInventoryChanged(hotelId, `OTA booking ${payload.externalRef}`);
      }

      return { success: true, eventId: event.id, reservationId };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Webhook processing failed';
      await this.prisma.channelWebhookEvent.update({
        where: { id: event.id },
        data: { errorMessage: message, retryCount: { increment: 1 } },
      });
      throw err;
    }
  }

  private async createOrUpdateOtaReservation(
    hotelId: string,
    provider: string,
    integrationId: string | undefined,
    payload: OtaWebhookPayload,
  ) {
    const existing = await this.prisma.reservation.findFirst({
      where: { hotelId, otaReference: payload.externalRef, deletedAt: null },
    });
    if (existing) {
      return existing.id;
    }

    const mapping = payload.roomTypeCode
      ? await this.prisma.channelMapping.findFirst({
          where: {
            hotelId,
            integrationId,
            externalRoomCode: payload.roomTypeCode,
            isActive: true,
          },
        })
      : null;

    const roomType = mapping
      ? await this.prisma.roomType.findUnique({ where: { id: mapping.roomTypeId } })
      : await this.prisma.roomType.findFirst({ where: { hotelId, isActive: true } });

    if (!roomType) throw new BadRequestException('No room type mapped for OTA booking');

    const bookingSource = this.providerToBookingSource(provider);
    const guest = await this.prisma.guest.upsert({
      where: {
        hotelId_guestCode: {
          hotelId,
          guestCode: `OTA-${payload.externalRef}`,
        },
      },
      create: {
        hotelId,
        guestCode: `OTA-${payload.externalRef}`,
        firstName: payload.guest.firstName,
        lastName: payload.guest.lastName,
        email: payload.guest.email,
        phone: payload.guest.phone,
      },
      update: {
        firstName: payload.guest.firstName,
        lastName: payload.guest.lastName,
        email: payload.guest.email,
        phone: payload.guest.phone,
      },
    });

    const commissionPct = integrationId
      ? Number((await this.prisma.otaIntegration.findUnique({ where: { id: integrationId } }))?.commissionPct ?? 0)
      : Number(CHANNEL_PROVIDERS[provider as keyof typeof CHANNEL_PROVIDERS]?.commissionPct ?? 15);

    const reservationCode = `OTA${payload.externalRef.slice(-8).toUpperCase()}`;
    const reservation = await this.prisma.reservation.create({
      data: {
        hotelId,
        guestId: guest.id,
        roomTypeId: roomType.id,
        reservationCode,
        status: ReservationStatus.CONFIRMED,
        source: bookingSource,
        checkInDate: new Date(payload.checkIn),
        checkOutDate: new Date(payload.checkOut),
        adults: payload.adults ?? 2,
        children: payload.children ?? 0,
        roomRate: payload.totalAmount,
        totalAmount: payload.totalAmount,
        paidAmount: payload.paymentStatus === 'PAID' ? payload.totalAmount : 0,
        balanceAmount: payload.paymentStatus === 'PAID' ? 0 : payload.totalAmount,
        currency: payload.currency ?? 'INR',
        otaReference: payload.externalRef,
      },
    });

    if (integrationId) {
      const commissionAmount = payload.totalAmount * (commissionPct / 100);
      await this.prisma.channelCommissionLog.create({
        data: {
          hotelId,
          integrationId,
          reservationId: reservation.id,
          commissionPct,
          bookingAmount: payload.totalAmount,
          commissionAmount,
        },
      });
    }

    await this.prisma.reservationHistory.create({
      data: {
        hotelId,
        reservationId: reservation.id,
        toStatus: ReservationStatus.CONFIRMED,
        changeReason: `OTA booking from ${provider}`,
        metadata: { externalRef: payload.externalRef },
      },
    });

    this.logger.log(`Created OTA reservation ${reservationCode} from ${provider}`);
    return reservation.id;
  }

  private async cancelOtaReservation(hotelId: string, externalRef: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { hotelId, otaReference: externalRef, deletedAt: null },
    });
    if (!reservation) throw new NotFoundException('OTA reservation not found');

    await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.CANCELLED },
    });

    await this.prisma.reservationHistory.create({
      data: {
        hotelId,
        reservationId: reservation.id,
        fromStatus: reservation.status,
        toStatus: ReservationStatus.CANCELLED,
        changeReason: 'OTA cancellation webhook',
      },
    });

    await this.channelSync.onInventoryChanged(hotelId, `OTA cancellation ${externalRef}`);
    return reservation.id;
  }

  private providerToBookingSource(provider: string): BookingSource {
    const map: Record<string, BookingSource> = {
      BOOKING_COM: BookingSource.OTA_BOOKING_COM,
      EXPEDIA: BookingSource.OTA_EXPEDIA,
      HOTELS_COM: BookingSource.OTA_EXPEDIA,
      AGODA: BookingSource.OTA_AGODA,
      MMT: BookingSource.OTA_MMT,
      GOIBIBO: BookingSource.OTA_MMT,
      TRIP_COM: BookingSource.OTA_AGODA,
      CORPORATE: BookingSource.CORPORATE_PORTAL,
      TRAVEL_AGENT: BookingSource.TRAVEL_AGENT,
      DIRECT_WEBSITE: BookingSource.DIRECT_WEBSITE,
    };
    return map[provider] ?? BookingSource.OTHER;
  }

  async listWebhookEvents(hotelId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.channelWebhookEvent.findMany({
        where: { hotelId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.channelWebhookEvent.count({ where: { hotelId } }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}

export { mapBookingSourceToProvider };
