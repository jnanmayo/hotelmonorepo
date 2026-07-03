import { z } from 'zod';

export const createHkTaskSchema = z.object({
  roomId: z.string().uuid(),
  taskType: z.string().max(50).default('standard'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  assignedStaffId: z.string().uuid().optional(),
  estimatedMinutes: z.number().int().min(1).optional(),
  notes: z.string().optional(),
  scheduledAt: z.string().optional(),
});

export const updateHkTaskStatusSchema = z.object({
  status: z.enum([
    'PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'PAUSED',
    'COMPLETED', 'INSPECTED', 'APPROVED', 'REJECTED', 'REOPENED', 'FAILED', 'CANCELLED',
  ]),
  remarks: z.string().optional(),
});

export const assignHkTaskSchema = z.object({
  staffId: z.string().uuid(),
});

export const completeChecklistItemSchema = z.object({
  itemId: z.string().uuid(),
  isCompleted: z.boolean(),
});

export const hkInspectionSchema = z.object({
  taskId: z.string().uuid(),
  qualityScore: z.number().int().min(0).max(100),
  remarks: z.string().optional(),
  status: z.enum(['APPROVED', 'REJECTED']).default('APPROVED'),
  checklist: z.array(z.object({ name: z.string(), passed: z.boolean() })).optional(),
});

export const createLaundryOrderSchema = z.object({
  roomId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemName: z.string(),
    quantity: z.number().int().min(1),
    rate: z.number().min(0),
    serviceType: z.string().optional(),
  })).min(1),
});

export const updateLaundryStatusSchema = z.object({
  status: z.enum(['COLLECTED', 'IN_PROCESS', 'READY', 'DELIVERED', 'CANCELLED']),
});

export const createLostFoundSchema = z.object({
  itemName: z.string().min(1).max(255),
  description: z.string().optional(),
  roomId: z.string().uuid().optional(),
  guestName: z.string().optional(),
  foundBy: z.string().optional(),
  location: z.string().optional(),
  photoUrl: z.string().optional(),
});

export const amenityRefillSchema = z.object({
  roomId: z.string().uuid(),
  taskId: z.string().uuid().optional(),
  itemName: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

export type CreateHkTaskSchema = z.infer<typeof createHkTaskSchema>;
export type UpdateHkTaskStatusSchema = z.infer<typeof updateHkTaskStatusSchema>;
export type AssignHkTaskSchema = z.infer<typeof assignHkTaskSchema>;
export type HkInspectionSchema = z.infer<typeof hkInspectionSchema>;
export type CreateLaundryOrderSchema = z.infer<typeof createLaundryOrderSchema>;
export type UpdateLaundryStatusSchema = z.infer<typeof updateLaundryStatusSchema>;
export type CreateLostFoundSchema = z.infer<typeof createLostFoundSchema>;
export type AmenityRefillSchema = z.infer<typeof amenityRefillSchema>;
