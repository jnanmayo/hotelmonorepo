/**
 * Consolidated Permission Keys for TungaOS RBAC
 *
 * This file provides type-safe access to all permission strings used across the codebase.
 * Generated from the permission audit - keep in sync with @RequirePermissions decorators.
 *
 * Format: module:resource:action
 */

export const PermissionKeys = {
  // ========== AI ==========
  AI: {
    ASSISTANT: {
      READ: 'ai:assistant:read',
      MANAGE: 'ai:assistant:manage',
    },
  },

  // ========== CHANNEL MANAGER ==========
  // Channel uses existing permissions from other modules

  // ========== CORPORATE SALES ==========
  CORP_SALES: {
    COMPANY: {
      READ: 'corp-sales:company:read',
      MANAGE: 'corp-sales:company:manage',
    },
    LEAD: {
      READ: 'corp-sales:lead:read',
      CREATE: 'corp-sales:lead:create',
      UPDATE: 'corp-sales:lead:update',
    },
    CONTRACT: {
      READ: 'corp-sales:contract:read',
    },
  },

  // ========== CRM ==========
  CRM: {
    LEAD: {
      READ: 'crm:lead:read',
      CREATE: 'crm:lead:create',
      UPDATE: 'crm:lead:update',
      MANAGE: 'crm:lead:manage',
    },
  },

  // ========== DASHBOARD ==========
  DASHBOARD: {
    OVERVIEW: {
      READ: 'dashboard:overview:read',
    },
  },

  // ========== EVENTS ==========
  EVENTS: {
    BOOKING: {
      READ: 'events:booking:read',
      MANAGE: 'events:booking:manage',
    },
    LEAD: {
      READ: 'events:lead:read',
      CREATE: 'events:lead:create',
      UPDATE: 'events:lead:update',
      MANAGE: 'events:lead:manage',
    },
  },

  // ========== FINANCE ==========
  FINANCE: {
    LEDGER: {
      READ: 'finance:ledger:read',
      MANAGE: 'finance:ledger:manage',
    },
    JOURNAL: {
      CREATE: 'finance:journal:create',
      APPROVE: 'finance:journal:approve',
    },
    PAYMENT: {
      APPROVE: 'finance:payment:approve',
    },
    REPORT: {
      READ: 'finance:report:read',
    },
  },

  // ========== FRONT DESK ==========
  FRONT_DESK: {
    OPERATIONS: {
      READ: 'frontdesk:operations:read',
      CREATE: 'frontdesk:operations:create',
      UPDATE: 'frontdesk:operations:update',
    },
  },

  // ========== GXP ==========
  GXP: {
    PORTAL: {
      READ: 'gxp:portal:read',
      CREATE: 'gxp:portal:create',
      UPDATE: 'gxp:portal:update',
      MANAGE: 'gxp:portal:manage',
    },
  },

  // ========== HOUSEKEEPING ==========
  HOUSEKEEPING: {
    TASK: {
      READ: 'housekeeping:task:read',
      CREATE: 'housekeeping:task:create',
      UPDATE: 'housekeeping:task:update',
      MANAGE: 'housekeeping:task:manage',
    },
  },

  // ========== HR / PAYROLL ==========
  HR: {
    EMPLOYEE: {
      READ: 'hr:employee:read',
      MANAGE: 'hr:employee:manage',
    },
    PAYROLL: {
      SALARY: {
        READ: 'payroll:salary:read',
        MANAGE: 'payroll:salary:manage',
      },
    },
  },

  // ========== INVENTORY ==========
  INVENTORY: {
    STOCK: {
      READ: 'inventory:stock:read',
      CREATE: 'inventory:stock:create',
      UPDATE: 'inventory:stock:update',
      APPROVE: 'inventory:stock:approve',
      MANAGE: 'inventory:stock:manage',
    },
  },

  // ========== MAINTENANCE ==========
  MAINTENANCE: {
    ASSET: {
      READ: 'maintenance:asset:read',
      MANAGE: 'maintenance:asset:manage',
    },
    WORKORDER: {
      READ: 'maintenance:workorder:read',
      CREATE: 'maintenance:workorder:create',
      MANAGE: 'maintenance:workorder:manage',
    },
  },

  // ========== PROCUREMENT ==========
  PROCUREMENT: {
    ORDER: {
      READ: 'procurement:order:read',
      CREATE: 'procurement:order:create',
      UPDATE: 'procurement:order:update',
      APPROVE: 'procurement:order:approve',
      MANAGE: 'procurement:order:manage',
    },
    VENDOR: {
      READ: 'procurement:vendor:read',
      MANAGE: 'procurement:vendor:manage',
    },
  },

  // ========== RESERVATIONS (Booking) ==========
  RESERVATIONS: {
    BOOKING: {
      READ: 'reservations:booking:read',
      CREATE: 'reservations:booking:create',
      UPDATE: 'reservations:booking:update',
      MANAGE: 'reservations:booking:manage',
      DELETE: 'reservations:booking:delete',
    },
  },

  // ========== RESTAURANT ==========
  RESTAURANT: {
    ORDER: {
      READ: 'restaurant:order:read',
      CREATE: 'restaurant:order:create',
      UPDATE: 'restaurant:order:update',
      MANAGE: 'restaurant:order:manage',
    },
  },

  // ========== ROOMS ==========
  ROOMS: {
    ROOM: {
      READ: 'rooms:room:read',
      UPDATE: 'rooms:room:update',
      MANAGE: 'rooms:room:manage',
    },
  },

  // ========== REPORTS ==========
  REPORTS: {
    REPORT: {
      READ: 'reports:report:read',
      MANAGE: 'reports:report:manage',
    },
  },

  // ========== SETTINGS ==========
  SETTINGS: {
    CONFIG: {
      READ: 'settings:config:read',
      MANAGE: 'settings:config:manage',
    },
  },

  // ========== TRAVEL DESK ==========
  TRAVEL_DESK: {
    TRIP: {
      READ: 'travel-desk:trip:read',
      CREATE: 'travel-desk:trip:create',
      UPDATE: 'travel-desk:trip:update',
      MANAGE: 'travel-desk:trip:manage',
    },
    DISPATCH: {
      READ: 'travel-desk:dispatch:read',
      MANAGE: 'travel-desk:dispatch:manage',
    },
    REPORT: {
      READ: 'travel-desk:report:read',
    },
    VEHICLE: {
      READ: 'travel-desk:vehicle:read',
      MANAGE: 'travel-desk:vehicle:manage',
    },
    DRIVER: {
      READ: 'travel-desk:driver:read',
      MANAGE: 'travel-desk:driver:manage',
    },
  },

  // ========== USERS ==========
  USERS: {
    USER: {
      READ: 'users:user:read',
      MANAGE: 'users:user:manage',
    },
  },

  // ========== WEBSITE ==========
  WEBSITE: {
    CONTENT: {
      READ: 'website:content:read',
      MANAGE: 'website:content:manage',
    },
  },

  // ========== HOTEL ==========
  HOTEL: {
    PROPERTY: {
      MANAGE: 'hotel:property:manage',
    },
  },
} as const;

