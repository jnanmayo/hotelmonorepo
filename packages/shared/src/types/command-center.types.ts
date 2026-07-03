/**
 * TungaOS Executive Command Center & Business Intelligence — Shared types
 */

export const BI_DATA_WAREHOUSE_MERMAID = `flowchart TD
  A[Operational Database] --> B[ETL / Aggregation Layer]
  B --> C[Analytics Summary Tables]
  C --> D[Command Center API]
  D --> E[Executive Dashboard]
  D --> F[AI Engine]
  E --> G[Owner / Investor / War Room]`;

export interface CommandCenterStats {
  todayRevenue: number;
  todayProfit: number;
  todayExpenses: number;
  cashPosition: number;
  bankBalance: number;
  occupancyPct: number;
  revPar: number;
  adr: number;
  averageLengthOfStay: number;
  directBookings: number;
  otaBookings: number;
  corporateBookings: number;
  banquetRevenue: number;
  restaurantRevenue: number;
  roomRevenue: number;
  spaRevenue: number;
  laundryRevenue: number;
  travelDeskRevenue: number;
  inventoryValue: number;
  outstandingPayments: number;
  outstandingReceivables: number;
  netProfit: number;
  ebitda: number;
  customerSatisfaction: number;
  employeeAttendancePct: number;
  liveHotelStatus: LiveHotelStatus;
  kpiBoard: KpiBoard;
  revenueTrend: RevenueTrendPoint[];
  departmentRevenue: { department: string; amount: number }[];
  alerts: CommandCenterAlert[];
}

export interface LiveHotelStatus {
  totalRooms: number;
  occupied: number;
  vacant: number;
  reserved: number;
  dirty: number;
  cleaning: number;
  maintenance: number;
  vipGuests: number;
  corporateGuests: number;
  checkInsToday: number;
  checkOutsToday: number;
  walkIns: number;
  noShows: number;
  cancelledBookings: number;
}

export interface KpiBoard {
  revenue: number;
  profit: number;
  occupancy: number;
  revPar: number;
  adr: number;
  gop: number;
  foodCostPct: number;
  payrollPct: number;
  maintenanceCostPct: number;
  utilityCostPct: number;
  guestSatisfaction: number;
  repeatGuestsPct: number;
  directBookingPct: number;
  otaDependencyPct: number;
  corporateRevenuePct: number;
  banquetRevenuePct: number;
  restaurantRevenuePct: number;
}

export interface RevenueTrendPoint {
  period: string;
  revenue: number;
  profit: number;
  occupancy: number;
}

export interface CommandCenterAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  category: string;
  message: string;
  timestamp: string;
}

export interface WarRoomStats {
  bookings: { label: string; value: number }[];
  revenue: { label: string; value: number }[];
  operations: { label: string; value: number; status: string }[];
  modules: { module: string; status: string; metric: string }[];
}

export interface AiCommandCenterStats {
  predictions: {
    label: string;
    value: string;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  insights: string[];
}

export interface InvestorDashboardStats {
  revenue: number;
  profit: number;
  roi: number;
  occupancy: number;
  growthPct: number;
  forecastRevenue: number;
  capitalUtilization: number;
  hotelValuation: number;
}

export interface DepartmentAnalytics {
  department: string;
  revenue: number;
  cost: number;
  profit: number;
  trend: RevenueTrendPoint[];
}

export type CommandCenterRealtimeEvent =
  | { type: 'dashboard:update'; hotelId: string; payload: Record<string, unknown>; timestamp: string }
  | { type: 'revenue:update'; hotelId: string; payload: { amount: number }; timestamp: string }
  | { type: 'occupancy:update'; hotelId: string; payload: { pct: number }; timestamp: string }
  | { type: 'alert:new'; hotelId: string; payload: CommandCenterAlert; timestamp: string };
