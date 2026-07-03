import { Injectable } from '@nestjs/common';
import { TripStatus, VehicleStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  TmsAnalyticsData,
  TmsDashboardStats,
  TmsDispatchStats,
  TmsOwnerDashboardStats,
  TmsTripItem,
} from '@tungaos/shared';

const ACTIVE_TRIP_STATUSES: TripStatus[] = [
  TripStatus.VEHICLE_ASSIGNED,
  TripStatus.DRIVER_ASSIGNED,
  TripStatus.DRIVER_EN_ROUTE,
  TripStatus.GUEST_PICKED,
  TripStatus.TRIP_STARTED,
];

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

@Injectable()
export class TmsDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<TmsDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const tripInclude = {
      vehicle: { select: { name: true } },
      driver: { select: { firstName: true, lastName: true } },
      airportDetail: { select: { flightNumber: true, airline: true } },
    } as const;

    const [
      todaysTrips,
      airportPickups,
      airportDrops,
      corporateTrips,
      vipTransfers,
      availableVehicles,
      vehiclesOnTrip,
      driversAvailable,
      driversOnDuty,
      pendingRequests,
      tripRevenue,
      fuelCost,
      maintenanceCost,
      totalVehicles,
      tripsThisMonth,
      driverAvg,
      liveTrips,
      pendingTrips,
    ] = await Promise.all([
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, scheduledAt: { gte: today, lt: tomorrow } },
      }),
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, tripType: 'AIRPORT_PICKUP', scheduledAt: { gte: today, lt: tomorrow } },
      }),
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, tripType: 'AIRPORT_DROP', scheduledAt: { gte: today, lt: tomorrow } },
      }),
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, tripType: 'CORPORATE', scheduledAt: { gte: today, lt: tomorrow } },
      }),
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, isVip: true, scheduledAt: { gte: today, lt: tomorrow } },
      }),
      this.prisma.vehicle.count({
        where: { hotelId, deletedAt: null, status: VehicleStatus.AVAILABLE },
      }),
      this.prisma.vehicle.count({
        where: { hotelId, deletedAt: null, status: { in: [VehicleStatus.ON_TRIP, VehicleStatus.IN_USE, VehicleStatus.RESERVED] } },
      }),
      this.prisma.driver.count({
        where: { hotelId, deletedAt: null, isOnDuty: true, isActive: true },
      }),
      this.prisma.driver.count({
        where: { hotelId, deletedAt: null, isOnDuty: true },
      }),
      this.prisma.travelDeskRequest.count({
        where: { hotelId, deletedAt: null, status: 'PENDING' },
      }),
      this.prisma.trip.aggregate({
        where: { hotelId, deletedAt: null, scheduledAt: { gte: today, lt: tomorrow }, status: TripStatus.TRIP_COMPLETED },
        _sum: { fare: true },
      }),
      this.prisma.fuelLog.aggregate({
        where: { hotelId, fillDate: { gte: monthStart } },
        _sum: { cost: true },
      }),
      this.prisma.vehicleMaintenanceLog.aggregate({
        where: { hotelId, scheduledDate: { gte: monthStart } },
        _sum: { cost: true },
      }),
      this.prisma.vehicle.count({ where: { hotelId, deletedAt: null, isActive: true } }),
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, scheduledAt: { gte: monthStart }, status: TripStatus.TRIP_COMPLETED },
      }),
      this.prisma.driver.aggregate({
        where: { hotelId, deletedAt: null, isActive: true },
        _avg: { performanceScore: true },
      }),
      this.prisma.trip.findMany({
        where: { hotelId, deletedAt: null, status: { in: ACTIVE_TRIP_STATUSES } },
        include: tripInclude,
        orderBy: { scheduledAt: 'asc' },
        take: 10,
      }),
      this.prisma.trip.findMany({
        where: { hotelId, deletedAt: null, status: { in: [TripStatus.REQUESTED, TripStatus.APPROVED] } },
        include: tripInclude,
        orderBy: { scheduledAt: 'asc' },
        take: 10,
      }),
    ]);

    const vehicleUtilizationPct = totalVehicles > 0
      ? Math.round((tripsThisMonth / (totalVehicles * 30)) * 100)
      : 0;

    return {
      todaysTrips,
      airportPickups,
      airportDrops,
      corporateTrips,
      vipTransfers,
      availableVehicles,
      vehiclesOnTrip,
      driversAvailable,
      driversOnDuty,
      pendingRequests,
      tripRevenue: Number(tripRevenue._sum.fare ?? 0),
      fuelCost: Number(fuelCost._sum.cost ?? 0),
      maintenanceCost: Number(maintenanceCost._sum.cost ?? 0),
      vehicleUtilizationPct: Math.min(vehicleUtilizationPct, 100),
      driverPerformanceAvg: Number(driverAvg._avg.performanceScore ?? 0),
      liveTrips: liveTrips.map(mapTrip),
      pendingTrips: pendingTrips.map(mapTrip),
    };
  }

  async getOwnerDashboard(hotelId: string): Promise<TmsOwnerDashboardStats> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [revenue, tripCount, fuel, maintenance, driverAvg, topVehicle, corpRevenue, byType] = await Promise.all([
      this.prisma.trip.aggregate({
        where: { hotelId, deletedAt: null, status: TripStatus.TRIP_COMPLETED, completedAt: { gte: monthStart } },
        _sum: { fare: true },
      }),
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, completedAt: { gte: monthStart } },
      }),
      this.prisma.fuelLog.aggregate({ where: { hotelId, fillDate: { gte: monthStart } }, _sum: { cost: true } }),
      this.prisma.vehicleMaintenanceLog.aggregate({ where: { hotelId, scheduledDate: { gte: monthStart } }, _sum: { cost: true } }),
      this.prisma.driver.aggregate({ where: { hotelId, isActive: true }, _avg: { performanceScore: true } }),
      this.prisma.trip.groupBy({
        by: ['vehicleId'],
        where: { hotelId, deletedAt: null, vehicleId: { not: null }, completedAt: { gte: monthStart } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
      }),
      this.prisma.trip.aggregate({
        where: { hotelId, deletedAt: null, tripType: 'CORPORATE', status: TripStatus.TRIP_COMPLETED, completedAt: { gte: monthStart } },
        _sum: { fare: true },
      }),
      this.prisma.trip.groupBy({
        by: ['tripType'],
        where: { hotelId, deletedAt: null, status: TripStatus.TRIP_COMPLETED, completedAt: { gte: monthStart } },
        _sum: { fare: true },
        _count: { id: true },
      }),
    ]);

    let mostUsedVehicle: TmsOwnerDashboardStats['mostUsedVehicle'] = null;
    if (topVehicle[0]?.vehicleId) {
      const v = await this.prisma.vehicle.findUnique({ where: { id: topVehicle[0].vehicleId }, select: { name: true } });
      if (v) mostUsedVehicle = { name: v.name, tripCount: topVehicle[0]._count.id };
    }

    const totalVehicles = await this.prisma.vehicle.count({ where: { hotelId, isActive: true } });
    const utilization = totalVehicles > 0 ? Math.round((tripCount / (totalVehicles * 30)) * 100) : 0;

    return {
      transportRevenue: Number(revenue._sum.fare ?? 0),
      tripCount,
      vehicleUtilizationPct: Math.min(utilization, 100),
      fuelCost: Number(fuel._sum.cost ?? 0),
      maintenanceCost: Number(maintenance._sum.cost ?? 0),
      driverPerformanceAvg: Number(driverAvg._avg.performanceScore ?? 0),
      mostUsedVehicle,
      corporateTransportRevenue: Number(corpRevenue._sum.fare ?? 0),
      revenueByType: byType.map((r) => ({ type: r.tripType, amount: Number(r._sum.fare ?? 0) })),
    };
  }

  async getDispatch(hotelId: string): Promise<TmsDispatchStats> {
    const now = new Date();
    const delayedThreshold = new Date(now.getTime() - 15 * 60 * 1000);

    const tripInclude = {
      vehicle: { select: { name: true } },
      driver: { select: { firstName: true, lastName: true } },
      airportDetail: { select: { flightNumber: true, airline: true } },
    } as const;

    const [pendingTrips, availableDrivers, availableVehicles, liveTrips, emergencyTrips, delayedTrips, trips] = await Promise.all([
      this.prisma.trip.count({
        where: { hotelId, deletedAt: null, status: { in: [TripStatus.REQUESTED, TripStatus.APPROVED] } },
      }),
      this.prisma.driver.count({ where: { hotelId, deletedAt: null, isOnDuty: true, isActive: true } }),
      this.prisma.vehicle.count({ where: { hotelId, deletedAt: null, status: VehicleStatus.AVAILABLE } }),
      this.prisma.trip.count({ where: { hotelId, deletedAt: null, status: { in: ACTIVE_TRIP_STATUSES } } }),
      this.prisma.trip.count({ where: { hotelId, deletedAt: null, isEmergency: true, status: { not: TripStatus.TRIP_COMPLETED } } }),
      this.prisma.trip.count({
        where: {
          hotelId,
          deletedAt: null,
          status: { in: [TripStatus.REQUESTED, TripStatus.APPROVED, TripStatus.VEHICLE_ASSIGNED] },
          scheduledAt: { lt: delayedThreshold },
        },
      }),
      this.prisma.trip.findMany({
        where: { hotelId, deletedAt: null, status: { notIn: [TripStatus.TRIP_COMPLETED, TripStatus.CANCELLED] } },
        include: tripInclude,
        orderBy: [{ isEmergency: 'desc' }, { scheduledAt: 'asc' }],
        take: 50,
      }),
    ]);

    return {
      pendingTrips,
      availableDrivers,
      availableVehicles,
      liveTrips,
      emergencyTrips,
      delayedTrips,
      trips: trips.map(mapTrip),
    };
  }

  async getAnalytics(hotelId: string): Promise<TmsAnalyticsData> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const trips = await this.prisma.trip.findMany({
      where: { hotelId, deletedAt: null, scheduledAt: { gte: monthStart } },
      select: { scheduledAt: true, fare: true, tripType: true, vehicleId: true, driverId: true, status: true },
    });

    const byDate = new Map<string, { count: number; revenue: number }>();
    for (const t of trips) {
      const key = t.scheduledAt.toISOString().slice(0, 10);
      const cur = byDate.get(key) ?? { count: 0, revenue: 0 };
      cur.count += 1;
      if (t.status === TripStatus.TRIP_COMPLETED) cur.revenue += Number(t.fare);
      byDate.set(key, cur);
    }

    const vehicleGroups = await this.prisma.trip.groupBy({
      by: ['vehicleId'],
      where: { hotelId, deletedAt: null, vehicleId: { not: null }, scheduledAt: { gte: monthStart } },
      _count: { id: true },
    });

    const vehicleNames = await this.prisma.vehicle.findMany({
      where: { hotelId, id: { in: vehicleGroups.map((v) => v.vehicleId!).filter(Boolean) } },
      select: { id: true, name: true },
    });
    const nameMap = new Map(vehicleNames.map((v) => [v.id, v.name]));

    const driverGroups = await this.prisma.driver.findMany({
      where: { hotelId, isActive: true },
      select: { id: true, firstName: true, lastName: true, performanceScore: true },
    });

    const driverTrips = await this.prisma.trip.groupBy({
      by: ['driverId'],
      where: { hotelId, driverId: { not: null }, scheduledAt: { gte: monthStart } },
      _count: { id: true },
    });
    const driverTripMap = new Map(driverTrips.map((d) => [d.driverId, d._count.id]));

    const fuelLogs = await this.prisma.fuelLog.findMany({
      where: { hotelId, fillDate: { gte: monthStart } },
      select: { fillDate: true, liters: true, cost: true },
    });
    const fuelByMonth = new Map<string, { liters: number; cost: number }>();
    for (const f of fuelLogs) {
      const key = f.fillDate.toISOString().slice(0, 7);
      const cur = fuelByMonth.get(key) ?? { liters: 0, cost: 0 };
      cur.liters += Number(f.liters);
      cur.cost += Number(f.cost);
      fuelByMonth.set(key, cur);
    }

    const airportAnalysis = await this.prisma.trip.groupBy({
      by: ['tripType'],
      where: {
        hotelId,
        tripType: { in: ['AIRPORT_PICKUP', 'AIRPORT_DROP'] },
        scheduledAt: { gte: monthStart },
      },
      _count: { id: true },
      _sum: { fare: true },
    });

    return {
      tripAnalysis: [...byDate.entries()].map(([date, v]) => ({ date, count: v.count, revenue: v.revenue })),
      vehicleUtilization: vehicleGroups.map((v) => ({
        vehicle: nameMap.get(v.vehicleId!) ?? 'Unknown',
        trips: v._count.id,
        utilizationPct: Math.min(Math.round((v._count.id / 30) * 100), 100),
      })),
      driverPerformance: driverGroups.map((d) => ({
        driver: `${d.firstName} ${d.lastName}`,
        score: Number(d.performanceScore),
        trips: driverTripMap.get(d.id) ?? 0,
      })),
      fuelConsumption: [...fuelByMonth.entries()].map(([month, v]) => ({ month, liters: v.liters, cost: v.cost })),
      airportAnalysis: airportAnalysis.map((a) => ({
        type: a.tripType,
        count: a._count.id,
        revenue: Number(a._sum.fare ?? 0),
      })),
      corporateUsage: [],
    };
  }
}
