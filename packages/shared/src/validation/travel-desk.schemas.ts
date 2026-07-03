import { z } from 'zod';

export const createTmsTripSchema = z.object({
  guestName: z.string().min(1).max(255),
  guestPhone: z.string().max(30).optional(),
  guestId: z.string().uuid().optional(),
  reservationId: z.string().uuid().optional(),
  bookingId: z.string().max(50).optional(),
  tripType: z.string().min(1).max(50),
  requestSource: z.string().max(50).default('TRAVEL_DESK'),
  pickupLocation: z.string().min(1).max(500),
  dropLocation: z.string().min(1).max(500),
  scheduledAt: z.string().datetime(),
  fare: z.coerce.number().min(0).default(0),
  specialInstructions: z.string().optional(),
  isVip: z.boolean().default(false),
  isEmergency: z.boolean().default(false),
  corporateCompanyId: z.string().uuid().optional(),
  flightNumber: z.string().max(20).optional(),
  airline: z.string().max(100).optional(),
  terminal: z.string().max(50).optional(),
  transferType: z.enum(['arrival', 'departure']).optional(),
});

export type CreateTmsTripSchema = z.infer<typeof createTmsTripSchema>;

export const assignTmsTripSchema = z.object({
  vehicleId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
});

export type AssignTmsTripSchema = z.infer<typeof assignTmsTripSchema>;

export const updateTmsTripStatusSchema = z.object({
  status: z.enum([
    'REQUESTED', 'APPROVED', 'VEHICLE_ASSIGNED', 'DRIVER_ASSIGNED',
    'DRIVER_EN_ROUTE', 'GUEST_PICKED', 'TRIP_STARTED', 'TRIP_COMPLETED', 'CANCELLED',
  ]),
});

export type UpdateTmsTripStatusSchema = z.infer<typeof updateTmsTripStatusSchema>;

export const createTmsVehicleSchema = z.object({
  name: z.string().min(1).max(100),
  vehicleNumber: z.string().min(1).max(30),
  registrationNumber: z.string().max(30).optional(),
  vehicleType: z.string().min(1).max(50),
  brand: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  year: z.coerce.number().int().min(1990).max(2100).optional(),
  capacity: z.coerce.number().int().min(1).default(4),
  fuelType: z.string().max(30).optional(),
  transmission: z.string().max(30).optional(),
  color: z.string().max(30).optional(),
  owner: z.string().max(100).optional(),
  currentOdometer: z.coerce.number().int().min(0).optional(),
  gpsDeviceId: z.string().max(100).optional(),
  vendorId: z.string().uuid().optional(),
});

export type CreateTmsVehicleSchema = z.infer<typeof createTmsVehicleSchema>;

export const createTmsDriverSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  licenseNumber: z.string().min(1).max(50),
  phone: z.string().min(1).max(30),
  badgeNumber: z.string().max(30).optional(),
  experienceYears: z.coerce.number().int().min(0).default(0),
  languages: z.string().max(255).optional(),
  email: z.string().email().optional(),
  emergencyContact: z.string().max(100).optional(),
  emergencyPhone: z.string().max(30).optional(),
  shift: z.string().max(50).optional(),
});

export type CreateTmsDriverSchema = z.infer<typeof createTmsDriverSchema>;

export const createFuelLogSchema = z.object({
  vehicleId: z.string().uuid(),
  fillDate: z.string().datetime(),
  liters: z.coerce.number().min(0),
  cost: z.coerce.number().min(0),
  odometer: z.coerce.number().int().min(0).optional(),
  stationName: z.string().max(255).optional(),
});

export type CreateFuelLogSchema = z.infer<typeof createFuelLogSchema>;

export const createTravelVendorSchema = z.object({
  name: z.string().min(1).max(255),
  vendorType: z.string().min(1).max(50),
  contactName: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  contractRate: z.coerce.number().min(0).optional(),
});

export type CreateTravelVendorSchema = z.infer<typeof createTravelVendorSchema>;

export const createTravelRequestSchema = z.object({
  requestType: z.string().min(1).max(50),
  description: z.string().optional(),
  fromLocation: z.string().max(255).optional(),
  toLocation: z.string().max(255).optional(),
  scheduledAt: z.string().datetime().optional(),
  amount: z.coerce.number().min(0).default(0),
  guestId: z.string().uuid().optional(),
});

export type CreateTravelRequestSchema = z.infer<typeof createTravelRequestSchema>;

export const createTripPaymentSchema = z.object({
  tripId: z.string().uuid(),
  amount: z.coerce.number().min(0),
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'ROOM_CHARGE', 'CORPORATE_CREDIT', 'INVOICE']),
});

export type CreateTripPaymentSchema = z.infer<typeof createTripPaymentSchema>;

export const createShuttleRouteSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  stops: z.array(z.object({ name: z.string(), lat: z.number().optional(), lng: z.number().optional() })).default([]),
});

export type CreateShuttleRouteSchema = z.infer<typeof createShuttleRouteSchema>;

export const recordGpsSchema = z.object({
  vehicleId: z.string().uuid().optional(),
  driverId: z.string().uuid().optional(),
  tripId: z.string().uuid().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  speed: z.coerce.number().optional(),
  heading: z.coerce.number().optional(),
});

export type RecordGpsSchema = z.infer<typeof recordGpsSchema>;
