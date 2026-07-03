import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { HrRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/hr',
  cors: { origin: '*', credentials: true },
})
export class HrRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(HrRealtimeGateway.name);

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

  emit(hotelId: string, event: HrRealtimeEvent) {
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

  emitLeaveUpdate(hotelId: string, leaveId: string) {
    this.emit(hotelId, {
      type: 'leave:update',
      hotelId,
      payload: { leaveId },
      timestamp: new Date().toISOString(),
    });
  }

  emitPayrollUpdate(hotelId: string, runId: string) {
    this.emit(hotelId, {
      type: 'payroll:update',
      hotelId,
      payload: { runId },
      timestamp: new Date().toISOString(),
    });
  }

  emitAttendanceUpdate(hotelId: string, recordId: string) {
    this.emit(hotelId, {
      type: 'attendance:update',
      hotelId,
      payload: { recordId },
      timestamp: new Date().toISOString(),
    });
  }
}
