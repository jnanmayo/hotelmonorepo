const BASE = '/rooms';

export const ROOMS_ROUTES = {
  home: '/app/rooms',
  board: '/app/rooms/board',
  inventory: '/app/rooms/inventory',
  calendar: '/app/rooms/calendar',
  allocation: '/app/rooms/allocation',
  pricing: '/app/rooms/pricing',
  assets: '/app/rooms/assets',
  revenue: '/app/rooms/revenue',
  maintenance: '/app/rooms/maintenance',
  blocks: '/app/rooms/blocks',
  inspection: '/app/rooms/inspection',
  reports: '/app/rooms/reports',
  amenities: '/app/rooms/amenities',
  search: '/app/rooms/search',
  profile: (id: string) => `/app/rooms/${id}`,
} as const;

export const ROOMS_API = {
  dashboard: `${BASE}/dashboard`,
  ownerDashboard: `${BASE}/dashboard/owner`,
  inventory: `${BASE}/inventory`,
  list: `${BASE}`,
  search: `${BASE}/search`,
  profile: (id: string) => `${BASE}/${id}`,
  timeline: (id: string) => `${BASE}/${id}/timeline`,
  status: (id: string) => `${BASE}/${id}/status`,
  revenue: `${BASE}/revenue/stats`,
  roomRevenue: (id: string) => `${BASE}/${id}/revenue`,
  amenities: `${BASE}/amenities`,
  buildings: `${BASE}/buildings`,
  floors: `${BASE}/floors`,
  types: `${BASE}/types`,
  pricingPlans: `${BASE}/pricing/plans`,
  pricingDynamic: `${BASE}/pricing/dynamic`,
  allocationSuggest: `${BASE}/allocation/suggest`,
  allocationAuto: `${BASE}/allocation/auto`,
  blocks: `${BASE}/blocks`,
  maintenance: `${BASE}/maintenance`,
  inspections: `${BASE}/inspections`,
  damages: `${BASE}/damages`,
  assets: `${BASE}/assets/all`,
  roomAssets: (id: string) => `${BASE}/${id}/assets`,
  calendar: `${BASE}/calendar/availability`,
  report: (type: string) => `${BASE}/reports/${type}`,
} as const;

export const ROOMS_NAV = [
  { label: 'Dashboard', href: ROOMS_ROUTES.home },
  { label: 'Status Board', href: ROOMS_ROUTES.board },
  { label: 'Inventory', href: ROOMS_ROUTES.inventory },
  { label: 'Calendar', href: ROOMS_ROUTES.calendar },
  { label: 'Allocation', href: ROOMS_ROUTES.allocation },
  { label: 'Pricing', href: ROOMS_ROUTES.pricing },
  { label: 'Assets', href: ROOMS_ROUTES.assets },
  { label: 'Revenue', href: ROOMS_ROUTES.revenue },
  { label: 'Maintenance', href: ROOMS_ROUTES.maintenance },
  { label: 'Blocks', href: ROOMS_ROUTES.blocks },
  { label: 'Inspection', href: ROOMS_ROUTES.inspection },
  { label: 'Amenities', href: ROOMS_ROUTES.amenities },
  { label: 'Reports', href: ROOMS_ROUTES.reports },
  { label: 'Search', href: ROOMS_ROUTES.search },
] as const;

export function isRoomsRoute(pathname: string): boolean {
  return pathname === '/app/rooms' || pathname.startsWith('/app/rooms/');
}
