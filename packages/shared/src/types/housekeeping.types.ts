/**
 * TungaOS Housekeeping & Laundry — Shared types
 */

export type HkTaskStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'INSPECTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'REOPENED'
  | 'FAILED'
  | 'CANCELLED';

export type HkCleaningType =
  | 'standard'
  | 'express'
  | 'deep'
  | 'vip'
  | 'checkout_cleaning'
  | 'occupied'
  | 'night'
  | 'inspection'
  | 'emergency';

export interface HkDashboardStats {
  totalRooms: number;
  dirtyRooms: number;
  cleaningRooms: number;
  readyRooms: number;
  awaitingInspection: number;
  deepCleaningRooms: number;
  maintenanceRooms: number;
  pendingTasks: number;
  completedToday: number;
  averageCleaningMinutes: number;
  staffOnDuty: number;
  laundryPending: number;
  lostFoundItems: number;
  guestRequests: number;
  complaints: number;
  cleaningScore: number;
}

export interface HkTaskItem {
  id: string;
  roomId: string;
  roomNumber: string;
  floorNumber: number;
  buildingName: string;
  status: HkTaskStatus;
  taskType: string;
  priority: string;
  assignedStaffId: string | null;
  assignedStaffName: string | null;
  estimatedMinutes: number | null;
  startedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  cleaningScore: number | null;
  createdAt: string;
}

export interface HkStaffSummary {
  id: string;
  employeeCode: string;
  name: string;
  department: string | null;
  designation: string | null;
  activeTasks: number;
  completedToday: number;
  averageCleaningMinutes: number;
  performanceScore: number;
}

export interface HkChecklistItem {
  id: string;
  itemName: string;
  isCompleted: boolean;
  sortOrder: number;
}

export interface HkLaundryOrder {
  id: string;
  orderNumber: string;
  roomNumber: string | null;
  status: string;
  totalAmount: number;
  itemCount: number;
  collectedAt: string | null;
  createdAt: string;
}

export interface HkLinenItem {
  id: string;
  itemName: string;
  category: string;
  totalQuantity: number;
  available: number;
  inLaundry: number;
  damaged: number;
  lost: number;
  status: string;
}

export interface HkLostFoundItem {
  id: string;
  itemName: string;
  roomNumber: string | null;
  guestName: string | null;
  foundBy: string | null;
  status: string;
  foundAt: string;
}

export interface HkGuestRequestItem {
  id: string;
  requestType: string;
  status: string;
  roomId: string | null;
  description: string | null;
  createdAt: string;
}

export interface HkInspectionItem {
  id: string;
  taskId: string;
  roomNumber: string;
  qualityScore: number;
  status: string;
  remarks: string | null;
  inspectedAt: string;
}

export interface HkRealtimeEvent {
  type:
    | 'task:created'
    | 'task:updated'
    | 'task:completed'
    | 'inspection:pending'
    | 'inspection:approved'
    | 'inspection:rejected'
    | 'room:ready'
    | 'laundry:update'
    | 'dashboard:update';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
