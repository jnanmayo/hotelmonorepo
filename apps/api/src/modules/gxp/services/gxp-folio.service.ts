import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FrontDeskOperationsService } from '@/modules/front-desk/services/front-desk-operations.service';
import { GxpRealtimeGateway } from '@/modules/gxp/gateways/gxp-realtime.gateway';

import type { GxpCheckoutRequestSchema, GxpFolioView, GxpSessionContext } from '@tungaos/shared';

@Injectable()
export class GxpFolioService {
  constructor(
    private prisma: PrismaService,
    private folioOps: FrontDeskOperationsService,
    private realtime: GxpRealtimeGateway,
  ) {}

  async getFolio(session: GxpSessionContext): Promise<GxpFolioView> {
    const folio = await this.folioOps.getFolio(session.hotelId, session.reservationId);
    return {
      reservationCode: folio.reservationCode,
      guestName: folio.guestName,
      roomNumber: folio.roomNumber,
      charges: folio.charges,
      subtotal: folio.subtotal,
      taxAmount: folio.taxAmount,
      discountAmount: folio.discountAmount,
      totalAmount: folio.totalAmount,
      paidAmount: folio.paidAmount,
      outstandingBalance: folio.outstandingBalance,
    };
  }

  async requestCheckout(session: GxpSessionContext, input: GxpCheckoutRequestSchema) {
    if (input.feedback) {
      await this.prisma.gxpFeedback.create({
        data: {
          hotelId: session.hotelId,
          reservationId: session.reservationId,
          guestId: session.guestId,
          ...input.feedback,
        },
      });
    }

    await this.prisma.gxpNotification.create({
      data: {
        hotelId: session.hotelId,
        reservationId: session.reservationId,
        title: 'Checkout Requested',
        body: 'Front desk has been notified. Please settle your bill at reception or pay online.',
        type: 'CHECKOUT_REQUEST',
      },
    });

    this.realtime.emit(session.hotelId, {
      type: 'checkout:ready',
      hotelId: session.hotelId,
      reservationId: session.reservationId,
      payload: { reservationId: session.reservationId, paymentMethod: input.paymentMethod },
      timestamp: new Date().toISOString(),
    });

    return { status: 'CHECKOUT_REQUESTED', folio: await this.getFolio(session) };
  }
}
