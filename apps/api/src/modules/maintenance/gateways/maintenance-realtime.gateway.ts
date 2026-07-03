import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { EamRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/maintenance',
  cors: { origin: '*', credentials: true },
})
export class MaintenanceRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MaintenanceRealtimeGateway.name);

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

  emit(hotelId: string, event: EamRealtimeEvent) {
    this.server.to(`hotel:${hotelId}`).emit(event.type, event);
  }

  notifyDashboard(hotelId: string) {
    this.emit(hotelId, { type: 'dashboard:update', hotelId, payload: {}, timestamp: new Date().toISOString() });
  }

  emitWorkOrderUpdate(hotelId: string, workOrderId: string) {
    this.emit(hotelId, {
      type: 'workorder:update',
      hotelId,
      payload: { workOrderId },
      timestamp: new Date().toISOString(),
    });
  }

  emitRequestUpdate(hotelId: string, requestId: string) {
    this.emit(hotelId, {
      type: 'request:update',
      hotelId,
      payload: { requestId },
      timestamp: new Date().toISOString(),
    });
  }

  emitAssetUpdate(hotelId: string, assetId: string) {
    this.emit(hotelId, {
      type: 'asset:update',
      hotelId,
      payload: { assetId },
      timestamp: new Date().toISOString(),
    });
  }
}
