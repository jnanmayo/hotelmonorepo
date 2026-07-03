import { z } from 'zod';

export const bookingSearchSchema = z.object({
  hotelSlug: z.string().default('tunga-international'),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().int().min(1).max(10).default(2),
  children: z.coerce.number().int().min(0).max(10).default(0),
  rooms: z.coerce.number().int().min(1).max(5).default(1),
  promoCode: z.string().optional(),
  corporateCode: z.string().optional(),
});

export type BookingSearchInput = z.infer<typeof bookingSearchSchema>;

export const bookingQuoteSchema = bookingSearchSchema.extend({
  roomTypeId: z.string().uuid(),
  ratePlanId: z.string().uuid().optional(),
  addonIds: z.array(z.string().uuid()).optional(),
});

export type BookingQuoteInput = z.infer<typeof bookingQuoteSchema>;

export const guestDetailsSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  nationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  gstNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  specialRequests: z.string().max(1000).optional(),
});

export type GuestDetailsInput = z.infer<typeof guestDetailsSchema>;

export const createBookingSchema = bookingQuoteSchema.extend({
  sessionId: z.string().min(1),
  guest: guestDetailsSchema,
  paymentMethod: z.enum([
    'RAZORPAY',
    'STRIPE',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'UPI',
    'NET_BANKING',
    'WALLET',
    'CASH',
  ]).default('RAZORPAY'),
  loyaltyPointsRedeem: z.coerce.number().int().min(0).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const applyCouponSchema = z.object({
  hotelSlug: z.string().default('tunga-international'),
  code: z.string().min(1),
  subtotal: z.coerce.number().min(0),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;

export const createHoldSchema = z.object({
  hotelSlug: z.string().default('tunga-international'),
  sessionId: z.string().min(1),
  roomTypeId: z.string().uuid(),
  roomCount: z.coerce.number().int().min(1).max(5).default(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type CreateHoldInput = z.infer<typeof createHoldSchema>;
