import { Injectable } from '@nestjs/common';
import { TripStatus, VehicleStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { TravelDeskRealtimeGateway } from '@/modules/travel-desk/gateways/travel-desk-realtime.gateway';

import type {
  AssignTmsTripSchema,
  CreateTmsTripSchema,
  CreateTravelRequestSchema,
  TmsRequestItem,
  TmsTripItem,
  UpdateTmsTripStatusSchema,
} from '@tungaos/shared';

function mapTrip(row: {
  id: string;
  tripNumber: string;
  guestName: string;
  guestPhone: string | null;
  tripType: string;
  requestSource: string;
  pickupLocation: string;
  dropLocation: string;
  scheduledAt: Date;
  status: TripStatus;
  fare: { toNumber(): number } | number;
  paymentStatus: string;
  isVip: boolean;
  isEmergency: boolean;
  specialInstructions: string | null;
  vehicle?: { name: string } | null;
  driver?: { firstName: string; lastName: string } | null;
  airportDetail?: { flightNumber: string | null; airline: string | null } | null;
}): TmsTripItem {
  const fare = typeof row.fare === 'number' ? row.fare : row.fare.toNumber();
  return {
    id: row.id,
    tripNumber: row.tripNumber,
    guestName: row.guestName,
    guestPhone: row.guestPhone,
    tripType: row.tripType,
    requestSource: row.requestSource,
    pickupLocation: row.pickupLocation,
    dropLocation: row.dropLocation,
    vehicleName: row.vehicle?.name ?? null,
    driverName: row.driver ? `${row.driver.firstName} ${row.driver.lastName}` : null,
    scheduledAt: row.scheduledAt.toISOString(),
    status: row.status,
    fare,
    paymentStatus: row.paymentStatus,
    isVip: row.isVip,
    isEmergency: row.isEmergency,
    specialInstructions: row.specialInstructions,
    flightNumber: row.airportDetail?.flightNumber,
    airline: row.airportDetail?.airline,
  };
}

const tripInclude = {
  vehicle: { select: { name: true } },
  driver: { select: { firstName: true, lastName: true } },
  airportDetail: { select: { flightNumber: true, airline: true } },
} as const;

@Injectable()
export class TmsTripService {
  constructor(
    private prisma: PrismaService,
    private realtime: TravelDeskRealtimeGateway,
  ) {}

  private async nextTripNumber(hotelId: string): Promise<string> {
    const count = await this.prisma.trip.count({ where: { hotelId } });
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `TRP-${date}-${String(count + 1).padStart(4, '0')}`;
  }

  async listTrips(hotelId: string, status?: string): Promise<TmsTripItem[]> {
    const rows = await this.prisma.trip.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(status ? { status: status as TripStatus } : {}),
      },
      include: tripInclude,
      orderBy: { scheduledAt: 'desc' },
      take: 200,
    });
    return rows.map(mapTrip);
  }

  async listRequests(hotelId: string): Promise<TmsRequestItem[]> {
    const rows = await this.prisma.travelDeskRequest.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      requestType: r.requestType,
      status: r.status,
      description: r.description,
      fromLocation: r.fromLocation,
      toLocation: r.toLocation,
      scheduledAt: r.scheduledAt?.toISOString() ?? null,
      amount: Number(r.amount),
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createRequest(hotelId: string, dto: CreateTravelRequestSchema, userId?: string) {
    const req = await this.prisma.travelDeskRequest.create({
      data: {
        hotelId,
        requestType: dto.requestType,
        description: dto.description,
        fromLocation: dto.fromLocation,
        toLocation: dto.toLocation,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        amount: dto.amount,
        guestId: dto.guestId,
        createdBy: userId,
      },
    });
    this.realtime.notifyDashboard(hotelId);
    return req;
  }

  async createTrip(hotelId: string, dto: CreateTmsTripSchema, userId?: string) {
    const tripNumber = await this.nextTripNumber(hotelId);
    const trip = await this.prisma.trip.create({
      data: {
        hotelId,
        tripNumber,
        guestName: dto.guestName,
        guestPhone: dto.guestPhone,
        guestId: dto.guestId,
        reservationId: dto.reservationId,
        bookingId: dto.bookingId,
        tripType: dto.tripType,
        requestSource: dto.requestSource,
        pickupLocation: dto.pickupLocation,
        dropLocation: dto.dropLocation,
        scheduledAt: new Date(dto.scheduledAt),
        fare: dto.fare,
        specialInstructions: dto.specialInstructions,
        isVip: dto.isVip,
        isEmergency: dto.isEmergency,
        corporateCompanyId: dto.corporateCompanyId,
        status: TripStatus.REQUESTED,
        createdBy: userId,
        ...(dto.flightNumber || dto.airline
          ? {
              airportDetail: {
                create: {
                  hotelId,
                  flightNumber: dto.flightNumber,
                  airline: dto.airline,
                  terminal: dto.terminal,
                  transferType: dto.transferType ?? 'arrival',
                },
              },
            }
          : {}),
      },
      include: tripInclude,
    });
    this.realtime.emitTripUpdate(hotelId, trip.id);
    return mapTrip(trip);
  }

  async assignTrip(hotelId: string, tripId: string, dto: AssignTmsTripSchema) {
    const data: { vehicleId?: string; driverId?: string; status?: TripStatus } = {};
    if (dto.vehicleId) {
      data.vehicleId = dto.vehicleId;
      data.status = TripStatus.VEHICLE_ASSIGNED;
      await this.prisma.vehicle.updateMany({
        where: { id: dto.vehicleId, hotelId },
        data: { status: VehicleStatus.RESERVED },
      });
    }
    if (dto.driverId) {
      data.driverId = dto.driverId;
      data.status = TripStatus.DRIVER_ASSIGNED;
    }

    const trip = await this.prisma.trip.update({
      where: { id: tripId },
      data,
      include: tripInclude,
    });

    if (dto.driverId) {
      this.realtime.emitDriverAssigned(hotelId, tripId, dto.driverId);
    }
    this.realtime.emitTripUpdate(hotelId, tripId);
    return mapTrip(trip);
  }

  async updateStatus(hotelId: string, tripId: string, dto: UpdateTmsTripStatusSchema) {
    const updates: { status: TripStatus; startedAt?: Date; completedAt?: Date } = {
      status: dto.status as TripStatus,
    };
    if (dto.status === 'TRIP_STARTED') updates.startedAt = new Date();
    if (dto.status === 'TRIP_COMPLETED') updates.completedAt = new Date();

    const trip = await this.prisma.trip.update({
      where: { id: tripId },
      data: updates,
      include: tripInclude,
    });

    if (dto.status === 'TRIP_COMPLETED' && trip.vehicleId) {
      await this.prisma.vehicle.updateMany({
        where: { id: trip.vehicleId, hotelId },
        data: { status: VehicleStatus.AVAILABLE },
      });
    }
    if (['DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'TRIP_STARTED'].includes(dto.status) && trip.vehicleId) {
      await this.prisma.vehicle.updateMany({
        where: { id: trip.vehicleId, hotelId },
        data: { status: VehicleStatus.ON_TRIP },
      });
    }

    this.realtime.emitTripUpdate(hotelId, tripId);
    return mapTrip(trip);
  }

  async listAirportTransfers(hotelId: string): Promise<TmsTripItem[]> {
    const rows = await this.prisma.trip.findMany({
      where: {
        hotelId,
        deletedAt: null,
        tripType: { in: ['AIRPORT_PICKUP', 'AIRPORT_DROP'] },
      },
      include: tripInclude,
      orderBy: { scheduledAt: 'desc' },
      take: 100,
    });
    return rows.map(mapTrip);
  }

  async listCorporateTrips(hotelId: string): Promise<TmsTripItem[]> {
    const rows = await this.prisma.trip.findMany({
      where: { hotelId, deletedAt: null, tripType: 'CORPORATE' },
      include: tripInclude,
      orderBy: { scheduledAt: 'desc' },
      take: 100,
    });
    return rows.map(mapTrip);
  }

  async getCalendar(hotelId: string, month?: string) {
    const start = month ? new Date(`${month}-01`) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);

    const trips = await this.prisma.trip.findMany({
      where: { hotelId, deletedAt: null, scheduledAt: { gte: start, lte: end } },
      select: { scheduledAt: true, vehicleId: true, driverId: true },
    });

    const byDate = new Map<string, { trips: number; vehicles: Set<string>; drivers: Set<string> }>();
    for (const t of trips) {
      const key = t.scheduledAt.toISOString().slice(0, 10);
      const cur = byDate.get(key) ?? { trips: 0, vehicles: new Set(), drivers: new Set() };
      cur.trips += 1;
      if (t.vehicleId) cur.vehicles.add(t.vehicleId);
      if (t.driverId) cur.drivers.add(t.driverId);
      byDate.set(key, cur);
    }

    return [...byDate.entries()].map(([date, v]) => ({
      date,
      trips: v.trips,
      vehicles: v.vehicles.size,
      drivers: v.drivers.size,
    }));
  }
}
