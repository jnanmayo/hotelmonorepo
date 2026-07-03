import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FolioChargeCategory, InvoiceStatus, PaymentMethod, PaymentStatus, ReservationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsDashboardService } from '@/modules/pms/services/pms-dashboard.service';
import { PmsHousekeepingIntegrationService } from '@/modules/pms/services/pms-checkin.service';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';
import { PmsReservationService } from '@/modules/pms/services/pms-reservation.service';

import type { CheckOutSchema, CheckOutWorkflow, FolioChargeSchema } from '@tungaos/shared';

@Injectable()
export class PmsCheckOutService {
  constructor(
    private prisma: PrismaService,
    private reservations: PmsReservationService,
    private hkIntegration: PmsHousekeepingIntegrationService,
    private dashboard: PmsDashboardService,
    private realtime: PmsRealtimeGateway,
  ) {}

  async getWorkflow(hotelId: string, reservationId: string): Promise<CheckOutWorkflow> {
    const reservation = await this.reservations.getById(hotelId, reservationId);
    const [folioCharges, checkOutRecord, payments, invoice] = await Promise.all([
      this.prisma.folioCharge.findMany({
        where: { hotelId, reservationId, deletedAt: null },
        orderBy: { postedAt: 'asc' },
      }),
      this.prisma.checkOutRecord.findFirst({ where: { reservationId, hotelId } }),
      this.prisma.payment.findMany({
        where: { hotelId, reservationId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.findFirst({
        where: { hotelId, reservationId, deletedAt: null },
        include: { lineItems: true },
      }),
    ]);

    const roomCharges = folioCharges
      .filter((c) => c.category === FolioChargeCategory.ROOM)
      .reduce((s, c) => s + Number(c.totalAmount), 0);

    return {
      reservation,
      folioCharges: folioCharges.map((c) => ({
        id: c.id,
        category: c.category,
        description: c.description,
        quantity: c.quantity,
        unitPrice: Number(c.unitPrice),
        taxAmount: Number(c.taxAmount),
        totalAmount: Number(c.totalAmount),
        postedAt: c.postedAt.toISOString(),
      })),
      checkOutRecord: checkOutRecord
        ? {
            roomCharges: Number(checkOutRecord.roomCharges),
            restaurantCharges: Number(checkOutRecord.restaurantCharges),
            laundryCharges: Number(checkOutRecord.laundryCharges),
            miniBarCharges: Number(checkOutRecord.miniBarCharges),
            spaCharges: Number(checkOutRecord.spaCharges),
            taxAmount: Number(checkOutRecord.taxAmount),
            discountAmount: Number(checkOutRecord.discountAmount),
            loyaltyRedemption: Number(checkOutRecord.loyaltyRedemption),
            totalAmount: Number(checkOutRecord.totalAmount),
          }
        : null,
      payments: payments.map((p) => ({
        id: p.id,
        paymentNumber: p.paymentNumber,
        amount: Number(p.amount),
        method: p.method,
        status: p.status,
        paidAt: p.paidAt?.toISOString() ?? null,
      })),
      invoice: invoice
        ? {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            subtotal: Number(invoice.subtotal),
            taxAmount: Number(invoice.taxAmount),
            discountAmount: Number(invoice.discountAmount),
            totalAmount: Number(invoice.totalAmount),
            paidAmount: Number(invoice.paidAmount),
            balanceAmount: Number(invoice.balanceAmount),
            issuedAt: invoice.issuedAt?.toISOString() ?? null,
            lineItems: invoice.lineItems.map((li) => ({
              id: li.id,
              description: li.description,
              hsnSac: li.hsnSac,
              quantity: li.quantity,
              unitPrice: Number(li.unitPrice),
              cgstAmount: Number(li.cgstAmount),
              sgstAmount: Number(li.sgstAmount),
              igstAmount: Number(li.igstAmount),
              totalAmount: Number(li.totalAmount),
            })),
          }
        : null,
    };
  }

  async postFolioCharge(hotelId: string, input: FolioChargeSchema, userId?: string) {
    const total = input.unitPrice * input.quantity + (input.taxAmount ?? 0);
    return this.prisma.folioCharge.create({
      data: {
        hotelId,
        reservationId: input.reservationId,
        category: input.category,
        description: input.description,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        taxAmount: input.taxAmount ?? 0,
        totalAmount: total,
        sourceRef: input.sourceRef,
        createdBy: userId,
      },
    });
  }

  /** Restaurant POS integration — charge to room */
  async postRestaurantCharge(hotelId: string, reservationId: string, amount: number, description: string, sourceRef?: string) {
    return this.postFolioCharge(hotelId, {
      reservationId,
      category: 'RESTAURANT',
      description,
      quantity: 1,
      unitPrice: amount,
      taxAmount: Math.round(amount * 0.05 * 100) / 100,
      sourceRef,
    });
  }

  async complete(hotelId: string, reservationId: string, input: CheckOutSchema, userId?: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, hotelId, deletedAt: null },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.status !== ReservationStatus.CHECKED_IN) {
      throw new BadRequestException('Guest is not checked in');
    }

    const folioCharges = await this.prisma.folioCharge.findMany({
      where: { hotelId, reservationId, deletedAt: null },
    });

    const sumByCategory = (cat: FolioChargeCategory) =>
      folioCharges.filter((c) => c.category === cat).reduce((s, c) => s + Number(c.totalAmount), 0);

    const roomCharges = sumByCategory(FolioChargeCategory.ROOM) || Number(reservation.totalAmount);
    const restaurantCharges = sumByCategory(FolioChargeCategory.RESTAURANT);
    const laundryCharges = sumByCategory(FolioChargeCategory.LAUNDRY);
    const miniBarCharges = sumByCategory(FolioChargeCategory.MINI_BAR);
    const spaCharges = sumByCategory(FolioChargeCategory.SPA);
    const subtotal = roomCharges + restaurantCharges + laundryCharges + miniBarCharges + spaCharges;
    const discountAmount = input.discountAmount ?? 0;
    const loyaltyRedemption = input.loyaltyRedemption ?? 0;
    const taxAmount = Math.round(subtotal * 0.12 * 100) / 100;
    const totalAmount = subtotal + taxAmount - discountAmount - loyaltyRedemption;

    const paymentCount = await this.prisma.payment.count({ where: { hotelId } });
    const invoiceCount = await this.prisma.invoice.count({ where: { hotelId } });

    const result = await this.prisma.$transaction(async (tx) => {
      const payments = input.splitPayments?.length
        ? input.splitPayments
        : [{ method: input.paymentMethod, amount: input.paymentAmount }];

      for (const p of payments) {
        await tx.payment.create({
          data: {
            hotelId,
            guestId: reservation.guestId,
            reservationId,
            paymentNumber: `PAY-${String(paymentCount + 1).padStart(6, '0')}`,
            amount: p.amount,
            method: p.method as PaymentMethod,
            status: PaymentStatus.CAPTURED,
            paidAt: new Date(),
            createdBy: userId,
          },
        });
      }

      const paidTotal = payments.reduce((s, p) => s + p.amount, 0);

      const invoice = await tx.invoice.create({
        data: {
          hotelId,
          guestId: reservation.guestId,
          reservationId,
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`,
          status: paidTotal >= totalAmount ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          paidAmount: paidTotal,
          balanceAmount: Math.max(0, totalAmount - paidTotal),
          issuedAt: new Date(),
          createdBy: userId,
          lineItems: {
            create: [
              ...(roomCharges > 0
                ? [{
                    hotelId,
                    description: 'Room Charges',
                    hsnSac: '996311',
                    quantity: 1,
                    unitPrice: roomCharges,
                    cgstAmount: taxAmount / 2,
                    sgstAmount: taxAmount / 2,
                    totalAmount: roomCharges,
                  }]
                : []),
              ...(restaurantCharges > 0
                ? [{
                    hotelId,
                    description: 'Restaurant Charges',
                    hsnSac: '996331',
                    quantity: 1,
                    unitPrice: restaurantCharges,
                    cgstAmount: 0,
                    sgstAmount: 0,
                    totalAmount: restaurantCharges,
                  }]
                : []),
            ],
          },
        },
      });

      await tx.checkOutRecord.upsert({
        where: { reservationId },
        create: {
          hotelId,
          reservationId,
          guestId: reservation.guestId,
          roomCharges,
          restaurantCharges,
          laundryCharges,
          miniBarCharges,
          spaCharges,
          taxAmount,
          discountAmount,
          loyaltyRedemption,
          totalAmount,
          feedbackRating: input.feedbackRating,
          feedbackNotes: input.feedbackNotes,
          completedAt: new Date(),
          createdBy: userId,
        },
        update: {
          completedAt: new Date(),
          totalAmount,
          feedbackRating: input.feedbackRating,
          feedbackNotes: input.feedbackNotes,
        },
      });

      await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.CHECKED_OUT,
          actualCheckOut: new Date(),
          paidAmount: { increment: paidTotal },
          balanceAmount: Math.max(0, totalAmount - paidTotal),
          updatedBy: userId,
        },
      });

      await tx.reservationHistory.create({
        data: {
          hotelId,
          reservationId,
          toStatus: ReservationStatus.CHECKED_OUT,
          changeReason: 'Checkout completed',
          createdBy: userId,
        },
      });

      return invoice;
    });

    if (reservation.roomId) {
      await this.hkIntegration.onGuestCheckout(hotelId, reservation.roomId, userId);
      this.realtime.emitRoomStatus(hotelId, reservation.roomId, 'VACANT_DIRTY');
    }

    this.realtime.emitReservationUpdate(hotelId, reservationId, ReservationStatus.CHECKED_OUT);
    this.dashboard.notifyDashboardRefresh(hotelId);

    return { invoiceId: result.id, invoiceNumber: result.invoiceNumber, totalAmount };
  }
}
