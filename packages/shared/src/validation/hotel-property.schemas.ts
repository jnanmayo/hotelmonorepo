import { z } from 'zod';

import { createBuildingSchema, createRoomTypeSchema } from './rooms.schemas.js';

const registerPropertyRoomSchema = z.object({
  roomNumber: z.string().min(1).max(20),
  roomTypeCode: z.string().min(1).max(20),
  category: z.enum(['STANDARD', 'DELUXE', 'SUITE', 'VILLA', 'COTTAGE', 'PRESIDENTIAL']).default('STANDARD'),
  isSmoking: z.boolean().default(false),
  isAccessible: z.boolean().default(false),
  notes: z.string().optional(),
});

const registerPropertyFloorSchema = z.object({
  name: z.string().min(1).max(100),
  floorNumber: z.number().int(),
  rooms: z.array(registerPropertyRoomSchema).min(1),
});

const registerPropertyBuildingSchema = createBuildingSchema.extend({
  floors: z.array(registerPropertyFloorSchema).min(1),
});

export const registerHotelPropertySchema = z.object({
  hotelId: z.string().uuid(),
  roomTypes: z.array(createRoomTypeSchema).min(1),
  buildings: z.array(registerPropertyBuildingSchema).min(1),
});

export type RegisterHotelPropertyInput = z.infer<typeof registerHotelPropertySchema>;
export type RegisterPropertyRoomInput = z.infer<typeof registerPropertyRoomSchema>;
export type RegisterPropertyFloorInput = z.infer<typeof registerPropertyFloorSchema>;
export type RegisterPropertyBuildingInput = z.infer<typeof registerPropertyBuildingSchema>;
