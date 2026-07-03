import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CheckInStep, HousekeepingStatus, ReservationStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsDashboardService } from '@/modules/pms/services/pms-dashboard.service';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';
import { PmsReservationService } from '@/modules/pms/services/pms-reservation.service';

import type { CheckInStepSchema, CheckInWorkflow } from '@tungaos/shared';

const STEP_ORDER: CheckInStep[] = [
  CheckInStep.RESERVATION,
  CheckInStep.GUEST_VERIFICATION,
  CheckInStep.DOCUMENT_UPLOAD,
  CheckInStep.DIGITAL_SIGNATURE,
  CheckInStep.PAYMENT_VERIFICATION,
  CheckInStep.ROOM_ASSIGNMENT,
  CheckInStep.KEY_CARD_ISSUE,
  CheckInStep.COMPLETE,
];

@Injectable()
export class PmsCheckInService {
  constructor(
    private prisma: PrismaService,
    private reservations: PmsReservationService,
    private dashboard: PmsDashboardService,
    private realtime: PmsRealtimeGateway,
  ) {}

  async start(hotelId: string, reservationId: string, userId?: string): Promise<CheckInWorkflow> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, hotelId, deletedAt: null },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.status === ReservationStatus.CHECKED_IN) {
      throw new BadRequestException('Already checked in');
    }

    const guest = await this.prisma.guest.findUnique({ where: { id: reservation.guestId } });
    if (guest?.isBlacklisted) {
      throw new BadRequestException('Guest is blacklisted');
    }

    const record = await this.prisma.checkInRecord.upsert({
      where: { reservationId },
      create: {
        hotelId,
        reservationId,
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        currentStep: CheckInStep.RESERVATION,
        createdBy: userId,
        registrationCard: { create: { hotelId, guestId: reservation.guestId, createdBy: userId } },
      },
      update: {},
      include: { registrationCard: true },
    });

    return this.buildWorkflow(hotelId, record.id);
  }

  async advanceStep(hotelId: string, reservationId: string, input: CheckInStepSchema, userId?: string) {
    const record = await this.prisma.checkInRecord.findFirst({
      where: { reservationId, hotelId },
      include: { registrationCard: true },
    });
    if (!record) throw new NotFoundException('Check-in not started');

    const stepIndex = STEP_ORDER.indexOf(input.step);
    if (stepIndex < 0) throw new BadRequestException('Invalid step');

    const updates: Record<string, unknown> = {
      currentStep: input.step,
      updatedBy: userId,
    };

    if (input.roomId) {
      updates.roomId = input.roomId;
      await this.prisma.reservation.update({
        where: { id: reservationId },
        data: { roomId: input.roomId },
      });
    }
    if (input.keyCardNumber) {
      updates.keyCardIssued = true;
      updates.keyCardNumber = input.keyCardNumber;
    }
    if (input.signatureUrl) updates.signatureUrl = input.signatureUrl;
    if (input.photoUrl) updates.photoUrl = input.photoUrl;
    if (input.step === CheckInStep.GUEST_VERIFICATION) updates.verifiedAt = new Date();

    if (record.registrationCard && (input.passportScanUrl || input.aadhaarScanUrl || input.licenseScanUrl || input.signatureUrl || input.photoUrl)) {
      await this.prisma.registrationCard.update({
        where: { id: record.registrationCard.id },
        data: {
          ...(input.passportScanUrl ? { passportScanUrl: input.passportScanUrl } : {}),
          ...(input.aadhaarScanUrl ? { aadhaarScanUrl: input.aadhaarScanUrl } : {}),
          ...(input.licenseScanUrl ? { licenseScanUrl: input.licenseScanUrl } : {}),
          ...(input.signatureUrl ? { signatureUrl: input.signatureUrl } : {}),
          ...(input.photoUrl ? { photoUrl: input.photoUrl } : {}),
          autoFilled: true,
        },
      });
    }

    if (input.step === CheckInStep.COMPLETE) {
      updates.completedAt = new Date();
      await this.completeCheckIn(hotelId, reservationId, record.roomId ?? input.roomId, userId);
    }

    await this.prisma.checkInRecord.update({ where: { id: record.id }, data: updates });
    return this.buildWorkflow(hotelId, record.id);
  }

  private async completeCheckIn(hotelId: string, reservationId: string, roomId?: string, userId?: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.CHECKED_IN,
          actualCheckIn: new Date(),
          updatedBy: userId,
        },
      });
      await tx.reservationHistory.create({
        data: {
          hotelId,
          reservationId,
          toStatus: ReservationStatus.CHECKED_IN,
          changeReason: 'Digital check-in completed',
          createdBy: userId,
        },
      });
      if (roomId) {
        await tx.room.update({ where: { id: roomId }, data: { status: RoomStatus.OCCUPIED } });
      }
    });

    if (roomId) this.realtime.emitRoomStatus(hotelId, roomId, RoomStatus.OCCUPIED);
    this.realtime.emitReservationUpdate(hotelId, reservationId, ReservationStatus.CHECKED_IN);
    this.dashboard.notifyDashboardRefresh(hotelId);
  }

  async getWorkflow(hotelId: string, reservationId: string): Promise<CheckInWorkflow> {
    const record = await this.prisma.checkInRecord.findFirst({ where: { reservationId, hotelId } });
    if (!record) throw new NotFoundException('Check-in not found');
    return this.buildWorkflow(hotelId, record.id);
  }

  private async buildWorkflow(hotelId: string, checkInId: string): Promise<CheckInWorkflow> {
    const record = await this.prisma.checkInRecord.findUnique({
      where: { id: checkInId },
      include: { registrationCard: true },
    });
    if (!record) throw new NotFoundException('Check-in record not found');

    const reservation = await this.reservations.getById(hotelId, record.reservationId);

    return {
      id: record.id,
      reservationId: record.reservationId,
      currentStep: record.currentStep,
      keyCardIssued: record.keyCardIssued,
      registrationCard: record.registrationCard
        ? {
            passportScanUrl: record.registrationCard.passportScanUrl,
            aadhaarScanUrl: record.registrationCard.aadhaarScanUrl,
            signatureUrl: record.registrationCard.signatureUrl,
            photoUrl: record.registrationCard.photoUrl,
          }
        : null,
      reservation,
    };
  }
}

@Injectable()
export class PmsHousekeepingIntegrationService {
  constructor(private prisma: PrismaService) {}

  /** Called on checkout — creates HK task and marks room dirty (integration hook, not full HK module) */
  async onGuestCheckout(hotelId: string, roomId: string, userId?: string) {
    await this.prisma.$transaction([
      this.prisma.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.VACANT_DIRTY },
      }),
      this.prisma.roomStatusHistory.create({
        data: {
          hotelId,
          roomId,
          fromStatus: RoomStatus.OCCUPIED,
          toStatus: RoomStatus.VACANT_DIRTY,
          reason: 'Guest checkout — housekeeping task created',
          createdBy: userId,
        },
      }),
      this.prisma.housekeepingTask.create({
        data: {
          hotelId,
          roomId,
          status: HousekeepingStatus.PENDING,
          taskType: 'checkout_cleaning',
          priority: 'MEDIUM',
          notes: 'Auto-created on guest checkout',
          createdBy: userId,
        },
      }),
    ]);
  }

  /** Called when HK completes cleaning — room available */
  async onCleaningComplete(hotelId: string, roomId: string, userId?: string) {
    await this.prisma.room.update({
      where: { id: roomId },
      data: { status: RoomStatus.VACANT_CLEAN, updatedBy: userId },
    });
  }
}
