import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import type { TmsRealtimeEvent } from '@tungaos/shared';

@WebSocketGateway({
  namespace: '/travel-desk',
  cors: { origin: '*', credentials: true },
})
export class TravelDeskRealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(TravelDeskRealtimeGateway.name);

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

  emit(hotelId: string, event: TmsRealtimeEvent) {
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

  emitTripUpdate(hotelId: string, tripId: string) {
    this.emit(hotelId, {
      type: 'trip:update',
      hotelId,
      payload: { tripId },
      timestamp: new Date().toISOString(),
    });
    this.emit(hotelId, {
      type: 'dispatch:update',
      hotelId,
      payload: { tripId },
      timestamp: new Date().toISOString(),
    });
  }

  emitDriverAssigned(hotelId: string, tripId: string, driverId: string) {
    this.emit(hotelId, {
      type: 'driver:assigned',
      hotelId,
      payload: { tripId, driverId },
      timestamp: new Date().toISOString(),
    });
  }

  emitVehicleLocation(hotelId: string, vehicleId: string, lat: number, lng: number) {
    this.emit(hotelId, {
      type: 'vehicle:location',
      hotelId,
      payload: { vehicleId, lat, lng },
      timestamp: new Date().toISOString(),
    });
  }
}
