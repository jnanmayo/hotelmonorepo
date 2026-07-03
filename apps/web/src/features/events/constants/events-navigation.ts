const BASE = '/events';

export const EVENTS_ROUTES = {
  home: '/app/events',
  leads: '/app/events/leads',
  clients: '/app/events/clients',
  halls: '/app/events/halls',
  calendar: '/app/events/calendar',
  bookings: '/app/events/bookings',
  quotations: '/app/events/quotations',
  packages: '/app/events/packages',
  menus: '/app/events/menus',
  seating: '/app/events/seating',
  tasks: '/app/events/tasks',
  resources: '/app/events/resources',
  roomBlocks: '/app/events/room-blocks',
  payments: '/app/events/payments',
  contracts: '/app/events/contracts',
  vendors: '/app/events/vendors',
  checklists: '/app/events/checklists',
  timeline: '/app/events/timeline',
  operations: '/app/events/operations',
  owner: '/app/events/owner',
  reports: '/app/events/reports',
  mobile: '/app/events/mobile',
  ai: '/app/events/ai',
} as const;

export const EVENTS_API = {
  dashboard: `${BASE}/dashboard`,
  ownerDashboard: `${BASE}/owner-dashboard`,
  operationsDashboard: `${BASE}/operations-dashboard`,
  seed: `${BASE}/seed`,
  leads: `${BASE}/leads`,
  leadStatus: (id: string) => `${BASE}/leads/${id}/status`,
  clients: `${BASE}/clients`,
  halls: `${BASE}/halls`,
  calendar: `${BASE}/calendar`,
  bookings: `${BASE}/bookings`,
  quotations: `${BASE}/quotations`,
  packages: `${BASE}/packages`,
  menus: `${BASE}/menus`,
  seating: `${BASE}/seating`,
  tasks: `${BASE}/tasks`,
  taskStatus: (id: string) => `${BASE}/tasks/${id}/status`,
  resources: `${BASE}/resources`,
  roomBlocks: `${BASE}/room-blocks`,
  payments: `${BASE}/payments`,
  contracts: `${BASE}/contracts`,
  vendors: `${BASE}/vendors`,
  checklists: `${BASE}/checklists`,
  timeline: `${BASE}/timeline`,
  report: (type: string) => `${BASE}/reports/${type}`,
} as const;

export const EVENTS_NAV = [
  { label: 'Dashboard', href: EVENTS_ROUTES.home },
  { label: 'Leads', href: EVENTS_ROUTES.leads },
  { label: 'Clients', href: EVENTS_ROUTES.clients },
  { label: 'Halls', href: EVENTS_ROUTES.halls },
  { label: 'Calendar', href: EVENTS_ROUTES.calendar },
  { label: 'Bookings', href: EVENTS_ROUTES.bookings },
  { label: 'Quotations', href: EVENTS_ROUTES.quotations },
  { label: 'Packages', href: EVENTS_ROUTES.packages },
  { label: 'Menus', href: EVENTS_ROUTES.menus },
  { label: 'Seating', href: EVENTS_ROUTES.seating },
  { label: 'Tasks', href: EVENTS_ROUTES.tasks },
  { label: 'Resources', href: EVENTS_ROUTES.resources },
  { label: 'Room Blocks', href: EVENTS_ROUTES.roomBlocks },
  { label: 'Payments', href: EVENTS_ROUTES.payments },
  { label: 'Contracts', href: EVENTS_ROUTES.contracts },
  { label: 'Vendors', href: EVENTS_ROUTES.vendors },
  { label: 'Checklists', href: EVENTS_ROUTES.checklists },
  { label: 'Timeline', href: EVENTS_ROUTES.timeline },
  { label: 'Operations', href: EVENTS_ROUTES.operations },
  { label: 'Owner', href: EVENTS_ROUTES.owner },
  { label: 'Reports', href: EVENTS_ROUTES.reports },
  { label: 'Mobile', href: EVENTS_ROUTES.mobile },
  { label: 'AI', href: EVENTS_ROUTES.ai },
] as const;

export function isEventsRoute(pathname: string): boolean {
  return pathname === '/app/events' || pathname.startsWith('/app/events/');
}
