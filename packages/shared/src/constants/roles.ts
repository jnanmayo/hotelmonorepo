/**
 * Enterprise role definitions for TungaOS RBAC.
 * Maps to UserRoleType enum in Prisma schema.
 */

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  HOTEL_OWNER: 'HOTEL_OWNER',
  GENERAL_MANAGER: 'GENERAL_MANAGER',
  RECEPTIONIST: 'RECEPTIONIST',
  RESERVATION_EXECUTIVE: 'RESERVATION_TEAM',
  HOUSEKEEPING_MANAGER: 'HOUSEKEEPING',
  HOUSEKEEPING_STAFF: 'HOUSEKEEPING',
  RESTAURANT_MANAGER: 'RESTAURANT_MANAGER',
  CHEF: 'KITCHEN_STAFF',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  CASHIER: 'FINANCE',
  FINANCE_MANAGER: 'FINANCE',
  ACCOUNTANT: 'FINANCE',
  HR_MANAGER: 'HR',
  HR_EXECUTIVE: 'HR',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  PURCHASE_MANAGER: 'STORE_MANAGER',
  MARKETING_TEAM: 'MARKETING',
  MAINTENANCE_MANAGER: 'HOUSEKEEPING',
  SECURITY_STAFF: 'HOUSEKEEPING',
  CORPORATE_CLIENT: 'CORPORATE_CLIENT',
  GUEST: 'GUEST',
  VENDOR: 'VENDOR',
  SYSTEM_API: 'SUPER_ADMIN',
} as const;

export type SystemRoleCode = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  HOTEL_OWNER: 'Hotel Owner',
  GENERAL_MANAGER: 'General Manager',
  RECEPTIONIST: 'Receptionist',
  RESERVATION_TEAM: 'Reservation Executive',
  HOUSEKEEPING: 'Housekeeping',
  RESTAURANT_MANAGER: 'Restaurant Manager',
  KITCHEN_STAFF: 'Kitchen Staff',
  STORE_MANAGER: 'Purchase Manager',
  INVENTORY_MANAGER: 'Inventory Manager',
  FINANCE: 'Finance',
  HR: 'Human Resources',
  MARKETING: 'Marketing',
  CORPORATE_CLIENT: 'Corporate Client',
  GUEST: 'Guest',
  VENDOR: 'Vendor',
};

/** Roles that can access all hotels (platform scope) */
export const PLATFORM_SCOPED_ROLES = ['SUPER_ADMIN'] as const;

/** Roles restricted to a single hotel tenant */
export const HOTEL_SCOPED_ROLES = Object.values(SYSTEM_ROLES).filter(
  (r) => !PLATFORM_SCOPED_ROLES.includes(r as (typeof PLATFORM_SCOPED_ROLES)[number]),
);
