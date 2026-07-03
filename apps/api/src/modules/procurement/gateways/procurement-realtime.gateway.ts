import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { ProcRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/procurement',
  cors: { origin: '*', credentials: true },
})
export class ProcurementRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ProcurementRealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const hotelId = client.handshake.query.hotelId as string | undefined;
    if (hotelId) void client.join(`hotel:${hotelId}`);
    const vendorId = client.handshake.query.vendorId as string | undefined;
    if (vendorId) void client.join(`vendor:${vendorId}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { hotelId?: string; vendorId?: string }) {
    if (payload.hotelId) void client.join(`hotel:${payload.hotelId}`);
    if (payload.vendorId) void client.join(`vendor:${payload.vendorId}`);
    return { subscribed: true };
  }

  emit(hotelId: string, event: ProcRealtimeEvent) {
    this.server.to(`hotel:${hotelId}`).emit(event.type, event);
  }

  emitToVendor(vendorId: string, event: ProcRealtimeEvent) {
    this.server.to(`vendor:${vendorId}`).emit(event.type, event);
  }

  notifyDashboard(hotelId: string) {
    this.emit(hotelId, { type: 'dashboard:update', hotelId, payload: {}, timestamp: new Date().toISOString() });
  }

  emitPrUpdate(hotelId: string, prId: string) {
    this.emit(hotelId, { type: 'pr:update', hotelId, payload: { prId }, timestamp: new Date().toISOString() });
  }

  emitRfqUpdate(hotelId: string, rfqId: string) {
    this.emit(hotelId, { type: 'rfq:update', hotelId, payload: { rfqId }, timestamp: new Date().toISOString() });
    this.server.to(`hotel:${hotelId}`).emit('vendor:notification', { rfqId });
  }

  emitQuotationReceived(hotelId: string, quotationId: string) {
    this.emit(hotelId, { type: 'quotation:received', hotelId, payload: { quotationId }, timestamp: new Date().toISOString() });
  }

  emitPoUpdate(hotelId: string, poId: string) {
    this.emit(hotelId, { type: 'po:update', hotelId, payload: { poId }, timestamp: new Date().toISOString() });
  }

  emitGrnUpdate(hotelId: string, grnId: string) {
    this.emit(hotelId, { type: 'grn:update', hotelId, payload: { grnId }, timestamp: new Date().toISOString() });
  }
}
