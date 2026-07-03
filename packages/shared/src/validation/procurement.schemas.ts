import { z } from 'zod';

export const createVendorSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  companyName: z.string().max(255).optional(),
  categoryId: z.string().uuid().optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  address: z.string().optional(),
  gstNumber: z.string().max(50).optional(),
  panNumber: z.string().max(20).optional(),
  msmeNumber: z.string().max(50).optional(),
  productsSupplied: z.string().optional(),
  paymentTerms: z.enum(['ADVANCE', 'NET_15', 'NET_30', 'NET_45', 'NET_60', 'CREDIT', 'PARTIAL']).default('NET_30'),
  creditLimit: z.coerce.number().min(0).default(0),
  leadTimeDays: z.coerce.number().int().min(0).default(7),
});

export const createProcPrSchema = z.object({
  department: z.enum([
    'RESTAURANT', 'KITCHEN', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE',
    'SPA', 'RECEPTION', 'BANQUET', 'BAR', 'OFFICE', 'STORES',
  ]),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  requiredDate: z.string().optional(),
  reason: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().uuid().optional(),
    itemName: z.string().min(1),
    quantity: z.coerce.number().positive(),
    unit: z.string().optional(),
    notes: z.string().optional(),
  })).min(1),
});

export const createRfqSchema = z.object({
  purchaseRequestId: z.string().uuid().optional(),
  expiryDate: z.string().datetime().optional(),
  deadline: z.string().datetime().optional(),
  vendorIds: z.array(z.string().uuid()).min(1),
  items: z.array(z.object({
    itemId: z.string().uuid().optional(),
    itemName: z.string().min(1),
    quantity: z.coerce.number().positive(),
    unit: z.string().optional(),
  })).min(1),
  notes: z.string().optional(),
});

export const createQuotationSchema = z.object({
  rfqId: z.string().uuid(),
  vendorId: z.string().uuid(),
  deliveryCharges: z.coerce.number().min(0).default(0),
  leadTimeDays: z.coerce.number().int().min(0).default(7),
  warranty: z.string().optional(),
  validityDate: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(z.object({
    itemName: z.string().min(1),
    quantity: z.coerce.number().positive(),
    unitPrice: z.coerce.number().min(0),
    discount: z.coerce.number().min(0).default(0),
    gstRate: z.coerce.number().min(0).max(100).default(0),
  })).min(1),
});

export const createPoSchema = z.object({
  vendorId: z.string().uuid(),
  quotationId: z.string().uuid().optional(),
  purchaseRequestId: z.string().uuid().optional(),
  expectedDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
  paymentTerms: z.enum(['ADVANCE', 'NET_15', 'NET_30', 'NET_45', 'NET_60', 'CREDIT', 'PARTIAL']).optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.coerce.number().positive(),
    unitPrice: z.coerce.number().min(0),
    discount: z.coerce.number().min(0).default(0),
    gstRate: z.coerce.number().min(0).max(100).default(0),
  })).min(1),
});

export const createGrnSchema = z.object({
  orderId: z.string().uuid(),
  storeId: z.string().uuid().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.coerce.number().positive(),
    acceptedQty: z.coerce.number().min(0).optional(),
    rejectedQty: z.coerce.number().min(0).default(0),
    unitPrice: z.coerce.number().min(0).optional(),
    batchNumber: z.string().optional(),
    expiryDate: z.string().optional(),
  })).min(1),
});

export const createReturnSchema = z.object({
  vendorId: z.string().uuid(),
  orderId: z.string().uuid().optional(),
  reason: z.enum(['DAMAGED', 'EXPIRED', 'WRONG_QUANTITY', 'WRONG_PRODUCT', 'QUALITY_ISSUE']),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    quantity: z.coerce.number().positive(),
    notes: z.string().optional(),
  })).min(1),
});

export const createContractSchema = z.object({
  vendorId: z.string().uuid(),
  title: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  renewalDate: z.string().optional(),
  terms: z.string().optional(),
  autoRenew: z.boolean().default(false),
});

export type CreateVendorSchema = z.infer<typeof createVendorSchema>;
export type CreateProcPrSchema = z.infer<typeof createProcPrSchema>;
export type CreateRfqSchema = z.infer<typeof createRfqSchema>;
export type CreateQuotationSchema = z.infer<typeof createQuotationSchema>;
export type CreatePoSchema = z.infer<typeof createPoSchema>;
export type CreateGrnSchema = z.infer<typeof createGrnSchema>;
export type CreateReturnSchema = z.infer<typeof createReturnSchema>;
export type CreateContractSchema = z.infer<typeof createContractSchema>;
