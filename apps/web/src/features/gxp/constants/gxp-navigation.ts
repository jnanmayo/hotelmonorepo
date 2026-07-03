const PUBLIC_BASE = '/public/gxp';
const ADMIN_BASE = '/gxp';

import type { Route } from 'next';

export const GXP_STAY_ROUTES = {
  scan: '/stay/scan' as Route,
  home: (token: string): Route => `/stay/${token}` as Route,
  section: (token: string, slug: string): Route => `/stay/${token}/${slug}` as Route,
} as const;

export const GXP_PUBLIC_API = {
  session: `${PUBLIC_BASE}/session`,
  validate: `${PUBLIC_BASE}/session/validate`,
  dashboard: `${PUBLIC_BASE}/dashboard`,
  room: `${PUBLIC_BASE}/room`,
  requests: `${PUBLIC_BASE}/requests`,
  folio: `${PUBLIC_BASE}/folio`,
  checkout: `${PUBLIC_BASE}/checkout`,
  menu: `${PUBLIC_BASE}/menu`,
  orders: `${PUBLIC_BASE}/orders`,
  chat: `${PUBLIC_BASE}/chat`,
} as const;

export const GXP_ADMIN_ROUTES = {
  home: '/app/gxp',
  qrCodes: '/app/gxp/qr-codes',
  requests: '/app/gxp/requests',
  offers: '/app/gxp/offers',
  announcements: '/app/gxp/announcements',
  reports: '/app/gxp/reports',
} as const;

export const GXP_ADMIN_API = {
  dashboard: `${ADMIN_BASE}/dashboard`,
  qrCodes: `${ADMIN_BASE}/qr-codes`,
  qrGenerate: `${ADMIN_BASE}/qr-codes/generate`,
  seed: `${ADMIN_BASE}/seed`,
  requests: `${ADMIN_BASE}/requests`,
  requestStatus: (id: string) => `${ADMIN_BASE}/requests/${id}/status`,
  offers: `${ADMIN_BASE}/offers`,
  announcements: `${ADMIN_BASE}/announcements`,
} as const;

export const GXP_ADMIN_NAV = [
  { label: 'Dashboard', href: GXP_ADMIN_ROUTES.home },
  { label: 'QR Codes', href: GXP_ADMIN_ROUTES.qrCodes },
  { label: 'Requests', href: GXP_ADMIN_ROUTES.requests },
  { label: 'Offers', href: GXP_ADMIN_ROUTES.offers },
  { label: 'Announcements', href: GXP_ADMIN_ROUTES.announcements },
  { label: 'Reports', href: GXP_ADMIN_ROUTES.reports },
] as const;

export const GXP_GUEST_NAV = [
  { label: 'Home', slug: '' },
  { label: 'Room', slug: 'room' },
  { label: 'Dining', slug: 'dining' },
  { label: 'Concierge', slug: 'concierge' },
  { label: 'Bill', slug: 'folio' },
  { label: 'Chat', slug: 'chat' },
  { label: 'Checkout', slug: 'checkout' },
] as const;

export const GXP_SESSION_KEY = 'tungaos-gxp-session';

export const GXP_SESSION_HEADER = 'x-guest-session';
