import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { EventsRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/events',
  cors: { origin: '*', credentials: true },
})
export class EventsRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsRealtimeGateway.name);

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

  emit(hotelId: string, event: EventsRealtimeEvent) {
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

  emitLeadUpdate(hotelId: string, leadId: string) {
    this.emit(hotelId, {
      type: 'lead:update',
      hotelId,
      payload: { leadId },
      timestamp: new Date().toISOString(),
    });
  }

  emitBookingUpdate(hotelId: string, eventId: string) {
    this.emit(hotelId, {
      type: 'booking:update',
      hotelId,
      payload: { eventId },
      timestamp: new Date().toISOString(),
    });
  }

  emitHallAvailability(hotelId: string, hallId: string) {
    this.emit(hotelId, {
      type: 'hall:availability',
      hotelId,
      payload: { hallId },
      timestamp: new Date().toISOString(),
    });
  }

  emitTaskUpdate(hotelId: string, taskId: string) {
    this.emit(hotelId, {
      type: 'task:update',
      hotelId,
      payload: { taskId },
      timestamp: new Date().toISOString(),
    });
  }
}
