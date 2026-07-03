import { Injectable } from '@nestjs/common';
import { FrontDeskLogAction, ReservationStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

@Injectable()
export class FrontDeskLogService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    hotelId: string;
    userId?: string;
    action: FrontDeskLogAction;
    entityType?: string;
    entityId?: string;
    reservationId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.frontDeskLog.create({
      data: {
        hotelId: params.hotelId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        reservationId: params.reservationId,
        description: params.description,
        metadata: params.metadata as object | undefined,
      },
    });
  }
}
