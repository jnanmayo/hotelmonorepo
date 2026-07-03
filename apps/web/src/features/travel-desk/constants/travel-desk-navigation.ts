const BASE = '/travel-desk';

export const TMS_ROUTES = {
  home: '/app/travel-desk',
  requests: '/app/travel-desk/requests',
  dispatch: '/app/travel-desk/dispatch',
  trips: '/app/travel-desk/trips',
  airport: '/app/travel-desk/airport',
  corporate: '/app/travel-desk/corporate',
  shuttle: '/app/travel-desk/shuttle',
  vehicles: '/app/travel-desk/vehicles',
  drivers: '/app/travel-desk/drivers',
  vendors: '/app/travel-desk/vendors',
  fuel: '/app/travel-desk/fuel',
  maintenance: '/app/travel-desk/maintenance',
  gps: '/app/travel-desk/gps',
  billing: '/app/travel-desk/billing',
  calendar: '/app/travel-desk/calendar',
  analytics: '/app/travel-desk/analytics',
  reports: '/app/travel-desk/reports',
  owner: '/app/travel-desk/owner',
  mobile: '/app/travel-desk/mobile',
} as const;

export const TMS_API = {
  dashboard: `${BASE}/dashboard`,
  ownerDashboard: `${BASE}/owner-dashboard`,
  dispatch: `${BASE}/dispatch`,
  analytics: `${BASE}/analytics`,
  seed: `${BASE}/seed`,
  requests: `${BASE}/requests`,
  trips: `${BASE}/trips`,
  tripAssign: (id: string) => `${BASE}/trips/${id}/assign`,
  tripStatus: (id: string) => `${BASE}/trips/${id}/status`,
  airport: `${BASE}/airport-transfers`,
  corporate: `${BASE}/corporate-trips`,
  calendar: `${BASE}/calendar`,
  vehicles: `${BASE}/vehicles`,
  drivers: `${BASE}/drivers`,
  driverDuty: (id: string) => `${BASE}/drivers/${id}/duty`,
  vendors: `${BASE}/vendors`,
  fuel: `${BASE}/fuel`,
  maintenance: `${BASE}/maintenance`,
  billing: `${BASE}/billing`,
  shuttle: `${BASE}/shuttle-routes`,
  gps: `${BASE}/gps`,
  report: (type: string) => `${BASE}/reports/${type}`,
} as const;

export const TMS_NAV = [
  { label: 'Dashboard', href: TMS_ROUTES.home },
  { label: 'Travel Desk', href: TMS_ROUTES.requests },
  { label: 'Dispatch', href: TMS_ROUTES.dispatch },
  { label: 'Trips', href: TMS_ROUTES.trips },
  { label: 'Airport', href: TMS_ROUTES.airport },
  { label: 'Corporate', href: TMS_ROUTES.corporate },
  { label: 'Shuttle', href: TMS_ROUTES.shuttle },
  { label: 'Vehicles', href: TMS_ROUTES.vehicles },
  { label: 'Drivers', href: TMS_ROUTES.drivers },
  { label: 'Vendors', href: TMS_ROUTES.vendors },
  { label: 'Fuel', href: TMS_ROUTES.fuel },
  { label: 'Maintenance', href: TMS_ROUTES.maintenance },
  { label: 'GPS', href: TMS_ROUTES.gps },
  { label: 'Billing', href: TMS_ROUTES.billing },
  { label: 'Calendar', href: TMS_ROUTES.calendar },
  { label: 'Analytics', href: TMS_ROUTES.analytics },
  { label: 'Reports', href: TMS_ROUTES.reports },
  { label: 'Owner', href: TMS_ROUTES.owner },
  { label: 'Mobile', href: TMS_ROUTES.mobile },
] as const;

export function isTravelDeskRoute(pathname: string): boolean {
  return pathname === '/app/travel-desk' || pathname.startsWith('/app/travel-desk/');
}

export { TMS_WORKFLOW_MERMAID } from '@tungaos/shared';
