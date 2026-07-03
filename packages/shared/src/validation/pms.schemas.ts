import { z } from 'zod';

export const pmsBookingSourceSchema = z.enum([
  'DIRECT_WEBSITE',
  'WALK_IN',
  'PHONE',
  'EMAIL',
  'OTA_BOOKING_COM',
  'OTA_EXPEDIA',
  'OTA_AGODA',
  'OTA_MMT',
  'CORPORATE_PORTAL',
  'TRAVEL_AGENT',
  'GDS',
  'CHANNEL_MANAGER',
  'OTHER',
]);

export const createPmsReservationSchema = z.object({
  guestId: z.string().uuid().optional(),
  guest: z
    .object({
      firstName: z.string().min(1).max(100),
      lastName: z.string().min(1).max(100),
      email: z.string().email().optional(),
      phone: z.string().max(30).optional(),
      nationality: z.string().max(100).optional(),
      companyName: z.string().max(255).optional(),
    })
    .optional(),
  roomTypeId: z.string().uuid(),
  roomId: z.string().uuid().optional(),
  source: pmsBookingSourceSchema,
  checkInDate: z.string(),
  checkOutDate: z.string(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20).optional(),
  roomRate: z.number().min(0),
  specialRequests: z.string().max(2000).optional(),
  corporateBookingId: z.string().uuid().optional(),
  groupBookingId: z.string().uuid().optional(),
  travelAgentId: z.string().uuid().optional(),
  isGuaranteed: z.boolean().optional(),
});

export const updatePmsReservationSchema = createPmsReservationSchema.partial().extend({
  status: z
    .enum([
      'PENDING',
      'CONFIRMED',
      'GUARANTEED',
      'CHECKED_IN',
      'CHECKED_OUT',
      'CANCELLED',
      'NO_SHOW',
      'ON_HOLD',
      'WAITLISTED',
    ])
    .optional(),
  changeReason: z.string().max(500).optional(),
});

export const checkInStepSchema = z.object({
  step: z.enum([
    'RESERVATION',
    'GUEST_VERIFICATION',
    'DOCUMENT_UPLOAD',
    'DIGITAL_SIGNATURE',
    'PAYMENT_VERIFICATION',
    'ROOM_ASSIGNMENT',
    'KEY_CARD_ISSUE',
    'COMPLETE',
  ]),
  roomId: z.string().uuid().optional(),
  keyCardNumber: z.string().max(50).optional(),
  signatureUrl: z.string().url().optional(),
  photoUrl: z.string().url().optional(),
  passportScanUrl: z.string().url().optional(),
  aadhaarScanUrl: z.string().url().optional(),
  licenseScanUrl: z.string().url().optional(),
});

export const checkOutSchema = z.object({
  paymentMethod: z.enum([
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'UPI',
    'BANK_TRANSFER',
    'CORPORATE_CREDIT',
    'LOYALTY_POINTS',
    'OTHER',
  ]),
  paymentAmount: z.number().min(0),
  discountAmount: z.number().min(0).optional(),
  loyaltyRedemption: z.number().min(0).optional(),
  feedbackRating: z.number().int().min(1).max(5).optional(),
  feedbackNotes: z.string().max(2000).optional(),
  splitPayments: z
    .array(
      z.object({
        method: z.string(),
        amount: z.number().min(0),
      }),
    )
    .optional(),
});

export const roomBlockSchema = z.object({
  roomId: z.string().uuid(),
  reason: z.enum([
    'MAINTENANCE',
    'VIP_RESERVATION',
    'DEEP_CLEANING',
    'GOVERNMENT_BOOKING',
    'PRIVATE_EVENT',
    'MANUAL',
  ]),
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export const roomTransferSchema = z.object({
  reservationId: z.string().uuid(),
  toRoomId: z.string().uuid(),
  transferType: z.enum(['UPGRADE', 'DOWNGRADE', 'TRANSFER', 'CHANGE', 'MERGE', 'SPLIT']),
  reason: z.string().max(500).optional(),
  rateAdjustment: z.number().optional(),
});

export const folioChargeSchema = z.object({
  reservationId: z.string().uuid(),
  category: z.enum(['ROOM', 'RESTAURANT', 'LAUNDRY', 'MINI_BAR', 'SPA', 'TRANSPORT', 'TAX', 'DISCOUNT', 'LOYALTY', 'OTHER']),
  description: z.string().min(1).max(255),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().min(0),
  taxAmount: z.number().min(0).optional(),
  sourceRef: z.string().max(100).optional(),
});

export const guestProfileSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  nationality: z.string().max(100).optional().nullable(),
  companyName: z.string().max(255).optional().nullable(),
  gstNumber: z.string().max(50).optional().nullable(),
  passportNumber: z.string().max(50).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  anniversary: z.string().optional().nullable(),
  vipStatus: z.boolean().optional(),
  isCorporate: z.boolean().optional(),
  isBlacklisted: z.boolean().optional(),
  blacklistReason: z.string().max(500).optional().nullable(),
  membershipTier: z.enum(['SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'CORPORATE']).optional().nullable(),
  foodPreferences: z.record(z.unknown()).optional().nullable(),
  preferences: z.record(z.unknown()).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export type CreatePmsReservationSchema = z.infer<typeof createPmsReservationSchema>;
export type UpdatePmsReservationSchema = z.infer<typeof updatePmsReservationSchema>;
export type CheckInStepSchema = z.infer<typeof checkInStepSchema>;
export type CheckOutSchema = z.infer<typeof checkOutSchema>;
export type RoomBlockSchema = z.infer<typeof roomBlockSchema>;
export type RoomTransferSchema = z.infer<typeof roomTransferSchema>;
export type FolioChargeSchema = z.infer<typeof folioChargeSchema>;
export type GuestProfileSchema = z.infer<typeof guestProfileSchema>;
