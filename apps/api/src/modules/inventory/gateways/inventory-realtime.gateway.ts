import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { InvRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/inventory',
  cors: { origin: '*', credentials: true },
})
export class InventoryRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(InventoryRealtimeGateway.name);

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

  emit(hotelId: string, event: InvRealtimeEvent) {
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

  emitStockUpdate(hotelId: string, itemId: string) {
    this.emit(hotelId, {
      type: 'stock:update',
      hotelId,
      payload: { itemId },
      timestamp: new Date().toISOString(),
    });
  }

  emitTransferUpdate(hotelId: string, transferId: string) {
    this.emit(hotelId, {
      type: 'transfer:update',
      hotelId,
      payload: { transferId },
      timestamp: new Date().toISOString(),
    });
  }

  emitConsumption(hotelId: string, consumptionId: string) {
    this.emit(hotelId, {
      type: 'consumption:recorded',
      hotelId,
      payload: { consumptionId },
      timestamp: new Date().toISOString(),
    });
  }

  emitLowStockAlert(hotelId: string, itemId: string, quantity: number) {
    this.emit(hotelId, {
      type: 'alert:low_stock',
      hotelId,
      payload: { itemId, quantity },
      timestamp: new Date().toISOString(),
    });
  }
}
