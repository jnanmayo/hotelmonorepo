/**
 * TungaOS Guest Experience Platform — Shared types
 */

export type GxpRequestCategory =
  | 'ROOM_SERVICE'
  | 'HOUSEKEEPING'
  | 'LAUNDRY'
  | 'MAINTENANCE'
  | 'SPA'
  | 'TRANSPORT'
  | 'WAKE_UP'
  | 'CONCIERGE'
  | 'OTHER';

export type GxpRequestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type GxpChatDepartment = 'RECEPTION' | 'RESTAURANT' | 'HOUSEKEEPING' | 'MAINTENANCE' | 'MANAGER';

export interface GxpSessionContext {
  sessionToken: string;
  hotelId: string;
  hotelName: string;
  reservationId: string;
  reservationCode: string;
  guestId: string;
  guestName: string;
  roomId: string | null;
  roomNumber: string | null;
  roomType: string | null;
  checkInDate: string;
  checkOutDate: string;
  nightsRemaining: number;
  expiresAt: string;
}

export interface GxpDashboardData {
  guestName: string;
  roomNumber: string | null;
  roomType: string | null;
  stayDuration: string;
  nightsRemaining: number;
  currentBill: number;
  outstandingBalance: number;
  quickActions: { id: string; label: string; icon: string; href: string }[];
  offers: GxpOfferItem[];
  announcements: GxpAnnouncementItem[];
  weather: { temp: number; condition: string; icon: string };
  hotelPhone: string | null;
}

export interface GxpOfferItem {
  id: string;
  title: string;
  description: string | null;
  offerType: string;
  discountPct: number | null;
  imageUrl: string | null;
}

export interface GxpAnnouncementItem {
  id: string;
  title: string;
  body: string;
  priority: string;
}

export interface GxpRoomDetails {
  roomNumber: string;
  roomType: string;
  floor: string | null;
  amenities: string[];
  wifiPassword: string;
  images: string[];
  features: string[];
  emergencyNumbers: { label: string; number: string }[];
}

export interface GxpRequestItem {
  id: string;
  category: GxpRequestCategory;
  subType: string;
  status: GxpRequestStatus;
  description: string | null;
  scheduledAt: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface GxpFolioView {
  reservationCode: string;
  guestName: string;
  roomNumber: string | null;
  charges: { id: string; category: string; description: string; amount: number; postedAt: string }[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingBalance: number;
}

export interface GxpChatMessageItem {
  id: string;
  department: GxpChatDepartment;
  senderType: 'GUEST' | 'STAFF';
  senderName: string | null;
  message: string;
  createdAt: string;
  readAt: string | null;
}

export interface GxpMenuCategory {
  name: string;
  items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    prepTimeMins: number | null;
    itemType: string;
    isAvailable: boolean;
  }[];
}

export interface GxpQrCodeItem {
  id: string;
  roomId: string;
  roomNumber: string;
  token: string;
  qrData: string;
  scanCount: number;
  portalUrl: string;
}

export interface GxpAdminDashboardStats {
  activeSessions: number;
  pendingRequests: number;
  todayRequests: number;
  avgResponseMinutes: number;
  guestSatisfaction: number;
  topServices: { service: string; count: number }[];
  foodOrdersToday: number;
  chatMessagesToday: number;
}

export interface GxpRealtimeEvent {
  type:
    | 'request:created'
    | 'request:updated'
    | 'order:updated'
    | 'chat:message'
    | 'notification:new'
    | 'checkout:ready';
  hotelId: string;
  reservationId?: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export const GXP_FLOW_MERMAID = `flowchart TD
  A[Guest] --> B[Scans QR Code]
  B --> C[Guest Portal Opens]
  C --> D[Room Automatically Identified]
  D --> E[Guest Dashboard]
  E --> F[Select Service]
  F --> G[Request Submitted]
  G --> H[Department Notified]
  H --> I[Task Completed]
  I --> J[Guest Receives Notification]`;

export const GXP_FOOD_FLOW_MERMAID = `flowchart TD
  A[Guest] --> B[Select Food]
  B --> C[Customize]
  C --> D[Add To Cart]
  D --> E[Place Order]
  E --> F[Kitchen]
  F --> G[Preparation]
  G --> H[Delivered]
  H --> I[Charge To Room]`;

export const GXP_CHECKOUT_FLOW_MERMAID = `flowchart TD
  A[Guest] --> B[Request Checkout]
  B --> C[Bill Review]
  C --> D[Payment]
  D --> E[Feedback]
  E --> F[Digital Invoice]
  F --> G[Checkout Complete]`;
