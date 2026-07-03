import { z } from 'zod';

export const createEventLeadSchema = z.object({
  clientName: z.string().min(2).max(255),
  company: z.string().max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  eventType: z.string().min(2).max(50),
  source: z.enum([
    'WEBSITE',
    'PHONE',
    'WALK_IN',
    'EMAIL',
    'WHATSAPP',
    'FACEBOOK',
    'INSTAGRAM',
    'GOOGLE_ADS',
    'REFERRAL',
    'TRAVEL_AGENT',
    'CORPORATE_SALES',
    'STORE',
    'OTHER',
  ]).default('PHONE'),
  expectedDate: z.string().optional(),
  expectedGuests: z.number().int().positive().optional(),
  expectedRevenue: z.number().nonnegative().optional(),
  probability: z.number().int().min(0).max(100).optional(),
  preferredHallId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type CreateEventLeadSchema = z.infer<typeof createEventLeadSchema>;

export const updateEventLeadStatusSchema = z.object({
  status: z.enum([
    'NEW',
    'ASSIGNED',
    'VENUE_VISIT',
    'PROPOSAL',
    'QUOTATION',
    'NEGOTIATION',
    'CONFIRMED',
    'ADVANCE_PAID',
    'PLANNING',
    'OPERATIONS',
    'EXECUTION',
    'BILLING',
    'COMPLETED',
    'LOST',
  ]),
});

export type UpdateEventLeadStatusSchema = z.infer<typeof updateEventLeadStatusSchema>;

export const createBanquetHallSchema = z.object({
  hallCode: z.string().min(2).max(30),
  name: z.string().min(2).max(150),
  description: z.string().optional(),
  capacity: z.number().int().positive(),
  minGuests: z.number().int().positive(),
  maxGuests: z.number().int().positive(),
  baseRate: z.number().nonnegative(),
  amenities: z.array(z.string()).optional(),
});

export type CreateBanquetHallSchema = z.infer<typeof createBanquetHallSchema>;

export const createEventQuotationSchema = z.object({
  leadId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  hallId: z.string().uuid().optional(),
  eventDate: z.string().optional(),
  guestCount: z.number().int().nonnegative().default(0),
  lines: z.array(z.object({
    category: z.string(),
    description: z.string(),
    quantity: z.number().positive().default(1),
    unitPrice: z.number().nonnegative(),
  })).min(1),
  discount: z.number().nonnegative().optional(),
  terms: z.string().optional(),
  validUntil: z.string().optional(),
});

export type CreateEventQuotationSchema = z.infer<typeof createEventQuotationSchema>;

export const createEventTaskSchema = z.object({
  eventId: z.string().uuid(),
  category: z.string(),
  title: z.string().min(2).max(255),
  ownerName: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
});

export type CreateEventTaskSchema = z.infer<typeof createEventTaskSchema>;

export const updateEventTaskStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE']),
});

export type UpdateEventTaskStatusSchema = z.infer<typeof updateEventTaskStatusSchema>;
