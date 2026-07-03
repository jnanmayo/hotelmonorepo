import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { TravelDeskRealtimeGateway } from '@/modules/travel-desk/gateways/travel-desk-realtime.gateway';

import type {
  CreateFuelLogSchema,
  CreateShuttleRouteSchema,
  CreateTripPaymentSchema,
  RecordGpsSchema,
  TmsFuelLogItem,
  TmsGpsItem,
  TmsMaintenanceItem,
  TmsPaymentItem,
  TmsShuttleRouteItem,
} from '@tungaos/shared';

@Injectable()
export class TmsOperationsService {
  constructor(
    private prisma: PrismaService,
    private realtime: TravelDeskRealtimeGateway,
  ) {}

  async listFuelLogs(hotelId: string): Promise<TmsFuelLogItem[]> {
    const rows = await this.prisma.fuelLog.findMany({
      where: { hotelId },
      include: { vehicle: { select: { name: true } } },
      orderBy: { fillDate: 'desc' },
      take: 100,
    });
    return rows.map((f) => ({
      id: f.id,
      vehicleName: f.vehicle.name,
      fillDate: f.fillDate.toISOString(),
      liters: Number(f.liters),
      cost: Number(f.cost),
      odometer: f.odometer,
      mileage: f.mileage ? Number(f.mileage) : null,
      stationName: f.stationName,
    }));
  }

  async createFuelLog(hotelId: string, dto: CreateFuelLogSchema, userId?: string) {
    const prev = await this.prisma.fuelLog.findFirst({
      where: { vehicleId: dto.vehicleId },
      orderBy: { fillDate: 'desc' },
    });
    let mileage: number | undefined;
    if (prev?.odometer && dto.odometer && dto.liters > 0) {
      mileage = (dto.odometer - prev.odometer) / Number(dto.liters);
    }
    return this.prisma.fuelLog.create({
      data: {
        hotelId,
        vehicleId: dto.vehicleId,
        fillDate: new Date(dto.fillDate),
        liters: dto.liters,
        cost: dto.cost,
        odometer: dto.odometer,
        mileage,
        stationName: dto.stationName,
        createdBy: userId,
      },
    });
  }

  async listMaintenance(hotelId: string): Promise<TmsMaintenanceItem[]> {
    const rows = await this.prisma.vehicleMaintenanceLog.findMany({
      where: { hotelId },
      include: { vehicle: { select: { name: true } } },
      orderBy: { scheduledDate: 'desc' },
      take: 100,
    });
    return rows.map((m) => ({
      id: m.id,
      vehicleName: m.vehicle.name,
      maintenanceType: m.maintenanceType,
      scheduledDate: m.scheduledDate.toISOString(),
      completedDate: m.completedDate?.toISOString() ?? null,
      cost: Number(m.cost),
      status: m.status,
    }));
  }

  async listPayments(hotelId: string): Promise<TmsPaymentItem[]> {
    const rows = await this.prisma.tripPayment.findMany({
      where: { hotelId },
      include: { trip: { select: { tripNumber: true, guestName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((p) => ({
      id: p.id,
      tripNumber: p.trip.tripNumber,
      guestName: p.trip.guestName,
      amount: Number(p.amount),
      paymentMethod: p.paymentMethod,
      paymentStatus: p.paymentStatus,
      paidAt: p.paidAt?.toISOString() ?? null,
    }));
  }

  async createPayment(hotelId: string, dto: CreateTripPaymentSchema) {
    const payment = await this.prisma.tripPayment.create({
      data: {
        hotelId,
        tripId: dto.tripId,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
        paymentStatus: 'PAID',
        paidAt: new Date(),
      },
    });
    await this.prisma.trip.update({
      where: { id: dto.tripId },
      data: { paymentStatus: dto.paymentMethod === 'ROOM_CHARGE' ? 'BILLED_TO_ROOM' : 'PAID' },
    });
    this.realtime.notifyDashboard(hotelId);
    return payment;
  }

  async listShuttleRoutes(hotelId: string): Promise<TmsShuttleRouteItem[]> {
    const rows = await this.prisma.shuttleRoute.findMany({
      where: { hotelId, isActive: true },
      include: { _count: { select: { schedules: true } } },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      stopCount: Array.isArray(r.stops) ? (r.stops as unknown[]).length : 0,
      scheduleCount: r._count.schedules,
    }));
  }

  async createShuttleRoute(hotelId: string, dto: CreateShuttleRouteSchema) {
    return this.prisma.shuttleRoute.create({
      data: {
        hotelId,
        name: dto.name,
        description: dto.description,
        stops: dto.stops,
      },
    });
  }

  async listGpsLogs(hotelId: string): Promise<TmsGpsItem[]> {
    const rows = await this.prisma.gpsLog.findMany({
      where: { hotelId },
      include: {
        vehicle: { select: { name: true } },
        driver: { select: { firstName: true, lastName: true } },
        trip: { select: { tripNumber: true } },
      },
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });
    return rows.map((g) => ({
      id: g.id,
      vehicleName: g.vehicle?.name ?? null,
      driverName: g.driver ? `${g.driver.firstName} ${g.driver.lastName}` : null,
      tripNumber: g.trip?.tripNumber ?? null,
      latitude: Number(g.latitude),
      longitude: Number(g.longitude),
      speed: g.speed ? Number(g.speed) : null,
      recordedAt: g.recordedAt.toISOString(),
    }));
  }

  async recordGps(hotelId: string, dto: RecordGpsSchema) {
    const log = await this.prisma.gpsLog.create({
      data: {
        hotelId,
        vehicleId: dto.vehicleId,
        driverId: dto.driverId,
        tripId: dto.tripId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        speed: dto.speed,
        heading: dto.heading,
        recordedAt: new Date(),
      },
    });
    if (dto.vehicleId) {
      this.realtime.emitVehicleLocation(hotelId, dto.vehicleId, dto.latitude, dto.longitude);
    }
    return log;
  }

  async getReport(hotelId: string, type: string) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    switch (type) {
      case 'trips':
        return this.prisma.trip.findMany({
          where: { hotelId, deletedAt: null, scheduledAt: { gte: monthStart } },
          select: { tripNumber: true, guestName: true, tripType: true, status: true, fare: true, scheduledAt: true },
          orderBy: { scheduledAt: 'desc' },
        });
      case 'vehicles':
        return this.prisma.vehicle.findMany({
          where: { hotelId, deletedAt: null },
          select: { name: true, vehicleNumber: true, vehicleType: true, status: true, currentOdometer: true },
        });
      case 'drivers':
        return this.prisma.driver.findMany({
          where: { hotelId, deletedAt: null },
          select: { driverCode: true, firstName: true, lastName: true, performanceScore: true, isOnDuty: true },
        });
      case 'fuel':
        return this.listFuelLogs(hotelId);
      case 'revenue':
        return this.listPayments(hotelId);
      default:
        return [];
    }
  }
}
