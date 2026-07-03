import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(30),
  storeType: z.enum([
    'MAIN', 'KITCHEN', 'RESTAURANT', 'BAR', 'HOUSEKEEPING', 'LAUNDRY',
    'MAINTENANCE', 'ENGINEERING', 'SPA', 'BANQUET', 'OFFICE', 'CUSTOM',
  ]),
  location: z.string().max(255).optional(),
  capacity: z.coerce.number().min(0).optional(),
  managerId: z.string().uuid().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20),
  parentId: z.string().uuid().optional(),
});

export const createUnitSchema = z.object({
  name: z.string().min(1).max(50),
  symbol: z.string().min(1).max(10),
});

export const createItemSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(50),
  itemCode: z.string().max(50).optional(),
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid().optional(),
  unitId: z.string().uuid(),
  purchaseUnitId: z.string().uuid().optional(),
  consumptionUnitId: z.string().uuid().optional(),
  defaultStoreId: z.string().uuid().optional(),
  description: z.string().optional(),
  brand: z.string().max(100).optional(),
  hsnCode: z.string().max(20).optional(),
  gstRate: z.coerce.number().min(0).max(100).default(0),
  costPrice: z.coerce.number().min(0).default(0),
  sellingPrice: z.coerce.number().min(0).default(0),
  reorderLevel: z.coerce.number().min(0).default(0),
  minStock: z.coerce.number().min(0).default(0),
  maxStock: z.coerce.number().min(0).default(0),
  expiryRequired: z.boolean().default(false),
  batchTracking: z.boolean().default(false),
  initialStock: z.coerce.number().min(0).optional(),
});

export const createTransferSchema = z.object({
  fromStoreId: z.string().uuid(),
  toStoreId: z.string().uuid(),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.coerce.number().positive(),
    batchNumber: z.string().optional(),
  })).min(1),
});

export const createIssueSchema = z.object({
  storeId: z.string().uuid(),
  department: z.enum([
    'RESTAURANT', 'KITCHEN', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE',
    'SPA', 'RECEPTION', 'BANQUET', 'BAR', 'OFFICE', 'STORES',
  ]),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.coerce.number().positive(),
  })).min(1),
});

export const createConsumptionSchema = z.object({
  storeId: z.string().uuid(),
  itemId: z.string().uuid(),
  department: z.enum([
    'RESTAURANT', 'KITCHEN', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE',
    'SPA', 'RECEPTION', 'BANQUET', 'BAR', 'OFFICE', 'STORES',
  ]),
  quantity: z.coerce.number().positive(),
  reference: z.string().optional(),
  sourceModule: z.string().optional(),
  sourceId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const createAdjustmentSchema = z.object({
  storeId: z.string().uuid(),
  itemId: z.string().uuid(),
  type: z.enum(['DAMAGE', 'LOST', 'THEFT', 'BREAKAGE', 'MANUAL', 'CORRECTION', 'EXPIRED']),
  quantity: z.coerce.number(),
  reason: z.string().optional(),
});

export const createAuditSchema = z.object({
  storeId: z.string().uuid(),
  auditType: z.enum(['cycle', 'physical']).default('cycle'),
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const createPurchaseRequestSchema = z.object({
  department: z.enum([
    'RESTAURANT', 'KITCHEN', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE',
    'SPA', 'RECEPTION', 'BANQUET', 'BAR', 'OFFICE', 'STORES',
  ]),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.coerce.number().positive(),
    notes: z.string().optional(),
  })).min(1),
});

export const updateAuditItemSchema = z.object({
  physicalQty: z.coerce.number().min(0),
  notes: z.string().optional(),
});

export type CreateStoreSchema = z.infer<typeof createStoreSchema>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type CreateUnitSchema = z.infer<typeof createUnitSchema>;
export type CreateItemSchema = z.infer<typeof createItemSchema>;
export type CreateTransferSchema = z.infer<typeof createTransferSchema>;
export type CreateIssueSchema = z.infer<typeof createIssueSchema>;
export type CreateConsumptionSchema = z.infer<typeof createConsumptionSchema>;
export type CreateAdjustmentSchema = z.infer<typeof createAdjustmentSchema>;
export type CreateAuditSchema = z.infer<typeof createAuditSchema>;
export type CreatePurchaseRequestSchema = z.infer<typeof createPurchaseRequestSchema>;
