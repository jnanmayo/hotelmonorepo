import { z } from 'zod';

export const createLeaveRequestSchema = z.object({
  staffId: z.string().uuid(),
  leaveType: z.string().min(1).max(50),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional(),
});

export const approveLeaveSchema = z.object({
  approved: z.boolean(),
});

export const createShiftSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'SPLIT', 'FLEXIBLE', 'ON_CALL']),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const assignRosterSchema = z.object({
  staffId: z.string().uuid(),
  shiftId: z.string().uuid(),
  date: z.string(),
});

export const createJobOpeningSchema = z.object({
  title: z.string().min(1).max(200),
  departmentId: z.string().uuid().optional(),
  designationId: z.string().uuid().optional(),
  openings: z.number().int().min(1).default(1),
  description: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
});

export const createCandidateSchema = z.object({
  jobOpeningId: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional(),
});

export const scheduleInterviewSchema = z.object({
  candidateId: z.string().uuid(),
  scheduledAt: z.string(),
  interviewer: z.string().optional(),
  round: z.number().int().min(1).default(1),
});

export const createPayrollRunSchema = z.object({
  periodStart: z.string(),
  periodEnd: z.string(),
});

export const createExpenseClaimSchema = z.object({
  staffId: z.string().uuid(),
  category: z.string().min(1).max(50),
  amount: z.number().positive(),
  description: z.string().optional(),
});

export type CreateLeaveRequestSchema = z.infer<typeof createLeaveRequestSchema>;
export type ApproveLeaveSchema = z.infer<typeof approveLeaveSchema>;
export type CreateShiftSchema = z.infer<typeof createShiftSchema>;
export type AssignRosterSchema = z.infer<typeof assignRosterSchema>;
export type CreateJobOpeningSchema = z.infer<typeof createJobOpeningSchema>;
export type CreateCandidateSchema = z.infer<typeof createCandidateSchema>;
export type ScheduleInterviewSchema = z.infer<typeof scheduleInterviewSchema>;
export type CreatePayrollRunSchema = z.infer<typeof createPayrollRunSchema>;
export type CreateExpenseClaimSchema = z.infer<typeof createExpenseClaimSchema>;
