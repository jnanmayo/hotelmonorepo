const BASE = '/housekeeping';

export const HK_ROUTES = {
  home: '/app/housekeeping',
  tasks: '/app/housekeeping/tasks',
  mobile: '/app/housekeeping/mobile',
  inspection: '/app/housekeeping/inspection',
  laundry: '/app/housekeeping/laundry',
  linen: '/app/housekeeping/linen',
  lostFound: '/app/housekeeping/lost-found',
  guestRequests: '/app/housekeeping/guest-requests',
  staff: '/app/housekeeping/staff',
  deepCleaning: '/app/housekeeping/deep-cleaning',
  reports: '/app/housekeeping/reports',
  task: (id: string) => `/app/housekeeping/tasks/${id}`,
} as const;

export const HK_API = {
  dashboard: `${BASE}/dashboard`,
  tasks: `${BASE}/tasks`,
  task: (id: string) => `${BASE}/tasks/${id}`,
  assign: (id: string) => `${BASE}/tasks/${id}/assign`,
  autoAssign: (id: string) => `${BASE}/tasks/${id}/auto-assign`,
  taskStatus: (id: string) => `${BASE}/tasks/${id}/status`,
  staff: `${BASE}/staff`,
  inspections: `${BASE}/inspections`,
  laundry: `${BASE}/laundry`,
  laundryStatus: (id: string) => `${BASE}/laundry/${id}/status`,
  linen: `${BASE}/linen`,
  linenSeed: `${BASE}/linen/seed`,
  lostFound: `${BASE}/lost-found`,
  guestRequests: `${BASE}/guest-requests`,
  deepCleaning: `${BASE}/deep-cleaning`,
  amenityRefill: `${BASE}/amenity-refill`,
  report: (type: string) => `${BASE}/reports/${type}`,
} as const;

export const HK_NAV = [
  { label: 'Dashboard', href: HK_ROUTES.home },
  { label: 'Tasks', href: HK_ROUTES.tasks },
  { label: 'Mobile', href: HK_ROUTES.mobile },
  { label: 'Inspection', href: HK_ROUTES.inspection },
  { label: 'Laundry', href: HK_ROUTES.laundry },
  { label: 'Linen', href: HK_ROUTES.linen },
  { label: 'Lost & Found', href: HK_ROUTES.lostFound },
  { label: 'Guest Requests', href: HK_ROUTES.guestRequests },
  { label: 'Staff', href: HK_ROUTES.staff },
  { label: 'Deep Cleaning', href: HK_ROUTES.deepCleaning },
  { label: 'Reports', href: HK_ROUTES.reports },
] as const;

export function isHousekeepingRoute(pathname: string): boolean {
  return pathname === '/app/housekeeping' || pathname.startsWith('/app/housekeeping/');
}