// ========== FLATTENED PERMISSION STRINGS (for runtime checks) ==========
export const PERMISSIONS = {
  // AI
  AI_ASSISTANT_READ: PermissionKeys.AI.ASSISTANT.READ,
  AI_ASSISTANT_MANAGE: PermissionKeys.AI.ASSISTANT.MANAGE,

  // CORP SALES
  CORP_SALES_COMPANY_READ: PermissionKeys.CORP_SALES.COMPANY.READ,
  CORP_SALES_COMPANY_MANAGE: PermissionKeys.CORP_SALES.COMPANY.MANAGE,
  CORP_SALES_LEAD_READ: PermissionKeys.CORP_SALES.LEAD.READ,
  CORP_SALES_LEAD_CREATE: PermissionKeys.CORP_SALES.LEAD.CREATE,
  CORP_SALES_LEAD_UPDATE: PermissionKeys.CORP_SALES.LEAD.UPDATE,
  CORP_SALES_CONTRACT_READ: PermissionKeys.CORP_SALES.CONTRACT.READ,

  // CRM
  CRM_LEAD_READ: PermissionKeys.CRM.LEAD.READ,
  CRM_LEAD_CREATE: PermissionKeys.CRM.LEAD.CREATE,
  CRM_LEAD_UPDATE: PermissionKeys.CRM.LEAD.UPDATE,
  CRM_LEAD_MANAGE: PermissionKeys.CRM.LEAD.MANAGE,

  // DASHBOARD
  DASHBOARD_OVERVIEW_READ: PermissionKeys.DASHBOARD.OVERVIEW.READ,

  // EVENTS
  EVENTS_BOOKING_READ: PermissionKeys.EVENTS.BOOKING.READ,
  EVENTS_BOOKING_MANAGE: PermissionKeys.EVENTS.BOOKING.MANAGE,
  EVENTS_LEAD_READ: PermissionKeys.EVENTS.LEAD.READ,
  EVENTS_LEAD_CREATE: PermissionKeys.EVENTS.LEAD.CREATE,
  EVENTS_LEAD_UPDATE: PermissionKeys.EVENTS.LEAD.UPDATE,
  EVENTS_LEAD_MANAGE: PermissionKeys.EVENTS.LEAD.MANAGE,

  // FINANCE
  FINANCE_LEDGER_READ: PermissionKeys.FINANCE.LEDGER.READ,
  FINANCE_LEDGER_MANAGE: PermissionKeys.FINANCE.LEDGER.MANAGE,
  FINANCE_JOURNAL_CREATE: PermissionKeys.FINANCE.JOURNAL.CREATE,
  FINANCE_JOURNAL_APPROVE: PermissionKeys.FINANCE.JOURNAL.APPROVE,
  FINANCE_PAYMENT_APPROVE: PermissionKeys.FINANCE.PAYMENT.APPROVE,
  FINANCE_REPORT_READ: PermissionKeys.FINANCE.REPORT.READ,

  // FRONT DESK
  FRONT_DESK_OPERATIONS_READ: PermissionKeys.FRONT_DESK.OPERATIONS.READ,
  FRONT_DESK_OPERATIONS_CREATE: PermissionKeys.FRONT_DESK.OPERATIONS.CREATE,
  FRONT_DESK_OPERATIONS_UPDATE: PermissionKeys.FRONT_DESK.OPERATIONS.UPDATE,

  // GXP
  GXP_PORTAL_READ: PermissionKeys.GXP.PORTAL.READ,
  GXP_PORTAL_CREATE: PermissionKeys.GXP.PORTAL.CREATE,
  GXP_PORTAL_UPDATE: PermissionKeys.GXP.PORTAL.UPDATE,
  GXP_PORTAL_MANAGE: PermissionKeys.GXP.PORTAL.MANAGE,

  // HOUSEKEEPING
  HOUSEKEEPING_TASK_READ: PermissionKeys.HOUSEKEEPING.TASK.READ,
  HOUSEKEEPING_TASK_CREATE: PermissionKeys.HOUSEKEEPING.TASK.CREATE,
  HOUSEKEEPING_TASK_UPDATE: PermissionKeys.HOUSEKEEPING.TASK.UPDATE,
  HOUSEKEEPING_TASK_MANAGE: PermissionKeys.HOUSEKEEPING.TASK.MANAGE,

  // HR / PAYROLL
  HR_EMPLOYEE_READ: PermissionKeys.HR.EMPLOYEE.READ,
  HR_EMPLOYEE_MANAGE: PermissionKeys.HR.EMPLOYEE.MANAGE,
  PAYROLL_SALARY_READ: PermissionKeys.HR.PAYROLL.SALARY.READ,
  PAYROLL_SALARY_MANAGE: PermissionKeys.HR.PAYROLL.SALARY.MANAGE,

  // INVENTORY
  INVENTORY_STOCK_READ: PermissionKeys.INVENTORY.STOCK.READ,
  INVENTORY_STOCK_CREATE: PermissionKeys.INVENTORY.STOCK.CREATE,
  INVENTORY_STOCK_UPDATE: PermissionKeys.INVENTORY.STOCK.UPDATE,
  INVENTORY_STOCK_APPROVE: PermissionKeys.INVENTORY.STOCK.APPROVE,
  INVENTORY_STOCK_MANAGE: PermissionKeys.INVENTORY.STOCK.MANAGE,

  // MAINTENANCE
  MAINTENANCE_ASSET_READ: PermissionKeys.MAINTENANCE.ASSET.READ,
  MAINTENANCE_ASSET_MANAGE: PermissionKeys.MAINTENANCE.ASSET.MANAGE,
  MAINTENANCE_WORKORDER_READ: PermissionKeys.MAINTENANCE.WORKORDER.READ,
  MAINTENANCE_WORKORDER_CREATE: PermissionKeys.MAINTENANCE.WORKORDER.CREATE,
  MAINTENANCE_WORKORDER_MANAGE: PermissionKeys.MAINTENANCE.WORKORDER.MANAGE,

  // PROCUREMENT
  PROCUREMENT_ORDER_READ: PermissionKeys.PROCUREMENT.ORDER.READ,
  PROCUREMENT_ORDER_CREATE: PermissionKeys.PROCUREMENT.ORDER.CREATE,
  PROCUREMENT_ORDER_UPDATE: PermissionKeys.PROCUREMENT.ORDER.UPDATE,
  PROCUREMENT_ORDER_APPROVE: PermissionKeys.PROCUREMENT.ORDER.APPROVE,
  PROCUREMENT_ORDER_MANAGE: PermissionKeys.PROCUREMENT.ORDER.MANAGE,
  PROCUREMENT_VENDOR_READ: PermissionKeys.PROCUREMENT.VENDOR.READ,
  PROCUREMENT_VENDOR_MANAGE: PermissionKeys.PROCUREMENT.VENDOR.MANAGE,

  // RESERVATIONS
  RESERVATIONS_BOOKING_READ: PermissionKeys.RESERVATIONS.BOOKING.READ,
  RESERVATIONS_BOOKING_CREATE: PermissionKeys.RESERVATIONS.BOOKING.CREATE,
  RESERVATIONS_BOOKING_UPDATE: PermissionKeys.RESERVATIONS.BOOKING.UPDATE,
  RESERVATIONS_BOOKING_MANAGE: PermissionKeys.RESERVATIONS.BOOKING.MANAGE,
  RESERVATIONS_BOOKING_DELETE: PermissionKeys.RESERVATIONS.BOOKING.DELETE,

  // RESTAURANT
  RESTAURANT_ORDER_READ: PermissionKeys.RESTAURANT.ORDER.READ,
  RESTAURANT_ORDER_CREATE: PermissionKeys.RESTAURANT.ORDER.CREATE,
  RESTAURANT_ORDER_UPDATE: PermissionKeys.RESTAURANT.ORDER.UPDATE,
  RESTAURANT_ORDER_MANAGE: PermissionKeys.RESTAURANT.ORDER.MANAGE,

  // ROOMS
  ROOMS_ROOM_READ: PermissionKeys.ROOMS.ROOM.READ,
  ROOMS_ROOM_UPDATE: PermissionKeys.ROOMS.ROOM.UPDATE,
  ROOMS_ROOM_MANAGE: PermissionKeys.ROOMS.ROOM.MANAGE,

  // REPORTS
  REPORTS_REPORT_READ: PermissionKeys.REPORTS.REPORT.READ,
  REPORTS_REPORT_MANAGE: PermissionKeys.REPORTS.REPORT.MANAGE,

  // SETTINGS
  SETTINGS_CONFIG_READ: PermissionKeys.SETTINGS.CONFIG.READ,
  SETTINGS_CONFIG_MANAGE: PermissionKeys.SETTINGS.CONFIG.MANAGE,

  // TRAVEL DESK
  TRAVEL_DESK_TRIP_READ: PermissionKeys.TRAVEL_DESK.TRIP.READ,
  TRAVEL_DESK_TRIP_CREATE: PermissionKeys.TRAVEL_DESK.TRIP.CREATE,
  TRAVEL_DESK_TRIP_UPDATE: PermissionKeys.TRAVEL_DESK.TRIP.UPDATE,
  TRAVEL_DESK_TRIP_MANAGE: PermissionKeys.TRAVEL_DESK.TRIP.MANAGE,
  TRAVEL_DESK_DISPATCH_READ: PermissionKeys.TRAVEL_DESK.DISPATCH.READ,
  TRAVEL_DESK_DISPATCH_MANAGE: PermissionKeys.TRAVEL_DESK.DISPATCH.MANAGE,
  TRAVEL_DESK_REPORT_READ: PermissionKeys.TRAVEL_DESK.REPORT.READ,
  TRAVEL_DESK_VEHICLE_READ: PermissionKeys.TRAVEL_DESK.VEHICLE.READ,
  TRAVEL_DESK_VEHICLE_MANAGE: PermissionKeys.TRAVEL_DESK.VEHICLE.MANAGE,
  TRAVEL_DESK_DRIVER_READ: PermissionKeys.TRAVEL_DESK.DRIVER.READ,
  TRAVEL_DESK_DRIVER_MANAGE: PermissionKeys.TRAVEL_DESK.DRIVER.MANAGE,

  // USERS
  USERS_USER_READ: PermissionKeys.USERS.USER.READ,
  USERS_USER_MANAGE: PermissionKeys.USERS.USER.MANAGE,

  // WEBSITE
  WEBSITE_CONTENT_READ: PermissionKeys.WEBSITE.CONTENT.READ,
  WEBSITE_CONTENT_MANAGE: PermissionKeys.WEBSITE.CONTENT.MANAGE,

  // HOTEL
  HOTEL_PROPERTY_MANAGE: PermissionKeys.HOTEL.PROPERTY.MANAGE,
} as const;

