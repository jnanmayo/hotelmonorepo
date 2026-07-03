/**
 * TungaOS PMS — Shared types for Property Management System
 */

export type PmsReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'GUARANTEED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'ON_HOLD'
  | 'WAITLISTED';

export type PmsRoomStatus =
  | 'VACANT_CLEAN'
  | 'VACANT_DIRTY'
  | 'VACANT'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'DIRTY'
  | 'CLEANING'
  | 'INSPECTED'
  | 'OUT_OF_ORDER'
  | 'OUT_OF_SERVICE'
  | 'UNDER_MAINTENANCE'
  | 'BLOCKED';

export type PmsBookingSource =
  | 'DIRECT_WEBSITE'
  | 'WALK_IN'
  | 'PHONE'
  | 'EMAIL'
  | 'OTA_BOOKING_COM'
  | 'OTA_EXPEDIA'
  | 'OTA_AGODA'
  | 'OTA_MMT'
  | 'CORPORATE_PORTAL'
  | 'TRAVEL_AGENT'
  | 'GDS'
  | 'CHANNEL_MANAGER'
  | 'OTHER';

export interface PmsDashboardStats {
  todayArrivals: number;
  todayDepartures: number;
  currentOccupancy: number;
  occupancyPct: number;
  availableRooms: number;
  dirtyRooms: number;
  cleaningRooms: number;
  underMaintenance: number;
  blockedRooms: number;
  vipGuests: number;
  corporateGuests: number;
  pendingPayments: number;
  pendingCheckIns: number;
  pendingCheckOuts: number;
  revenueToday: number;
  restaurantRevenue: number;
  roomRevenue: number;
  totalRooms: number;
}

export interface OwnerDashboardStats {
  adr: number;
  revPar: number;
  occupancy: number;
  averageStay: number;
  revenue: number;
  guestSatisfaction: number;
  corporateRevenue: number;
  otaRevenue: number;
  directBookingPct: number;
}

export interface PmsGuestProfile {
  id: string;
  guestCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  photoUrl: string | null;
  companyName: string | null;
  gstNumber: string | null;
  vipStatus: boolean;
  isCorporate: boolean;
  isBlacklisted: boolean;
  membershipTier: string | null;
  preferences: Record<string, unknown> | null;
  foodPreferences: Record<string, unknown> | null;
  previousStays: number;
  previousRooms: string[];
  documents: PmsGuestDocument[];
  reservations: PmsReservationSummary[];
}

export interface PmsGuestDocument {
  id: string;
  docType: string;
  docNumber: string | null;
  expiryDate: string | null;
  createdAt: string;
}

export interface PmsReservationSummary {
  id: string;
  reservationCode: string;
  status: PmsReservationStatus;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string | null;
  totalAmount: number;
}

export interface PmsReservationDetail extends PmsReservationSummary {
  source: PmsBookingSource;
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    vipStatus: boolean;
  };
  roomType: { id: string; name: string; code: string };
  room: { id: string; roomNumber: string; status: PmsRoomStatus } | null;
  adults: number;
  children: number;
  roomRate: number;
  taxAmount: number;
  discountAmount: number;
  paidAmount: number;
  balanceAmount: number;
  specialRequests: string | null;
  internalNotes: string | null;
  isGuaranteed: boolean;
  history: PmsReservationHistoryEntry[];
  timeline: PmsTimelineEntry[];
}

export interface PmsReservationHistoryEntry {
  id: string;
  fromStatus: PmsReservationStatus | null;
  toStatus: PmsReservationStatus;
  changeReason: string | null;
  createdAt: string;
}

export interface PmsTimelineEntry {
  id: string;
  eventType: string;
  description: string | null;
  createdAt: string;
  metadata: Record<string, unknown> | null;
}

export interface PmsRoom {
  id: string;
  roomNumber: string;
  status: PmsRoomStatus;
  category: string;
  isSmoking: boolean;
  isAccessible: boolean;
  floor: { id: string; name: string; floorNumber: number };
  building: { id: string; name: string; code: string };
  roomType: { id: string; name: string; code: string };
  currentGuest: string | null;
  currentReservationId: string | null;
}

export interface PmsCalendarDay {
  date: string;
  totalRooms: number;
  occupied: number;
  available: number;
  blocked: number;
  maintenance: number;
  occupancyPct: number;
  reservations: PmsCalendarReservation[];
}

export interface PmsCalendarReservation {
  id: string;
  reservationCode: string;
  guestName: string;
  roomNumber: string | null;
  roomTypeName: string;
  status: PmsReservationStatus;
  checkInDate: string;
  checkOutDate: string;
}

export interface CheckInWorkflow {
  id: string;
  reservationId: string;
  currentStep: string;
  keyCardIssued: boolean;
  registrationCard: {
    passportScanUrl: string | null;
    aadhaarScanUrl: string | null;
    signatureUrl: string | null;
    photoUrl: string | null;
  } | null;
  reservation: PmsReservationDetail;
}

export interface CheckOutWorkflow {
  reservation: PmsReservationDetail;
  folioCharges: PmsFolioCharge[];
  checkOutRecord: {
    roomCharges: number;
    restaurantCharges: number;
    laundryCharges: number;
    miniBarCharges: number;
    spaCharges: number;
    taxAmount: number;
    discountAmount: number;
    loyaltyRedemption: number;
    totalAmount: number;
  } | null;
  payments: PmsPayment[];
  invoice: PmsInvoice | null;
}

export interface PmsFolioCharge {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  totalAmount: number;
  postedAt: string;
}

export interface PmsPayment {
  id: string;
  paymentNumber: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string | null;
}

export interface PmsInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  lineItems: PmsInvoiceLineItem[];
  issuedAt: string | null;
}

export interface PmsInvoiceLineItem {
  id: string;
  description: string;
  hsnSac: string | null;
  quantity: number;
  unitPrice: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface PmsSearchResult {
  type: 'guest' | 'reservation' | 'room' | 'invoice';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface PmsReportSummary {
  reportType: string;
  generatedAt: string;
  data: Record<string, unknown>;
}

export interface NightAuditSummary {
  id: string;
  auditDate: string;
  status: string;
  roomRevenue: number;
  restaurantRevenue: number;
  totalRevenue: number;
  occupancyPct: number;
  adr: number;
  revPar: number;
  cashReconciliation: number;
  openFolios: number;
  pendingCheckouts: number;
}

export interface CreatePmsReservationInput {
  guestId?: string;
  guest?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    nationality?: string;
    companyName?: string;
  };
  roomTypeId: string;
  roomId?: string;
  source: PmsBookingSource;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children?: number;
  roomRate: number;
  specialRequests?: string;
  corporateBookingId?: string;
  groupBookingId?: string;
  travelAgentId?: string;
  isGuaranteed?: boolean;
}

export interface PmsRealtimeEvent {
  type: 'room:status' | 'reservation:update' | 'occupancy:update' | 'dashboard:update';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
