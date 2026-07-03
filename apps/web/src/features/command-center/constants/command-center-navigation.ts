const BASE = '/command-center';

export const CC_ROUTES = {
  home: '/app/dashboard',
  analytics: '/app/analytics',
  revenue: '/app/analytics/revenue',
  financial: '/app/analytics/financial',
  rooms: '/app/analytics/rooms',
  booking: '/app/analytics/booking',
  crm: '/app/analytics/crm',
  restaurant: '/app/analytics/restaurant',
  banquet: '/app/analytics/banquet',
  inventory: '/app/analytics/inventory',
  procurement: '/app/analytics/procurement',
  maintenance: '/app/analytics/maintenance',
  hr: '/app/analytics/hr',
  corporate: '/app/analytics/corporate',
  travelDesk: '/app/analytics/travel-desk',
  maps: '/app/analytics/maps',
  alerts: '/app/analytics/alerts',
  warRoom: '/app/analytics/war-room',
  investor: '/app/analytics/investor',
  reports: '/app/analytics/reports',
  mobile: '/app/analytics/mobile',
  ai: '/app/ai',
} as const;

export const CC_API = {
  dashboard: `${BASE}/dashboard`,
  warRoom: `${BASE}/war-room`,
  ai: `${BASE}/ai`,
  investor: `${BASE}/investor`,
  pmsOwner: '/pms/dashboard/owner',
} as const;

export const CC_NAV = [
  { label: 'Command Center', href: CC_ROUTES.home },
  { label: 'Revenue', href: CC_ROUTES.revenue },
  { label: 'Financial', href: CC_ROUTES.financial },
  { label: 'Rooms', href: CC_ROUTES.rooms },
  { label: 'Bookings', href: CC_ROUTES.booking },
  { label: 'CRM', href: CC_ROUTES.crm },
  { label: 'Restaurant', href: CC_ROUTES.restaurant },
  { label: 'Banquet', href: CC_ROUTES.banquet },
  { label: 'Inventory', href: CC_ROUTES.inventory },
  { label: 'HR', href: CC_ROUTES.hr },
  { label: 'Corporate', href: CC_ROUTES.corporate },
  { label: 'Travel Desk', href: CC_ROUTES.travelDesk },
  { label: 'War Room', href: CC_ROUTES.warRoom },
  { label: 'Alerts', href: CC_ROUTES.alerts },
  { label: 'Investor', href: CC_ROUTES.investor },
  { label: 'AI Copilot', href: CC_ROUTES.ai },
] as const;

export { BI_DATA_WAREHOUSE_MERMAID } from '@tungaos/shared';

export function isAnalyticsRoute(pathname: string): boolean {
  return pathname === '/app/analytics' || pathname.startsWith('/app/analytics/');
}
