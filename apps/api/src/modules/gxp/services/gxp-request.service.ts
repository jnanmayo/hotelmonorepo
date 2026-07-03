import { Injectable } from '@nestjs/common';
import { GxpRequestCategory, GxpRequestStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { GxpRealtimeGateway } from '@/modules/gxp/gateways/gxp-realtime.gateway';
import { HkTaskService } from '@/modules/housekeeping/services/hk-task.service';

import type { GxpCreateRequestSchema, GxpRequestItem, GxpSessionContext } from '@tungaos/shared';

@Injectable()
export class GxpRequestService {
  constructor(
    private prisma: PrismaService,
    private realtime: GxpRealtimeGateway,
    private hkTasks: HkTaskService,
  ) {}

  async listRequests(session: GxpSessionContext): Promise<GxpRequestItem[]> {
    const items = await this.prisma.gxpRequest.findMany({
      where: { hotelId: session.hotelId, reservationId: session.reservationId, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return items.map((r) => this.mapRequest(r));
  }

  async createRequest(session: GxpSessionContext, input: GxpCreateRequestSchema) {
    const request = await this.prisma.gxpRequest.create({
      data: {
        hotelId: session.hotelId,
        reservationId: session.reservationId,
        guestId: session.guestId,
        roomId: session.roomId,
        category: input.category as GxpRequestCategory,
        subType: input.subType,
        description: input.description,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        photoUrls: input.photoUrls,
      },
    });

    if (input.category === 'HOUSEKEEPING' && session.roomId) {
      await this.hkTasks.createTask(session.hotelId, {
        roomId: session.roomId,
        taskType: 'guest_request',
        priority: 'MEDIUM',
        notes: input.description ?? input.subType,
      }).catch(() => undefined);
    }

    await this.prisma.gxpNotification.create({
      data: {
        hotelId: session.hotelId,
        reservationId: session.reservationId,
        title: 'Request Received',
        body: `Your ${input.subType.replace(/_/g, ' ')} request has been submitted.`,
        type: 'REQUEST_CREATED',
      },
    });

    this.realtime.emitToReservation(session.reservationId, {
      type: 'request:created',
      hotelId: session.hotelId,
      reservationId: session.reservationId,
      payload: { requestId: request.id, category: input.category },
      timestamp: new Date().toISOString(),
    });

    return this.mapRequest(request);
  }

  async updateRequestStatus(hotelId: string, requestId: string, status: GxpRequestStatus) {
    const request = await this.prisma.gxpRequest.findFirst({ where: { id: requestId, hotelId } });
    if (!request) return null;

    const updated = await this.prisma.gxpRequest.update({
      where: { id: requestId },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    this.realtime.emitToReservation(request.reservationId, {
      type: 'request:updated',
      hotelId,
      reservationId: request.reservationId,
      payload: { requestId, status },
      timestamp: new Date().toISOString(),
    });

    return this.mapRequest(updated);
  }

  private mapRequest(r: {
    id: string;
    category: GxpRequestCategory;
    subType: string;
    status: GxpRequestStatus;
    description: string | null;
    scheduledAt: Date | null;
    createdAt: Date;
    completedAt: Date | null;
  }): GxpRequestItem {
    return {
      id: r.id,
      category: r.category,
      subType: r.subType,
      status: r.status,
      description: r.description,
      scheduledAt: r.scheduledAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      completedAt: r.completedAt?.toISOString() ?? null,
    };
  }
}
