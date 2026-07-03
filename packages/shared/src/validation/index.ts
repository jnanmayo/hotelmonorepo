/**
 * Shared Zod validation schemas.
 * Used by both frontend forms and backend DTO validation.
 */

export * from './common.schemas.js';
export { passwordSchema } from './auth.schemas.js';
export * from './auth.schemas.js';
export * from './booking.schemas.js';
export * from './pms.schemas.js';
export * from './front-desk.schemas.js';
export * from './rooms.schemas.js';
export * from './housekeeping.schemas.js';
export * from './restaurant.schemas.js';
export * from './gxp.schemas.js';
export * from './inventory.schemas.js';
export * from './procurement.schemas.js';
export * from './maintenance.schemas.js';
export * from './finance.schemas.js';
export * from './hr.schemas.js';
export * from './crm.schemas.js';
export * from './events.schemas.js';
export * from './corp-sales.schemas.js';
export * from './travel-desk.schemas.js';
