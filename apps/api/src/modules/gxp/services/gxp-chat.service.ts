import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { GxpRealtimeGateway } from '@/modules/gxp/gateways/gxp-realtime.gateway';

import type { GxpChatDepartment, GxpChatMessageItem, GxpChatMessageSchema, GxpSessionContext } from '@tungaos/shared';

@Injectable()
export class GxpChatService {
  constructor(
    private prisma: PrismaService,
    private realtime: GxpRealtimeGateway,
  ) {}

  async listMessages(session: GxpSessionContext, department?: GxpChatDepartment): Promise<GxpChatMessageItem[]> {
    const messages = await this.prisma.gxpChatMessage.findMany({
      where: {
        hotelId: session.hotelId,
        reservationId: session.reservationId,
        ...(department ? { department } : {}),
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    return messages.map((m) => ({
      id: m.id,
      department: m.department,
      senderType: m.senderType as 'GUEST' | 'STAFF',
      senderName: m.senderName,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
      readAt: m.readAt?.toISOString() ?? null,
    }));
  }

  async sendMessage(session: GxpSessionContext, input: GxpChatMessageSchema) {
    const msg = await this.prisma.gxpChatMessage.create({
      data: {
        hotelId: session.hotelId,
        reservationId: session.reservationId,
        department: input.department,
        senderType: 'GUEST',
        senderName: session.guestName,
        message: input.message,
      },
    });

    this.realtime.emitToReservation(session.reservationId, {
      type: 'chat:message',
      hotelId: session.hotelId,
      reservationId: session.reservationId,
      payload: { messageId: msg.id, department: input.department },
      timestamp: new Date().toISOString(),
    });

    return {
      id: msg.id,
      department: msg.department,
      senderType: 'GUEST' as const,
      senderName: session.guestName,
      message: msg.message,
      createdAt: msg.createdAt.toISOString(),
      readAt: null,
    };
  }
}
