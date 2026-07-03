/**
 * TungaOS Front Desk — Shared types
 */

export interface FrontDeskDashboardStats {
  todayArrivals: number;
  todayDepartures: number;
  currentCheckIns: number;
  pendingCheckIns: number;
  pendingCheckOuts: number;
  walkInGuests: number;
  availableRooms: number;
  occupiedRooms: number;
  dirtyRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  vipGuests: number;
  corporateGuests: number;
  pendingPayments: number;
  todayRevenue: number;
  restaurantCharges: number;
  laundryCharges: number;
  airportPickups: number;
  lateCheckouts: number;
  earlyCheckIns: number;
  openComplaints: number;
  unreadMessages: number;
}

export interface ArrivalBoardRow {
  id: string;
  reservationCode: string;
  guestName: string;
  arrivalTime: string;
  roomTypeName: string;
  assignedRoom: string | null;
  roomId: string | null;
  isVip: boolean;
  isCorporate: boolean;
  paymentStatus: string;
  checkInStatus: string;
  balanceAmount: number;
  guestId: string;
}

export interface DepartureBoardRow {
  id: string;
  reservationCode: string;
  guestName: string;
  roomNumber: string | null;
  checkoutTime: string;
  outstandingBalance: number;
  restaurantCharges: number;
  laundryCharges: number;
  miniBarCharges: number;
  paymentStatus: string;
  invoiceStatus: string;
  guestId: string;
}

export interface RoomAssignmentOption {
  id: string;
  roomNumber: string;
  roomTypeName: string;
  floorName: string;
  floorNumber: number;
  viewType: string | null;
  status: string;
  isAccessible: boolean;
  isSmoking: boolean;
  score: number;
  currentGuest: string | null;
}

export interface GuestFolioView {
  reservationId: string;
  reservationCode: string;
  guestName: string;
  roomNumber: string | null;
  charges: FolioLine[];
  payments: FolioPayment[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingBalance: number;
}

export interface FolioLine {
  id: string;
  category: string;
  description: string;
  amount: number;
  postedAt: string;
}

export interface FolioPayment {
  id: string;
  method: string;
  amount: number;
  paidAt: string | null;
  status: string;
}

export interface FrontDeskPerformanceStats {
  avgCheckInMinutes: number;
  avgCheckoutMinutes: number;
  guestSatisfaction: number;
  openComplaints: number;
  upgradeRevenue: number;
  lateCheckoutRevenue: number;
}

export interface FrontDeskSearchResult {
  type: 'guest' | 'reservation' | 'room' | 'invoice';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface WalkInInput {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  roomTypeId: string;
  roomId?: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomRate: number;
  paymentMethod: string;
  paymentAmount: number;
}

export interface AssignRoomInput {
  reservationId: string;
  roomId: string;
  transferType?: 'ASSIGN' | 'UPGRADE' | 'DOWNGRADE' | 'CHANGE';
  reason?: string;
}

export interface CollectPaymentInput {
  reservationId: string;
  amount: number;
  method: string;
  paymentType: 'ADVANCE' | 'BALANCE' | 'DEPOSIT' | 'SECURITY_DEPOSIT' | 'REFUND';
  notes?: string;
  splitPayments?: { method: string; amount: number }[];
}

export interface SendCommunicationInput {
  guestId: string;
  reservationId?: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'SMS';
  messageType: string;
  recipient: string;
  subject?: string;
  body: string;
}

export interface FrontDeskRealtimeEvent {
  type:
    | 'arrival:update'
    | 'departure:update'
    | 'room:assigned'
    | 'checkin:complete'
    | 'checkout:complete'
    | 'dashboard:update'
    | 'complaint:new'
    | 'notification:new';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
