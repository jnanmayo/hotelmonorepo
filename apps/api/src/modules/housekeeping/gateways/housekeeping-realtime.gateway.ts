import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { HkRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/housekeeping',
  cors: { origin: '*', credentials: true },
})
export class HousekeepingRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(HousekeepingRealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const hotelId = client.handshake.query.hotelId as string | undefined;
    if (hotelId) {
      void client.join(`hotel:${hotelId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { hotelId: string }) {
    if (payload.hotelId) {
      void client.join(`hotel:${payload.hotelId}`);
    }
    return { subscribed: true };
  }

  emit(hotelId: string, event: HkRealtimeEvent) {
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
}
