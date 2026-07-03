import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { FinRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/finance',
  cors: { origin: '*', credentials: true },
})
export class FinanceRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(FinanceRealtimeGateway.name);

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
  handleSubscribe(client: Socket, payload: { hotelId?: string }) {
    if (payload.hotelId) void client.join(`hotel:${payload.hotelId}`);
    return { subscribed: true };
  }

  emit(hotelId: string, event: FinRealtimeEvent) {
    this.server.to(`hotel:${hotelId}`).emit(event.type, event);
  }

  notifyDashboard(hotelId: string) {
    this.emit(hotelId, { type: 'dashboard:update', hotelId, payload: {}, timestamp: new Date().toISOString() });
  }

  emitJournalUpdate(hotelId: string, journalId: string) {
    this.emit(hotelId, { type: 'journal:update', hotelId, payload: { journalId }, timestamp: new Date().toISOString() });
  }

  emitRevenueUpdate(hotelId: string) {
    this.emit(hotelId, { type: 'revenue:update', hotelId, payload: {}, timestamp: new Date().toISOString() });
  }

  emitCashUpdate(hotelId: string) {
    this.emit(hotelId, { type: 'cash:update', hotelId, payload: {}, timestamp: new Date().toISOString() });
  }
}
