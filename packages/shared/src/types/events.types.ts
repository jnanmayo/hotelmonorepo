/**
 * TungaOS Enterprise Banquet, Wedding & Event Management — Shared types
 */

export interface EventsDashboardStats {
  todaysEvents: number;
  upcomingEvents: number;
  activeLeads: number;
  confirmedBookings: number;
  pendingQuotations: number;
  pendingPayments: number;
  todaysRevenue: number;
  monthlyRevenue: number;
  hallOccupancyPct: number;
  weddingRevenue: number;
  corporateRevenue: number;
  birthdayRevenue: number;
  leadConversionPct: number;
  averageEventValue: number;
  revenueByType: { type: string; amount: number }[];
  upcomingList: EventsBookingItem[];
}

export interface EventsOwnerDashboardStats {
  monthlyEventRevenue: number;
  averageBookingValue: number;
  leadConversionPct: number;
  weddingRevenue: number;
  corporateRevenue: number;
  topSalesExecutive: { name: string; revenue: number } | null;
  hallUtilizationPct: number;
  profitMarginPct: number;
}

export interface EventsOperationsStats {
  todaysTasks: number;
  staffAssigned: number;
  kitchenReady: number;
  decorationReady: number;
  roomReadinessPct: number;
  pendingDeliverables: number;
  tasksByCategory: { category: string; pending: number; completed: number }[];
}

export interface EventsLeadItem {
  id: string;
  leadCode: string;
  clientName: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  eventType: string;
  source: string;
  status: string;
  expectedDate: string | null;
  expectedGuests: number | null;
  expectedRevenue: number | null;
  probability: number;
  assignedTo: string | null;
  createdAt: string;
}

export interface EventsClientItem {
  id: string;
  clientCode: string;
  name: string;
  company: string | null;
  gstNumber: string | null;
  phone: string | null;
  email: string | null;
  eventCount: number;
  totalSpend: number;
}

export interface EventsHallItem {
  id: string;
  hallCode: string;
  name: string;
  capacity: number;
  minGuests: number;
  maxGuests: number;
  baseRate: number;
  amenities: string[];
  isActive: boolean;
  occupancyPct: number;
}

export interface EventsCalendarDay {
  date: string;
  halls: {
    hallId: string;
    hallName: string;
    blocks: {
      id: string;
      blockType: string;
      title: string | null;
      startTime: string | null;
      endTime: string | null;
      eventName: string | null;
    }[];
  }[];
}

export interface EventsBookingItem {
  id: string;
  eventCode: string;
  name: string;
  eventType: string;
  status: string;
  startDate: string;
  endDate: string;
  hallName: string | null;
  expectedGuests: number | null;
  totalAmount: number;
  clientName: string | null;
}

export interface EventsQuotationItem {
  id: string;
  quoteNumber: string;
  clientName: string | null;
  eventType: string | null;
  status: string;
  eventDate: string | null;
  guestCount: number;
  totalAmount: number;
  validUntil: string | null;
  createdAt: string;
}

export interface EventsPackageItem {
  id: string;
  code: string;
  name: string;
  eventType: string;
  basePrice: number;
  inclusions: string[];
  isActive: boolean;
}

export interface EventsMenuItem {
  id: string;
  name: string;
  mealType: string;
  style: string;
  guestCount: number;
  totalAmount: number;
  eventName: string | null;
  posSynced: boolean;
}

export interface EventsSeatingPlanItem {
  id: string;
  eventName: string;
  name: string;
  guestCount: number;
  updatedAt: string;
}

export interface EventsTaskItem {
  id: string;
  eventName: string;
  category: string;
  title: string;
  ownerName: string | null;
  deadline: string | null;
  status: string;
  priority: string;
}

export interface EventsResourceItem {
  id: string;
  code: string;
  name: string;
  category: string;
  totalQty: number;
  availableQty: number;
  allocatedQty: number;
}

export interface EventsRoomBlockItem {
  id: string;
  eventName: string;
  guestCategory: string;
  guestName: string | null;
  roomCount: number;
  checkInDate: string;
  checkOutDate: string;
  pmsSynced: boolean;
}

export interface EventsPaymentItem {
  id: string;
  eventName: string;
  clientName: string | null;
  paymentType: string;
  amount: number;
  gstAmount: number;
  paidAt: string;
}

export interface EventsContractItem {
  id: string;
  contractNumber: string;
  eventName: string;
  clientName: string | null;
  version: number;
  signedAt: string | null;
  createdAt: string;
}

export interface EventsVendorItem {
  id: string;
  name: string;
  category: string;
  contactName: string | null;
  phone: string | null;
  rating: number;
  isPreferred: boolean;
}

export interface EventsChecklistItem {
  id: string;
  name: string;
  eventType: string | null;
  isTemplate: boolean;
  totalItems: number;
  completedItems: number;
}

export interface EventsTimelineItem {
  id: string;
  eventName: string;
  phase: string;
  title: string;
  occurredAt: string;
}

export interface EventsRealtimeEvent {
  type:
    | 'dashboard:update'
    | 'lead:update'
    | 'booking:update'
    | 'hall:availability'
    | 'task:update'
    | 'staff:allocation';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export const EVENT_SALES_WORKFLOW_MERMAID = `flowchart TD
  A[Lead Generated] --> B[Sales Executive Assigned]
  B --> C[Venue Visit]
  C --> D[Proposal]
  D --> E[Quotation]
  E --> F[Negotiation]
  F --> G[Booking Confirmation]
  G --> H[Advance Payment]
  H --> I[Event Planning]
  I --> J[Operations]
  J --> K[Event Execution]
  K --> L[Final Billing]
  L --> M[Feedback]
  M --> N[CRM Follow-up]`;

export const EVENT_TIMELINE_MERMAID = `flowchart TD
  A[Lead] --> B[Booking]
  B --> C[Planning]
  C --> D[Preparation]
  D --> E[Execution]
  E --> F[Closure]
  F --> G[Feedback]`;

export const EVENTS_ARCHITECTURE_MERMAID = `flowchart LR
  subgraph Sales
    L[Leads] --> Q[Quotations]
    Q --> B[Bookings]
  end
  subgraph Planning
    M[Menus] --> S[Seating]
    T[Tasks] --> R[Resources]
  end
  subgraph Operations
    V[Vendors] --> O[Execution]
    RB[Room Blocks] --> PMS[PMS]
  end
  subgraph Billing
    P[Payments] --> F[Finance]
    C[Contracts]
  end
  B --> Planning
  Planning --> Operations
  Operations --> Billing`;
