import { z } from 'zod';

const eamPriority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY']);
const workOrderStatus = z.enum([
  'NEW', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_FOR_PARTS',
  'WAITING_VENDOR', 'PAUSED', 'COMPLETED', 'INSPECTED', 'CLOSED', 'CANCELLED',
]);
const pmFrequency = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'METER_BASED']);
const requestSource = z.enum([
  'FRONT_DESK', 'HOUSEKEEPING', 'RESTAURANT', 'GUEST_PORTAL',
  'MAINTENANCE_TEAM', 'MANAGER', 'IOT_DEVICE',
]);
const correctiveType = z.enum([
  'BREAKDOWN', 'FAULT', 'DAMAGE', 'LEAKAGE', 'ELECTRICAL', 'MECHANICAL', 'SOFTWARE', 'NETWORK',
]);
const inspectionType = z.enum(['ELECTRICAL', 'MECHANICAL', 'CLEANING', 'SAFETY', 'PERFORMANCE']);
const lifecycleStage = z.enum([
  'PURCHASED', 'INSTALLED', 'OPERATIONAL', 'INSPECTION', 'REPAIR',
  'AMC', 'WARRANTY', 'UPGRADE', 'REPLACEMENT', 'DISPOSED',
]);

export const createAssetSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  categoryId: z.string().uuid().optional(),
  category: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  location: z.string().max(255).optional(),
  building: z.string().max(100).optional(),
  floor: z.string().max(50).optional(),
  roomId: z.string().uuid().optional(),
  serialNumber: z.string().max(100).optional(),
  manufacturer: z.string().max(255).optional(),
  model: z.string().max(255).optional(),
  vendorName: z.string().max(255).optional(),
  purchaseDate: z.string().optional(),
  installationDate: z.string().optional(),
  warrantyStart: z.string().optional(),
  warrantyEnd: z.string().optional(),
  amcStart: z.string().optional(),
  amcEnd: z.string().optional(),
  purchaseCost: z.coerce.number().min(0).optional(),
  currentValue: z.coerce.number().min(0).optional(),
  usefulLifeYears: z.coerce.number().int().min(0).optional(),
  barcode: z.string().max(100).optional(),
  qrCode: z.string().max(100).optional(),
});

export const createMaintenanceRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  source: requestSource.default('MAINTENANCE_TEAM'),
  issueCategory: correctiveType.optional(),
  priority: eamPriority.default('MEDIUM'),
  roomId: z.string().uuid().optional(),
  assetId: z.string().uuid().optional(),
  location: z.string().max(255).optional(),
  remarks: z.string().optional(),
  photos: z.array(z.string()).optional(),
});

export const createWorkOrderSchema = z.object({
  maintenanceRequestId: z.string().uuid().optional(),
  assetId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  department: z.string().max(100).optional(),
  priority: eamPriority.default('MEDIUM'),
  issue: z.string().min(1).max(255),
  description: z.string().optional(),
  assignedStaffId: z.string().uuid().optional(),
  estimatedMinutes: z.coerce.number().int().min(0).optional(),
  isPreventive: z.boolean().default(false),
  pmPlanId: z.string().uuid().optional(),
});

export const updateWorkOrderStatusSchema = z.object({
  status: workOrderStatus,
  resolutionNotes: z.string().optional(),
});

export const assignWorkOrderSchema = z.object({
  assignedStaffId: z.string().uuid(),
  estimatedMinutes: z.coerce.number().int().min(0).optional(),
});

export const addWorkOrderPartSchema = z.object({
  inventoryItemId: z.string().uuid().optional(),
  partName: z.string().min(1).max(255),
  quantity: z.coerce.number().positive(),
  unitCost: z.coerce.number().min(0).default(0),
});

export const createPmPlanSchema = z.object({
  assetId: z.string().uuid(),
  name: z.string().min(1).max(255),
  frequency: pmFrequency.default('MONTHLY'),
  meterThreshold: z.coerce.number().min(0).optional(),
  estimatedMinutes: z.coerce.number().int().min(0).optional(),
  checklist: z.record(z.unknown()).optional(),
});

export const createAmcContractSchema = z.object({
  assetId: z.string().uuid().optional(),
  contractNumber: z.string().min(1).max(50),
  vendorName: z.string().min(1).max(255),
  coverage: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  serviceVisits: z.coerce.number().int().min(0).default(0),
  slaHours: z.coerce.number().int().min(0).optional(),
  cost: z.coerce.number().min(0).default(0),
});

export const createWarrantyClaimSchema = z.object({
  assetId: z.string().uuid(),
  description: z.string().optional(),
  oemService: z.string().max(255).optional(),
});

export const createEamInspectionSchema = z.object({
  workOrderId: z.string().uuid().optional(),
  assetId: z.string().uuid().optional(),
  inspectionType: inspectionType,
  checklist: z.record(z.unknown()).optional(),
  remarks: z.string().optional(),
  passed: z.boolean().optional(),
});

export const createEnergyReadingSchema = z.object({
  utilityType: z.enum(['ELECTRICITY', 'WATER', 'GAS', 'DIESEL', 'GENERATOR', 'SOLAR']),
  department: z.string().max(100).optional(),
  roomId: z.string().uuid().optional(),
  readingValue: z.coerce.number().positive(),
  unit: z.string().max(20).default('kWh'),
  readingAt: z.string().optional(),
  meterId: z.string().max(100).optional(),
});

export const updateAssetLifecycleSchema = z.object({
  lifecycleStage: lifecycleStage,
  notes: z.string().optional(),
});

export type CreateAssetSchema = z.infer<typeof createAssetSchema>;
export type CreateMaintenanceRequestSchema = z.infer<typeof createMaintenanceRequestSchema>;
export type CreateWorkOrderSchema = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderStatusSchema = z.infer<typeof updateWorkOrderStatusSchema>;
export type AssignWorkOrderSchema = z.infer<typeof assignWorkOrderSchema>;
export type AddWorkOrderPartSchema = z.infer<typeof addWorkOrderPartSchema>;
export type CreatePmPlanSchema = z.infer<typeof createPmPlanSchema>;
export type CreateAmcContractSchema = z.infer<typeof createAmcContractSchema>;
export type CreateWarrantyClaimSchema = z.infer<typeof createWarrantyClaimSchema>;
export type CreateEamInspectionSchema = z.infer<typeof createEamInspectionSchema>;
export type CreateEnergyReadingSchema = z.infer<typeof createEnergyReadingSchema>;
export type UpdateAssetLifecycleSchema = z.infer<typeof updateAssetLifecycleSchema>;
