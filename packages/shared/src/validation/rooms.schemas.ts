import { z } from 'zod';

export const createBuildingSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20),
  description: z.string().optional(),
});

export const createFloorSchema = z.object({
  buildingId: z.string().uuid(),
  name: z.string().min(1).max(100),
  floorNumber: z.number().int(),
});

export const createRoomTypeSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20),
  description: z.string().optional(),
  baseRate: z.number().min(0).default(0),
  maxOccupancy: z.number().int().min(1).default(2),
  maxAdults: z.number().int().min(1).default(2),
  maxChildren: z.number().int().min(0).default(0),
  sizeSqm: z.number().min(0).optional(),
  bedType: z.string().max(50).optional(),
  viewType: z.string().max(50).optional(),
  amenityIds: z.array(z.string().uuid()).optional(),
});

export const createRoomSchema = z.object({
  floorId: z.string().uuid(),
  roomTypeId: z.string().uuid(),
  roomNumber: z.string().min(1).max(20),
  category: z.enum(['STANDARD', 'DELUXE', 'SUITE', 'VILLA', 'COTTAGE', 'PRESIDENTIAL']).default('STANDARD'),
  isSmoking: z.boolean().default(false),
  isAccessible: z.boolean().default(false),
  notes: z.string().optional(),
});

export const updateRoomStatusSchema = z.object({
  status: z.enum([
    'VACANT_CLEAN', 'VACANT_DIRTY', 'VACANT', 'OCCUPIED', 'RESERVED',
    'DIRTY', 'CLEANING', 'INSPECTED', 'OUT_OF_ORDER', 'OUT_OF_SERVICE',
    'UNDER_MAINTENANCE', 'BLOCKED',
  ]),
  reason: z.string().max(500).optional(),
});

export const roomAllocationSchema = z.object({
  reservationId: z.string().uuid(),
  preferences: z.object({
    floor: z.number().optional(),
    view: z.string().optional(),
    nonSmoking: z.boolean().optional(),
    accessible: z.boolean().optional(),
  }).optional(),
});

export const createAmenitySchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
});

export const createInspectionSchema = z.object({
  roomId: z.string().uuid(),
  qualityScore: z.number().int().min(0).max(100),
  remarks: z.string().optional(),
  checklistItems: z.array(z.object({
    name: z.string(),
    passed: z.boolean(),
  })).optional(),
});

export const createDamageSchema = z.object({
  roomId: z.string().uuid(),
  itemName: z.string().min(1).max(255),
  estimatedCost: z.number().min(0).default(0),
  recoveryAmount: z.number().min(0).default(0),
  responsibleGuestId: z.string().uuid().optional(),
  description: z.string().optional(),
});

export type CreateBuildingSchema = z.infer<typeof createBuildingSchema>;
export type CreateFloorSchema = z.infer<typeof createFloorSchema>;
export type CreateRoomTypeSchema = z.infer<typeof createRoomTypeSchema>;
export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
export type UpdateRoomStatusSchema = z.infer<typeof updateRoomStatusSchema>;
export type RoomAllocationSchema = z.infer<typeof roomAllocationSchema>;
export type CreateAmenitySchema = z.infer<typeof createAmenitySchema>;
export type CreateInspectionSchema = z.infer<typeof createInspectionSchema>;
export type CreateDamageSchema = z.infer<typeof createDamageSchema>;
