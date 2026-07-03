/**
 * Shared TypeScript types and interfaces.
 * Domain entities are defined in backend; DTO shapes shared here.
 */

/** Branded type for hotel tenant identifier */
export type HotelId = string & { readonly __brand: 'HotelId' };

/** Branded type for user identifier */
export type UserId = string & { readonly __brand: 'UserId' };

/** Standard API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/** Standard paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Standard API error shape */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}

/** JWT payload claims shared between frontend and backend */
export interface JwtPayload {
  sub: UserId;
  email: string;
  hotelId: HotelId | null;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export * from './auth.types.js';
export * from './booking.types.js';
export * from './pms.types.js';
export * from './front-desk.types.js';
export * from './rooms.types.js';
export * from './housekeeping.types.js';
export * from './restaurant.types.js';
export * from './gxp.types.js';
export * from './inventory.types.js';
export * from './procurement.types.js';
export * from './maintenance.types.js';
export * from './finance.types.js';
export * from './hr.types.js';
export * from './crm.types.js';
export * from './events.types.js';
export * from './corp-sales.types.js';
export * from './travel-desk.types.js';
export * from './command-center.types.js';

/** Tenant branding configuration injected at runtime */
export interface TenantBranding {
  hotelId: HotelId;
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontHeading: string;
  fontBody: string;
}
