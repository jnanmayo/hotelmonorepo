import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { CorpSalesRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/corporate-sales',
  cors: { origin: '*', credentials: true },
})
export class CorpSalesRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(CorpSalesRealtimeGateway.name);

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

  emit(hotelId: string, event: CorpSalesRealtimeEvent) {
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

  emitCreditUpdate(hotelId: string, companyId: string) {
    this.emit(hotelId, {
      type: 'credit:update',
      hotelId,
      payload: { companyId },
      timestamp: new Date().toISOString(),
    });
  }

  emitContractUpdate(hotelId: string, contractId: string) {
    this.emit(hotelId, {
      type: 'contract:update',
      hotelId,
      payload: { contractId },
      timestamp: new Date().toISOString(),
    });
  }
}
