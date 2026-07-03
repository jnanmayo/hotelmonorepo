import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { PmsRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/pms',
  cors: { origin: '*', credentials: true },
})
export class PmsRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(PmsRealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const hotelId = client.handshake.query.hotelId as string | undefined;
    if (hotelId) {
      void client.join(`hotel:${hotelId}`);
      this.logger.debug(`Client ${client.id} joined hotel:${hotelId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { hotelId: string; channels?: string[] }) {
    if (payload.hotelId) {
      void client.join(`hotel:${payload.hotelId}`);
    }
    for (const ch of payload.channels ?? []) {
      void client.join(`${payload.hotelId}:${ch}`);
    }
    return { subscribed: true };
  }

  emitToHotel(hotelId: string, event: PmsRealtimeEvent) {
    this.server.to(`hotel:${hotelId}`).emit(event.type, event);
  }

  emitRoomStatus(hotelId: string, roomId: string, status: string) {
    this.emitToHotel(hotelId, {
      type: 'room:status',
      hotelId,
      payload: { roomId, status },
      timestamp: new Date().toISOString(),
    });
  }

  emitReservationUpdate(hotelId: string, reservationId: string, status: string) {
    this.emitToHotel(hotelId, {
      type: 'reservation:update',
      hotelId,
      payload: { reservationId, status },
      timestamp: new Date().toISOString(),
    });
  }

  emitDashboardUpdate(hotelId: string) {
    this.emitToHotel(hotelId, {
      type: 'dashboard:update',
      hotelId,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }
}
