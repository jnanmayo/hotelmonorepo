import { z } from 'zod';

export const createBillSchema = z.object({
  restaurantId: z.string().uuid(),
  tableId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
  reservationId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  orderType: z.enum(['DINE_IN', 'ROOM_SERVICE', 'TAKEAWAY', 'DELIVERY', 'CORPORATE', 'BANQUET', 'POOLSIDE']).default('DINE_IN'),
  waiterId: z.string().uuid().optional(),
});

export const addBillItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
  customizations: z.record(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateKitchenStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED']),
});

export const closeBillSchema = z.object({
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'WALLET', 'ROOM_CHARGE', 'CORPORATE_CREDIT']).optional(),
  tipAmount: z.number().min(0).default(0),
  chargeToRoom: z.boolean().default(false),
  discountAmount: z.number().min(0).default(0),
});

export const createMenuItemSchema = z.object({
  restaurantId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  description: z.string().optional(),
  price: z.number().min(0),
  cost: z.number().min(0).default(0),
  gstRate: z.number().min(0).default(5),
  itemType: z.enum(['FOOD', 'BEVERAGE', 'DESSERT', 'ALCOHOL', 'COMBO']).default('FOOD'),
  prepTimeMins: z.number().int().optional(),
  isAvailable: z.boolean().default(true),
});

export const createTableSchema = z.object({
  restaurantId: z.string().uuid(),
  tableNumber: z.string().min(1).max(20),
  capacity: z.number().int().min(1).default(4),
  zone: z.string().optional(),
  isVip: z.boolean().default(false),
});

export const roomServiceOrderSchema = z.object({
  reservationId: z.string().uuid(),
  roomId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().min(1),
    notes: z.string().optional(),
    customizations: z.record(z.string()).optional(),
  })).min(1),
});

export type CreateBillSchema = z.infer<typeof createBillSchema>;
export type AddBillItemSchema = z.infer<typeof addBillItemSchema>;
export type UpdateKitchenStatusSchema = z.infer<typeof updateKitchenStatusSchema>;
export type CloseBillSchema = z.infer<typeof closeBillSchema>;
export type CreateMenuItemSchema = z.infer<typeof createMenuItemSchema>;
export type CreateTableSchema = z.infer<typeof createTableSchema>;
export type RoomServiceOrderSchema = z.infer<typeof roomServiceOrderSchema>;