// ========== TYPE DEFINITIONS ==========
export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type ModulePermissionKeys = {
  [K in keyof typeof PermissionKeys]: K extends string
    ? {
        [R in keyof (typeof PermissionKeys)[K]]: R extends string
          ? {
              [A in keyof (typeof PermissionKeys)[K][R]]: (typeof PermissionKeys)[K][R][A];
            }
          : never;
      }
    : never;
};

export type AllPermissionActions =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'export'
  | 'import'
  | 'print'
  | 'manage';

export type AllModules =
  | 'ai'
  | 'channel'
  | 'corp-sales'
  | 'crm'
  | 'dashboard'
  | 'events'
  | 'finance'
  | 'frontdesk'
  | 'gxp'
  | 'housekeeping'
  | 'hr'
  | 'inventory'
  | 'maintenance'
  | 'procurement'
  | 'reservations'
  | 'restaurant'
  | 'rooms'
  | 'reports'
  | 'settings'
  | 'travel-desk'
  | 'users'
  | 'website'
  | 'hotel'
  | 'payroll';

// ========== PERMISSION GROUPINGS (for role-based assignment) ==========
export const PERMISSION_GROUPS = {
  // Menu visibility permissions (read-only access to module dashboards)
  MENU: [
    PERMISSIONS.DASHBOARD_OVERVIEW_READ,
    PERMISSIONS.FRONT_DESK_OPERATIONS_READ,
    PERMISSIONS.RESERVATIONS_BOOKING_READ,
    PERMISSIONS.ROOMS_ROOM_READ,
    PERMISSIONS.HOUSEKEEPING_TASK_READ,
    PERMISSIONS.RESTAURANT_ORDER_READ,
    PERMISSIONS.GXP_PORTAL_READ,
    PERMISSIONS.FINANCE_LEDGER_READ,
    PERMISSIONS.INVENTORY_STOCK_READ,
    PERMISSIONS.PROCUREMENT_ORDER_READ,
    PERMISSIONS.MAINTENANCE_ASSET_READ,
    PERMISSIONS.PAYROLL_SALARY_READ,
    PERMISSIONS.CRM_LEAD_READ,
    PERMISSIONS.EVENTS_BOOKING_READ,
    PERMISSIONS.CORP_SALES_COMPANY_READ,
    PERMISSIONS.TRAVEL_DESK_TRIP_READ,
    PERMISSIONS.REPORTS_REPORT_READ,
    PERMISSIONS.SETTINGS_CONFIG_READ,
    PERMISSIONS.WEBSITE_CONTENT_READ,
  ] as PermissionKey[],

  // Management-level permissions (full CRUD + manage)
  MANAGEMENT: [
    PERMISSIONS.USERS_USER_MANAGE,
    PERMISSIONS.HOTEL_PROPERTY_MANAGE,
    PERMISSIONS.FINANCE_LEDGER_MANAGE,
    PERMISSIONS.PAYROLL_SALARY_MANAGE,
    PERMISSIONS.INVENTORY_STOCK_MANAGE,
    PERMISSIONS.PROCUREMENT_ORDER_MANAGE,
    PERMISSIONS.MAINTENANCE_ASSET_MANAGE,
    PERMISSIONS.HR_EMPLOYEE_MANAGE,
    PERMISSIONS.CRM_LEAD_MANAGE,
    PERMISSIONS.EVENTS_BOOKING_MANAGE,
    PERMISSIONS.CORP_SALES_COMPANY_MANAGE,
    PERMISSIONS.TRAVEL_DESK_TRIP_MANAGE,
    PERMISSIONS.RESERVATIONS_BOOKING_MANAGE,
    PERMISSIONS.ROOMS_ROOM_MANAGE,
    PERMISSIONS.REPORTS_REPORT_MANAGE,
    PERMISSIONS.SETTINGS_CONFIG_MANAGE,
    PERMISSIONS.WEBSITE_CONTENT_MANAGE,
    PERMISSIONS.AI_ASSISTANT_MANAGE,
    PERMISSIONS.GXP_PORTAL_MANAGE,
  ] as PermissionKey[],

  // All permissions (flattened)
  ALL: Object.values(PERMISSIONS) as PermissionKey[],
} as const;

// ========== PRE-COMPUTED SETS FOR FAST LOOKUPS ==========
const PERMISSIONS_ALL = Object.values(PERMISSIONS) as PermissionKey[];
const PERMISSIONS_ALL_SET = new Set<PermissionKey>(PERMISSIONS_ALL);

// ========== HELPER FUNCTIONS ==========
export function isValidPermissionKey(key: string): key is PermissionKey {
  return PERMISSIONS_ALL_SET.has(key as PermissionKey);
}

export function getPermissionsByModule(module: AllModules): PermissionKey[] {
  const prefix = `${module}:`;
  return PERMISSIONS_ALL.filter((p) => p.startsWith(prefix));
}

export function getPermissionsByAction(action: AllPermissionActions): PermissionKey[] {
  const suffix = `:${action}`;
  return PERMISSIONS_ALL.filter((p) => p.endsWith(suffix));
}
