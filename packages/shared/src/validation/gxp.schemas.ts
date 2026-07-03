import { z } from 'zod';

export const gxpSessionSchema = z.object({
  qrToken: z.string().min(1).optional(),
  reservationCode: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
}).refine(
  (d) => d.qrToken || (d.reservationCode && d.lastName),
  { message: 'Provide qrToken or reservationCode + lastName' },
);

export const gxpCreateRequestSchema = z.object({
  category: z.enum([
    'ROOM_SERVICE', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE',
    'SPA', 'TRANSPORT', 'WAKE_UP', 'CONCIERGE', 'OTHER',
  ]),
  subType: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  scheduledAt: z.string().optional(),
  photoUrls: z.array(z.string().url()).optional(),
});

export const gxpChatMessageSchema = z.object({
  department: z.enum(['RECEPTION', 'RESTAURANT', 'HOUSEKEEPING', 'MAINTENANCE', 'MANAGER']).default('RECEPTION'),
  message: z.string().min(1).max(2000),
});

export const gxpFeedbackSchema = z.object({
  roomRating: z.number().int().min(1).max(5).optional(),
  foodRating: z.number().int().min(1).max(5).optional(),
  staffRating: z.number().int().min(1).max(5).optional(),
  housekeepingRating: z.number().int().min(1).max(5).optional(),
  overallRating: z.number().int().min(1).max(5).optional(),
  comments: z.string().max(5000).optional(),
});

export const gxpFoodOrderSchema = z.object({
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().min(1),
    notes: z.string().optional(),
    customizations: z.record(z.string()).optional(),
  })).min(1),
});

export const gxpCheckoutRequestSchema = z.object({
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'WALLET', 'ROOM_CHARGE']).optional(),
  feedback: gxpFeedbackSchema.optional(),
});

export const gxpOfferSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  offerType: z.string().min(1).max(50),
  discountPct: z.number().min(0).max(100).optional(),
  imageUrl: z.string().url().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const gxpAnnouncementSchema = z.object({
  title: z.string().min(1).max(255),
  body: z.string().min(1),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH']).default('NORMAL'),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export type GxpSessionSchema = z.infer<typeof gxpSessionSchema>;
export type GxpCreateRequestSchema = z.infer<typeof gxpCreateRequestSchema>;
export type GxpChatMessageSchema = z.infer<typeof gxpChatMessageSchema>;
export type GxpFeedbackSchema = z.infer<typeof gxpFeedbackSchema>;
export type GxpFoodOrderSchema = z.infer<typeof gxpFoodOrderSchema>;
export type GxpCheckoutRequestSchema = z.infer<typeof gxpCheckoutRequestSchema>;
export type GxpOfferSchema = z.infer<typeof gxpOfferSchema>;
export type GxpAnnouncementSchema = z.infer<typeof gxpAnnouncementSchema>;
