import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { CrmRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/crm',
  cors: { origin: '*', credentials: true },
})
export class CrmRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(CrmRealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const hotelId = client.handshake.query.hotelId as string | undefined;
    if (hotelId) void client.join(`hotel:${hotelId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { hotelId: string }) {
    if (payload.hotelId) void client.join(`hotel:${payload.hotelId}`);
    return { subscribed: true };
  }

  emit(hotelId: string, event: CrmRealtimeEvent) {
    this.server.to(`hotel:${hotelId}`).emit(event.type, event);
  }

  notifyDashboard(hotelId: string) {
    this.emit(hotelId, {
      type: 'dashboard:update',
      hotelId,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  emitGuestUpdate(hotelId: string, guestId: string) {
    this.emit(hotelId, {
      type: 'guest:update',
      hotelId,
      payload: { guestId },
      timestamp: new Date().toISOString(),
    });
  }

  emitLeadUpdate(hotelId: string, leadId: string) {
    this.emit(hotelId, {
      type: 'lead:update',
      hotelId,
      payload: { leadId },
      timestamp: new Date().toISOString(),
    });
  }

  emitLoyaltyUpdate(hotelId: string, accountId: string) {
    this.emit(hotelId, {
      type: 'loyalty:update',
      hotelId,
      payload: { accountId },
      timestamp: new Date().toISOString(),
    });
  }

  emitFeedback(hotelId: string, feedbackId: string) {
    this.emit(hotelId, {
      type: 'feedback:new',
      hotelId,
      payload: { feedbackId },
      timestamp: new Date().toISOString(),
    });
  }
}
