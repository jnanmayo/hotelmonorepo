import { z } from 'zod';

export const createCorpSalesLeadSchema = z.object({
  companyName: z.string().min(2).max(255),
  industry: z.string().max(100).optional(),
  contactName: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  source: z.enum([
    'WEBSITE', 'COLD_CALLING', 'LINKEDIN', 'REFERRAL', 'EMAIL_CAMPAIGN',
    'TRADE_SHOW', 'CONFERENCE', 'WALK_IN', 'GOOGLE_ADS', 'PARTNER', 'OTHER',
  ]).default('WEBSITE'),
  expectedRevenue: z.number().nonnegative().optional(),
  expectedRoomNights: z.number().int().positive().optional(),
  decisionMaker: z.string().max(200).optional(),
  probability: z.number().int().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export type CreateCorpSalesLeadSchema = z.infer<typeof createCorpSalesLeadSchema>;

export const updateCorpSalesLeadStatusSchema = z.object({
  status: z.enum([
    'NEW', 'QUALIFIED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION',
    'LEGAL_REVIEW', 'CONTRACT_DRAFT', 'APPROVED', 'WON', 'LOST', 'RENEWAL',
  ]),
});

export type UpdateCorpSalesLeadStatusSchema = z.infer<typeof updateCorpSalesLeadStatusSchema>;

export const createCorpCompanySchema = z.object({
  code: z.string().min(2).max(50),
  name: z.string().min(2).max(255),
  industry: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  gstNumber: z.string().max(50).optional(),
  panNumber: z.string().max(20).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  website: z.string().max(500).optional(),
  creditLimit: z.number().nonnegative().optional(),
  paymentTerms: z.string().max(100).optional(),
});

export type CreateCorpCompanySchema = z.infer<typeof createCorpCompanySchema>;

export const createCorpMeetingSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(2).max(255),
  meetingDate: z.string(),
  agenda: z.string().optional(),
  followUpDate: z.string().optional(),
});

export type CreateCorpMeetingSchema = z.infer<typeof createCorpMeetingSchema>;
