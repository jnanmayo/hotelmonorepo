import { Injectable } from '@nestjs/common';
import { TripStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  CreateTmsDriverSchema,
  CreateTmsVehicleSchema,
  CreateTravelVendorSchema,
  TmsDriverItem,
  TmsVehicleItem,
  TmsVendorItem,
} from '@tungaos/shared';

@Injectable()
export class TmsFleetService {
  constructor(private prisma: PrismaService) {}

  async listVehicles(hotelId: string): Promise<TmsVehicleItem[]> {
    const rows = await this.prisma.vehicle.findMany({
      where: { hotelId, deletedAt: null },
      include: { vendor: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
    return rows.map((v) => ({
      id: v.id,
      name: v.name,
      vehicleNumber: v.vehicleNumber,
      registrationNumber: v.registrationNumber,
      vehicleType: v.vehicleType,
      brand: v.brand,
      model: v.model,
      year: v.year,
      capacity: v.capacity,
      fuelType: v.fuelType,
      status: v.status,
      currentOdometer: v.currentOdometer,
      gpsDeviceId: v.gpsDeviceId,
      driverName: v.driverName,
      vendorName: v.vendor?.name ?? null,
    }));
  }

  async createVehicle(hotelId: string, dto: CreateTmsVehicleSchema, userId?: string) {
    return this.prisma.vehicle.create({
      data: {
        hotelId,
        name: dto.name,
        vehicleNumber: dto.vehicleNumber,
        registrationNumber: dto.registrationNumber,
        vehicleType: dto.vehicleType,
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        capacity: dto.capacity,
        fuelType: dto.fuelType,
        transmission: dto.transmission,
        color: dto.color,
        owner: dto.owner,
        currentOdometer: dto.currentOdometer,
        gpsDeviceId: dto.gpsDeviceId,
        vendorId: dto.vendorId,
        qrCode: `VEH-${dto.vehicleNumber}`,
        createdBy: userId,
      },
    });
  }

  async listDrivers(hotelId: string): Promise<TmsDriverItem[]> {
    const rows = await this.prisma.driver.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { firstName: 'asc' },
    });

    const activeTrips = await this.prisma.trip.findMany({
      where: {
        hotelId,
        driverId: { in: rows.map((d) => d.id) },
        status: {
          in: [
            TripStatus.DRIVER_ASSIGNED,
            TripStatus.DRIVER_EN_ROUTE,
            TripStatus.GUEST_PICKED,
            TripStatus.TRIP_STARTED,
          ],
        },
      },
      select: { driverId: true, tripNumber: true },
    });
    const tripMap = new Map(activeTrips.map((t) => [t.driverId, t.tripNumber]));

    return rows.map((d) => ({
      id: d.id,
      driverCode: d.driverCode,
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone,
      licenseNumber: d.licenseNumber,
      badgeNumber: d.badgeNumber,
      experienceYears: d.experienceYears,
      languages: d.languages,
      shift: d.shift,
      performanceScore: Number(d.performanceScore),
      isOnDuty: d.isOnDuty,
      currentVehicle: null,
      currentTrip: tripMap.get(d.id) ?? null,
    }));
  }

  async createDriver(hotelId: string, dto: CreateTmsDriverSchema, userId?: string) {
    const count = await this.prisma.driver.count({ where: { hotelId } });
    const driverCode = `DRV-${String(count + 1).padStart(4, '0')}`;
    return this.prisma.driver.create({
      data: {
        hotelId,
        driverCode,
        firstName: dto.firstName,
        lastName: dto.lastName,
        licenseNumber: dto.licenseNumber,
        phone: dto.phone,
        badgeNumber: dto.badgeNumber,
        experienceYears: dto.experienceYears,
        languages: dto.languages,
        email: dto.email,
        emergencyContact: dto.emergencyContact,
        emergencyPhone: dto.emergencyPhone,
        shift: dto.shift,
        createdBy: userId,
      },
    });
  }

  async toggleDriverDuty(hotelId: string, driverId: string, onDuty: boolean) {
    return this.prisma.driver.updateMany({
      where: { id: driverId, hotelId },
      data: { isOnDuty: onDuty },
    });
  }

  async listVendors(hotelId: string): Promise<TmsVendorItem[]> {
    const rows = await this.prisma.travelVendor.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return rows.map((v) => ({
      id: v.id,
      name: v.name,
      vendorType: v.vendorType,
      contactName: v.contactName,
      phone: v.phone,
      email: v.email,
      contractRate: v.contractRate ? Number(v.contractRate) : null,
      rating: Number(v.rating),
    }));
  }

  async createVendor(hotelId: string, dto: CreateTravelVendorSchema) {
    return this.prisma.travelVendor.create({
      data: {
        hotelId,
        name: dto.name,
        vendorType: dto.vendorType,
        contactName: dto.contactName,
        phone: dto.phone,
        email: dto.email,
        contractRate: dto.contractRate,
      },
    });
  }

  async seedDefaults(hotelId: string, userId?: string) {
    const vehicleCount = await this.prisma.vehicle.count({ where: { hotelId } });
    if (vehicleCount === 0) {
      const vehicles = [
        { name: 'Toyota Innova Crysta', vehicleNumber: 'MH-01-TD-001', vehicleType: 'SUV', capacity: 7, fuelType: 'Diesel' },
        { name: 'Mercedes E-Class', vehicleNumber: 'MH-01-TD-002', vehicleType: 'Luxury Sedan', capacity: 4, fuelType: 'Petrol' },
        { name: 'Tempo Traveller', vehicleNumber: 'MH-01-TD-003', vehicleType: 'Tempo Traveller', capacity: 12, fuelType: 'Diesel' },
        { name: 'Hotel Buggy 1', vehicleNumber: 'BUGGY-001', vehicleType: 'Hotel Buggy', capacity: 4, fuelType: 'Electric' },
      ];
      for (const v of vehicles) {
        await this.prisma.vehicle.create({
          data: { hotelId, ...v, qrCode: `VEH-${v.vehicleNumber}`, createdBy: userId },
        });
      }
    }

    const driverCount = await this.prisma.driver.count({ where: { hotelId } });
    if (driverCount === 0) {
      const drivers = [
        { firstName: 'Rajesh', lastName: 'Kumar', licenseNumber: 'MH-2019-1234567', phone: '+919876543210', shift: 'Morning', experienceYears: 8 },
        { firstName: 'Suresh', lastName: 'Patil', licenseNumber: 'MH-2020-7654321', phone: '+919876543211', shift: 'Evening', experienceYears: 5 },
        { firstName: 'Amit', lastName: 'Sharma', licenseNumber: 'MH-2018-9876543', phone: '+919876543212', shift: 'Night', experienceYears: 10 },
      ];
      for (let i = 0; i < drivers.length; i++) {
        const d = drivers[i]!;
        await this.prisma.driver.create({
          data: {
            hotelId,
            driverCode: `DRV-${String(i + 1).padStart(4, '0')}`,
            ...d,
            isOnDuty: i < 2,
            performanceScore: 4.2 + i * 0.2,
            languages: 'English, Hindi, Marathi',
            createdBy: userId,
          },
        });
      }
    }

    const vendorCount = await this.prisma.travelVendor.count({ where: { hotelId } });
    if (vendorCount === 0) {
      await this.prisma.travelVendor.createMany({
        data: [
          { hotelId, name: 'City Cabs Pvt Ltd', vendorType: 'Taxi Vendor', contactName: 'Manager', phone: '+912212345678', contractRate: 2500 },
          { hotelId, name: 'Premium Car Rentals', vendorType: 'Car Rental', contactName: 'Sales', phone: '+912298765432', contractRate: 4500 },
        ],
      });
    }

    return { seeded: true };
  }
}
