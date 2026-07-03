const BASE = '/restaurant';

export const FNB_ROUTES = {
  home: '/app/restaurant',
  pos: '/app/restaurant/pos',
  tables: '/app/restaurant/tables',
  menu: '/app/restaurant/menu',
  kitchen: '/app/kitchen',
  billing: '/app/restaurant/billing',
  roomService: '/app/restaurant/room-service',
  bar: '/app/restaurant/bar',
  qrMenu: '/app/restaurant/qr-menu',
  waiter: '/app/restaurant/waiter',
  outlets: '/app/restaurant/outlets',
  reports: '/app/restaurant/reports',
  bill: (id: string) => `/app/restaurant/billing/${id}`,
} as const;

export const FNB_API = {
  dashboard: `${BASE}/dashboard`,
  outlets: `${BASE}/outlets`,
  outletsSeed: `${BASE}/outlets/seed`,
  tables: `${BASE}/tables`,
  menu: `${BASE}/menu`,
  bills: `${BASE}/bills`,
  bill: (id: string) => `${BASE}/bills/${id}`,
  billItems: (id: string) => `${BASE}/bills/${id}/items`,
  billClose: (id: string) => `${BASE}/bills/${id}/close`,
  roomService: `${BASE}/room-service`,
  kitchenOrders: `${BASE}/kitchen/orders`,
  kitchenStatus: (id: string) => `${BASE}/kitchen/orders/${id}/status`,
  report: (type: string) => `${BASE}/reports/${type}`,
} as const;

export const FNB_NAV = [
  { label: 'Dashboard', href: FNB_ROUTES.home },
  { label: 'POS', href: FNB_ROUTES.pos },
  { label: 'Tables', href: FNB_ROUTES.tables },
  { label: 'Menu', href: FNB_ROUTES.menu },
  { label: 'Kitchen', href: FNB_ROUTES.kitchen },
  { label: 'Billing', href: FNB_ROUTES.billing },
  { label: 'Room Service', href: FNB_ROUTES.roomService },
  { label: 'Bar', href: FNB_ROUTES.bar },
  { label: 'QR Menu', href: FNB_ROUTES.qrMenu },
  { label: 'Waiter', href: FNB_ROUTES.waiter },
  { label: 'Outlets', href: FNB_ROUTES.outlets },
  { label: 'Reports', href: FNB_ROUTES.reports },
] as const;

export function isRestaurantRoute(pathname: string): boolean {
  return pathname === '/app/restaurant' || pathname.startsWith('/app/restaurant/');
}

export function isKitchenRoute(pathname: string): boolean {
  return pathname === '/app/kitchen' || pathname.startsWith('/app/kitchen/');
}

export const ORDER_FLOW_MERMAID = `flowchart TD
  A[Customer] --> B[Table Selection]
  B --> C[Menu Selection]
  C --> D[Order Created]
  D --> E[Kitchen Display]
  E --> F[Chef Accepts]
  F --> G[Cooking]
  G --> H[Ready]
  H --> I[Waiter Pickup]
  I --> J[Served]
  J --> K[Billing]
  K --> L[Payment]
  L --> M[Invoice]`;

export const ROOM_SERVICE_FLOW_MERMAID = `flowchart TD
  A[Guest] --> B[QR Menu]
  B --> C[Order]
  C --> D[Kitchen]
  D --> E[Prepare]
  E --> F[Deliver]
  F --> G[Charge to Room]
  G --> H[PMS Updated]`;
