/**
 * TungaOS Enterprise Asset Management (EAM) / CMMS — Shared types
 */

export type EamPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';

export type WorkOrderStatusType =
  | 'NEW'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_PARTS'
  | 'WAITING_VENDOR'
  | 'PAUSED'
  | 'COMPLETED'
  | 'INSPECTED'
  | 'CLOSED'
  | 'CANCELLED';

export type AssetLifecycleStageType =
  | 'PURCHASED'
  | 'INSTALLED'
  | 'OPERATIONAL'
  | 'INSPECTION'
  | 'REPAIR'
  | 'AMC'
  | 'WARRANTY'
  | 'UPGRADE'
  | 'REPLACEMENT'
  | 'DISPOSED';

export type PmFrequencyType =
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'HALF_YEARLY'
  | 'YEARLY'
  | 'METER_BASED';

export interface EamDashboardStats {
  totalAssets: number;
  operationalAssets: number;
  assetsUnderRepair: number;
  assetsUnderAmc: number;
  assetsUnderWarranty: number;
  openWorkOrders: number;
  completedWorkOrders: number;
  overdueWorkOrders: number;
  emergencyRepairs: number;
  maintenanceCost: number;
  downtimeHours: number;
  mttr: number;
  mtbf: number;
  technicianProductivity: number;
  upcomingPreventive: number;
  upcomingWarrantyExpiry: number;
  upcomingAmcExpiry: number;
  openRequests: number;
  pendingInspections: number;
}

export interface EamAssetItem {
  id: string;
  code: string;
  name: string;
  category: string | null;
  categoryName: string | null;
  department: string | null;
  location: string | null;
  roomNumber: string | null;
  serialNumber: string | null;
  manufacturer: string | null;
  model: string | null;
  status: string;
  lifecycleStage: AssetLifecycleStageType;
  purchaseCost: number | null;
  currentValue: number | null;
  warrantyEnd: string | null;
  amcEnd: string | null;
  qrCode: string | null;
  barcode: string | null;
}

export interface EamWorkOrderItem {
  id: string;
  workOrderNumber: string;
  assetName: string | null;
  roomNumber: string | null;
  department: string | null;
  priority: EamPriority;
  issue: string;
  status: WorkOrderStatusType;
  assignedTo: string | null;
  estimatedMinutes: number | null;
  laborCost: number;
  partsCost: number;
  startedAt: string | null;
  completedAt: string | null;
  isPreventive: boolean;
  createdAt: string;
}

export interface EamMaintenanceRequestItem {
  id: string;
  requestNumber: string;
  title: string;
  category: string | null;
  source: string;
  priority: EamPriority;
  status: string;
  roomNumber: string | null;
  assetName: string | null;
  slaDueAt: string | null;
  reportedAt: string;
}

export interface EamPmPlanItem {
  id: string;
  name: string;
  assetName: string;
  frequency: PmFrequencyType;
  nextDueAt: string | null;
  lastRunAt: string | null;
  isActive: boolean;
}

export interface EamAmcContractItem {
  id: string;
  contractNumber: string;
  vendorName: string;
  assetName: string | null;
  startDate: string;
  endDate: string;
  cost: number;
  status: string;
  slaHours: number | null;
}

export interface EamWarrantyClaimItem {
  id: string;
  claimNumber: string;
  assetName: string;
  status: string;
  claimDate: string;
  cost: number;
}

export interface EamTechnicianItem {
  id: string;
  staffId: string;
  name: string;
  department: string | null;
  skills: string[];
  completedJobs: number;
  performanceScore: number | null;
  isAvailable: boolean;
  currentJobs: number;
}

export interface EamInspectionItem {
  id: string;
  inspectionType: string;
  assetName: string | null;
  workOrderNumber: string | null;
  passed: boolean | null;
  inspectedAt: string;
}

export interface EamSafetyItem {
  id: string;
  equipmentType: string;
  location: string;
  complianceStatus: string;
  lastInspected: string | null;
  nextDue: string | null;
}

export interface EamEnergyStats {
  electricityTotal: number;
  waterTotal: number;
  monthlyTrend: { month: string; electricity: number; water: number }[];
  departmentUsage: { department: string; value: number }[];
  peakHours: { hour: number; value: number }[];
}

export interface EamAnalyticsData {
  costByDepartment: { department: string; cost: number }[];
  failureRate: { category: string; count: number }[];
  repairFrequency: { assetName: string; count: number }[];
  technicianProductivity: { name: string; completed: number; avgMinutes: number }[];
  downtimeByAsset: { assetName: string; hours: number }[];
}

export interface EamOwnerDashboardStats {
  maintenanceCost: number;
  assetValue: number;
  assetDepreciation: number;
  downtimeHours: number;
  amcCost: number;
  topExpensiveAssets: { name: string; cost: number }[];
  nearReplacement: { name: string; currentValue: number; age: number }[];
}

export interface EamRealtimeEvent {
  type:
    | 'dashboard:update'
    | 'workorder:update'
    | 'request:update'
    | 'asset:update'
    | 'technician:update';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export const DEFAULT_ASSET_CATEGORIES = [
  'Air Conditioner', 'Television', 'Mini Bar', 'Refrigerator', 'Water Heater',
  'Elevator', 'Generator', 'UPS', 'Electrical Panel', 'Lighting', 'Furniture',
  'Beds', 'Mattress', 'Curtains', 'Kitchen Equipment', 'Coffee Machine',
  'Laundry Machine', 'Dishwasher', 'Water Pump', 'Fire Extinguisher',
  'Smoke Detector', 'CCTV', 'Computer', 'Printer', 'Router', 'WiFi Access Point',
  'Telephone', 'Vehicle',
] as const;
