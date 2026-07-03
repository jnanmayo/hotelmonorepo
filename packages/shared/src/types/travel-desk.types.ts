/**
 * TungaOS Enterprise Travel Desk & Fleet Management (TMS) — Shared types
 */

export const TMS_WORKFLOW_MERMAID = `flowchart TD
  A[Guest Booking] --> B[Pickup Request]
  B --> C[Travel Desk]
  C --> D[Vehicle Allocation]
  D --> E[Driver Assignment]
  E --> F[Trip Started]
  F --> G[GPS Tracking]
  G --> H[Guest Pickup]
  H --> I[Drop Completed]
  I --> J[Billing]
  J --> K[Feedback]
  K --> L[Trip Closed]`;

export const VEHICLE_TYPES = [
  'Sedan', 'SUV', 'Luxury Sedan', 'Luxury SUV', 'Tempo Traveller',
  'Mini Bus', 'Bus', 'Electric Vehicle', 'Hotel Buggy', 'Custom Vehicle',
] as const;

export const TRIP_TYPES = [
  'AIRPORT_PICKUP', 'AIRPORT_DROP', 'RAILWAY', 'BUS_STATION', 'LOCAL_TAXI',
  'CORPORATE', 'VIP', 'HOTEL_SHUTTLE', 'TOUR', 'EMERGENCY',
] as const;

export interface TmsDashboardStats {
  todaysTrips: number;
  airportPickups: number;
  airportDrops: number;
  corporateTrips: number;
  vipTransfers: number;
  availableVehicles: number;
  vehiclesOnTrip: number;
  driversAvailable: number;
  driversOnDuty: number;
  pendingRequests: number;
  tripRevenue: number;
  fuelCost: number;
  maintenanceCost: number;
  vehicleUtilizationPct: number;
  driverPerformanceAvg: number;
  liveTrips: TmsTripItem[];
  pendingTrips: TmsTripItem[];
}

export interface TmsOwnerDashboardStats {
  transportRevenue: number;
  tripCount: number;
  vehicleUtilizationPct: number;
  fuelCost: number;
  maintenanceCost: number;
  driverPerformanceAvg: number;
  mostUsedVehicle: { name: string; tripCount: number } | null;
  corporateTransportRevenue: number;
  revenueByType: { type: string; amount: number }[];
}

export interface TmsDispatchStats {
  pendingTrips: number;
  availableDrivers: number;
  availableVehicles: number;
  liveTrips: number;
  emergencyTrips: number;
  delayedTrips: number;
  trips: TmsTripItem[];
}

export interface TmsAnalyticsData {
  tripAnalysis: { date: string; count: number; revenue: number }[];
  vehicleUtilization: { vehicle: string; trips: number; utilizationPct: number }[];
  driverPerformance: { driver: string; score: number; trips: number }[];
  fuelConsumption: { month: string; liters: number; cost: number }[];
  airportAnalysis: { type: string; count: number; revenue: number }[];
  corporateUsage: { company: string; trips: number; revenue: number }[];
}

export interface TmsTripItem {
  id: string;
  tripNumber: string;
  guestName: string;
  guestPhone: string | null;
  tripType: string;
  requestSource: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleName: string | null;
  driverName: string | null;
  scheduledAt: string;
  status: string;
  fare: number;
  paymentStatus: string;
  isVip: boolean;
  isEmergency: boolean;
  specialInstructions: string | null;
  flightNumber?: string | null;
  airline?: string | null;
}

export interface TmsRequestItem {
  id: string;
  requestType: string;
  status: string;
  description: string | null;
  fromLocation: string | null;
  toLocation: string | null;
  scheduledAt: string | null;
  amount: number;
  createdAt: string;
}

export interface TmsVehicleItem {
  id: string;
  name: string;
  vehicleNumber: string;
  registrationNumber: string | null;
  vehicleType: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  capacity: number;
  fuelType: string | null;
  status: string;
  currentOdometer: number | null;
  gpsDeviceId: string | null;
  driverName: string | null;
  vendorName: string | null;
}

export interface TmsDriverItem {
  id: string;
  driverCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  badgeNumber: string | null;
  experienceYears: number;
  languages: string | null;
  shift: string | null;
  performanceScore: number;
  isOnDuty: boolean;
  currentVehicle: string | null;
  currentTrip: string | null;
}

export interface TmsVendorItem {
  id: string;
  name: string;
  vendorType: string;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  contractRate: number | null;
  rating: number;
}

export interface TmsFuelLogItem {
  id: string;
  vehicleName: string;
  fillDate: string;
  liters: number;
  cost: number;
  odometer: number | null;
  mileage: number | null;
  stationName: string | null;
}

export interface TmsMaintenanceItem {
  id: string;
  vehicleName: string;
  maintenanceType: string;
  scheduledDate: string;
  completedDate: string | null;
  cost: number;
  status: string;
}

export interface TmsShuttleRouteItem {
  id: string;
  name: string;
  description: string | null;
  stopCount: number;
  scheduleCount: number;
}

export interface TmsGpsItem {
  id: string;
  vehicleName: string | null;
  driverName: string | null;
  tripNumber: string | null;
  latitude: number;
  longitude: number;
  speed: number | null;
  recordedAt: string;
}

export interface TmsPaymentItem {
  id: string;
  tripNumber: string;
  guestName: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string | null;
}

export interface TmsCalendarDay {
  date: string;
  trips: number;
  vehicles: number;
  drivers: number;
}

export type TmsRealtimeEvent =
  | { type: 'dashboard:update'; hotelId: string; payload: Record<string, unknown>; timestamp: string }
  | { type: 'trip:update'; hotelId: string; payload: { tripId: string }; timestamp: string }
  | { type: 'dispatch:update'; hotelId: string; payload: Record<string, unknown>; timestamp: string }
  | { type: 'vehicle:location'; hotelId: string; payload: { vehicleId: string; lat: number; lng: number }; timestamp: string }
  | { type: 'driver:assigned'; hotelId: string; payload: { tripId: string; driverId: string }; timestamp: string };
