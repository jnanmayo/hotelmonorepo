/**
 * TungaOS Restaurant POS — Shared types
 */

export type FnbOrderType =
  | 'DINE_IN'
  | 'ROOM_SERVICE'
  | 'TAKEAWAY'
  | 'DELIVERY'
  | 'CORPORATE'
  | 'BANQUET'
  | 'POOLSIDE';

export type KitchenOrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'CANCELLED';

export interface FnbDashboardStats {
  todaySales: number;
  todayOrders: number;
  averageOrderValue: number;
  topSellingItems: { name: string; quantity: number; revenue: number }[];
  runningTables: number;
  occupiedTables: number;
  availableTables: number;
  kitchenQueue: number;
  ordersReady: number;
  ordersDelayed: number;
  roomServiceOrders: number;
  pendingBills: number;
  revenueToday: number;
  restaurantRevenue: number;
  cafeRevenue: number;
  barRevenue: number;
  takeawayRevenue: number;
}

export interface OutletSummary {
  id: string;
  name: string;
  code: string;
  outletType: string;
  location: string | null;
  tableCount: number;
  menuItemCount: number;
}

export interface TableSummary {
  id: string;
  tableNumber: string;
  capacity: number;
  zone: string | null;
  tableStatus: string;
  isOccupied: boolean;
  isVip: boolean;
  restaurantName: string;
  restaurantId: string;
  openBillId: string | null;
}

export interface MenuItemSummary {
  id: string;
  name: string;
  code: string;
  price: number;
  categoryName: string;
  itemType: string;
  isAvailable: boolean;
  prepTimeMins: number | null;
  imageUrl: string | null;
}

export interface BillSummary {
  id: string;
  billNumber: string;
  status: string;
  orderType: FnbOrderType;
  tableNumber: string | null;
  roomNumber: string | null;
  guestName: string | null;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

export interface KitchenOrderSummary {
  id: string;
  orderNumber: string;
  status: KitchenOrderStatus;
  orderType: FnbOrderType;
  priority: string;
  tableNumber: string | null;
  roomNumber: string | null;
  itemCount: number;
  items: { name: string; quantity: number; status: string; notes: string | null }[];
  createdAt: string;
  isDelayed: boolean;
}

export interface FnbRealtimeEvent {
  type:
    | 'order:created'
    | 'order:updated'
    | 'order:ready'
    | 'order:served'
    | 'order:cancelled'
    | 'bill:updated'
    | 'table:updated'
    | 'dashboard:update';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
