/**
 * TungaOS Room Management — Shared types (Digital Twin)
 */

export type RoomMgmtStatus =
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

export interface RoomDashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  reservedRooms: number;
  dirtyRooms: number;
  cleaningRooms: number;
  inspectedRooms: number;
  blockedRooms: number;
  outOfOrderRooms: number;
  maintenanceRooms: number;
  vipRooms: number;
  corporateRooms: number;
  averageOccupancy: number;
  revenueToday: number;
  revenueThisMonth: number;
  averageRoomRate: number;
  averageStay: number;
  mostBookedRoom: { roomNumber: string; count: number } | null;
  leastBookedRoom: { roomNumber: string; count: number } | null;
}

export interface BuildingSummary {
  id: string;
  name: string;
  code: string;
  description: string | null;
  floors: FloorSummary[];
}

export interface FloorSummary {
  id: string;
  name: string;
  floorNumber: number;
  buildingId: string;
  roomCount?: number;
}

export interface RoomTypeSummary {
  id: string;
  name: string;
  code: string;
  baseRate: number;
  maxOccupancy: number;
  bedType: string | null;
  viewType: string | null;
  sizeSqm: number | null;
  roomCount?: number;
}

export interface RoomInventory {
  buildings: BuildingSummary[];
  roomTypes: RoomTypeSummary[];
  totalRooms: number;
}

export interface RoomProfile {
  id: string;
  roomNumber: string;
  status: RoomMgmtStatus;
  category: string;
  isSmoking: boolean;
  isAccessible: boolean;
  notes: string | null;
  floor: { id: string; name: string; floorNumber: number };
  building: { id: string; name: string; code: string };
  roomType: RoomTypeSummary;
  amenities: { id: string; name: string; icon: string | null }[];
  currentGuest: string | null;
  currentReservationId: string | null;
}

export interface RoomTimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string | null;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface RoomAllocationSuggestion {
  id: string;
  roomNumber: string;
  roomTypeName: string;
  floorName: string;
  floorNumber: number;
  buildingName: string;
  status: RoomMgmtStatus;
  score: number;
  reasons: string[];
}

export interface RoomPricingPlan {
  id: string;
  name: string;
  code: string;
  planType: string;
  baseRate: number;
  roomTypeId: string;
  roomTypeName: string;
  corporateOnly: boolean;
  memberOnly: boolean;
}

export interface RoomAssetItem {
  id: string;
  name: string;
  code: string;
  category: string | null;
  location: string | null;
  purchaseDate: string | null;
  purchaseCost: number | null;
  warrantyUntil: string | null;
  status: string;
}

export interface RoomRevenueStats {
  roomId?: string;
  roomNumber?: string;
  monthlyRevenue: number;
  yearlyRevenue: number;
  adr: number;
  revPar: number;
  occupancyPct: number;
  averageStay: number;
  corporateRevenue: number;
  directRevenue: number;
  otaRevenue: number;
}

export interface RoomOwnerStats {
  topPerforming: { roomNumber: string; revenue: number; occupancyPct: number }[];
  leastPerforming: { roomNumber: string; revenue: number; occupancyPct: number }[];
  maintenanceCost: number;
  cleaningCost: number;
  utilizationPct: number;
}

export interface RoomSearchResult {
  id: string;
  roomNumber: string;
  status: RoomMgmtStatus;
  category: string;
  buildingName: string;
  floorNumber: number;
  roomTypeName: string;
  currentGuest: string | null;
}

export interface RoomBlockItem {
  id: string;
  roomId: string;
  roomNumber: string;
  reason: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
}

export interface RoomInspectionItem {
  id: string;
  roomId: string;
  roomNumber: string;
  qualityScore: number;
  status: string;
  remarks: string | null;
  inspectedAt: string;
}

export interface RoomDamageItem {
  id: string;
  roomId: string;
  roomNumber: string;
  itemName: string;
  estimatedCost: number;
  recoveryAmount: number;
  repairStatus: string;
  responsibleGuest: string | null;
}

export interface AmenityItem {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
}
