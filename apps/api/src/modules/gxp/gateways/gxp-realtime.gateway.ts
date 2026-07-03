import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { GxpRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/gxp',
  cors: { origin: '*', credentials: true },
})
export class GxpRealtimeGateway implements OnGatewayConnection {
  private readonly logger = new Logger(GxpRealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const hotelId = client.handshake.query.hotelId as string | undefined;
    const reservationId = client.handshake.query.reservationId as string | undefined;
    if (hotelId) void client.join(`hotel:${hotelId}`);
    if (reservationId) void client.join(`reservation:${reservationId}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { hotelId: string; reservationId?: string }) {
    if (payload.hotelId) void client.join(`hotel:${payload.hotelId}`);
    if (payload.reservationId) void client.join(`reservation:${payload.reservationId}`);
    return { subscribed: true };
  }

  emitToReservation(reservationId: string, event: GxpRealtimeEvent) {
    this.server.to(`reservation:${reservationId}`).emit(event.type, event);
    this.server.to(`hotel:${event.hotelId}`).emit(event.type, event);
  }

  emit(hotelId: string, event: GxpRealtimeEvent) {
    this.server.to(`hotel:${hotelId}`).emit(event.type, event);
  }
}
