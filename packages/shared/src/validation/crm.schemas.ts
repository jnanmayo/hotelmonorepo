import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  estimatedValue: z.number().optional(),
  notes: z.string().optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']),
});

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().min(1).max(50),
  channel: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  budget: z.number().optional(),
  content: z.string().optional(),
});

export const createCouponSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_NIGHT', 'FREE_SERVICE', 'BUNDLE']),
  value: z.number().positive(),
  maxUses: z.number().int().optional(),
  minAmount: z.number().optional(),
});

export const createGiftCardSchema = z.object({
  code: z.string().min(1).max(50),
  initialValue: z.number().positive(),
  guestId: z.string().uuid().optional(),
  isDigital: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

export const createReferralSchema = z.object({
  referrerGuestId: z.string().uuid(),
  referredEmail: z.string().email(),
  referredName: z.string().optional(),
});

export const adjustLoyaltyPointsSchema = z.object({
  guestId: z.string().uuid(),
  points: z.number(),
  type: z.enum(['EARN', 'REDEEM', 'ADJUSTMENT', 'EXPIRE', 'BONUS', 'TRANSFER']),
  description: z.string().optional(),
});

export type CreateLeadSchema = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusSchema = z.infer<typeof updateLeadStatusSchema>;
export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;
export type CreateCouponSchema = z.infer<typeof createCouponSchema>;
export type CreateGiftCardSchema = z.infer<typeof createGiftCardSchema>;
export type CreateReferralSchema = z.infer<typeof createReferralSchema>;
export type AdjustLoyaltyPointsSchema = z.infer<typeof adjustLoyaltyPointsSchema>;
