import { z } from 'zod';

export const walkInSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  roomTypeId: z.string().uuid(),
  roomId: z.string().uuid().optional(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  adults: z.number().int().min(1).max(10),
  roomRate: z.number().min(0),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'CORPORATE_CREDIT', 'OTHER']),
  paymentAmount: z.number().min(0),
});

export const assignRoomSchema = z.object({
  reservationId: z.string().uuid(),
  roomId: z.string().uuid(),
  transferType: z.enum(['ASSIGN', 'UPGRADE', 'DOWNGRADE', 'CHANGE']).optional(),
  reason: z.string().max(500).optional(),
});

export const collectPaymentSchema = z.object({
  reservationId: z.string().uuid(),
  amount: z.number(),
  method: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'CORPORATE_CREDIT', 'OTHER']),
  paymentType: z.enum(['ADVANCE', 'BALANCE', 'DEPOSIT', 'SECURITY_DEPOSIT', 'REFUND']),
  notes: z.string().max(500).optional(),
  splitPayments: z.array(z.object({ method: z.string(), amount: z.number().min(0) })).optional(),
});

export const guestRequestSchema = z.object({
  reservationId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  requestType: z.enum([
    'EXTRA_BED', 'BABY_CRIB', 'EXTRA_PILLOW', 'AIRPORT_PICKUP', 'AIRPORT_DROP',
    'BIRTHDAY_DECORATION', 'ANNIVERSARY_DECORATION', 'WHEELCHAIR', 'LATE_ARRIVAL',
    'EARLY_CHECKIN', 'LATE_CHECKOUT', 'OTHER',
  ]),
  description: z.string().max(2000).optional(),
  scheduledAt: z.string().optional(),
  chargeAmount: z.number().min(0).optional(),
});

export const complaintSchema = z.object({
  guestId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  category: z.enum(['HOUSEKEEPING', 'RESTAURANT', 'MAINTENANCE', 'ROOM', 'NOISE', 'STAFF', 'BILLING', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export const communicationSchema = z.object({
  guestId: z.string().uuid(),
  reservationId: z.string().uuid().optional(),
  channel: z.enum(['WHATSAPP', 'EMAIL', 'SMS']),
  messageType: z.enum([
    'BOOKING_CONFIRMATION', 'WELCOME', 'ROOM_READY', 'CHECKOUT_REMINDER', 'INVOICE', 'FEEDBACK_REQUEST', 'CUSTOM',
  ]),
  recipient: z.string().min(1).max(255),
  subject: z.string().max(500).optional(),
  body: z.string().min(1).max(5000),
});

export const keyCardSchema = z.object({
  reservationId: z.string().uuid(),
  roomId: z.string().uuid(),
  guestId: z.string().uuid().optional(),
  isDuplicate: z.boolean().optional(),
});

export const lostFoundSchema = z.object({
  itemName: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  photoUrl: z.string().url().optional(),
  roomId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
  guestName: z.string().max(255).optional(),
  foundBy: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
});

export type WalkInSchema = z.infer<typeof walkInSchema>;
export type AssignRoomSchema = z.infer<typeof assignRoomSchema>;
export type CollectPaymentSchema = z.infer<typeof collectPaymentSchema>;
export type GuestRequestSchema = z.infer<typeof guestRequestSchema>;
export type ComplaintSchema = z.infer<typeof complaintSchema>;
export type CommunicationSchema = z.infer<typeof communicationSchema>;
export type KeyCardSchema = z.infer<typeof keyCardSchema>;
export type LostFoundSchema = z.infer<typeof lostFoundSchema>;
