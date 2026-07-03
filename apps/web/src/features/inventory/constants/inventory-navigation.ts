const BASE = '/inventory';

export const INV_ROUTES = {
  home: '/app/inventory',
  stores: '/app/inventory/stores',
  items: '/app/inventory/items',
  stock: '/app/inventory/stock',
  movements: '/app/inventory/movements',
  issues: '/app/inventory/issues',
  transfers: '/app/inventory/transfers',
  consumption: '/app/inventory/consumption',
  batches: '/app/inventory/batches',
  expiry: '/app/inventory/expiry',
  adjustments: '/app/inventory/adjustments',
  audits: '/app/inventory/audits',
  purchaseRequests: '/app/inventory/purchase-requests',
  scanner: '/app/inventory/scanner',
  mobile: '/app/inventory/mobile',
  reports: '/app/inventory/reports',
  analytics: '/app/inventory/analytics',
} as const;

export const INV_API = {
  dashboard: `${BASE}/dashboard`,
  seed: `${BASE}/seed`,
  stores: `${BASE}/stores`,
  categories: `${BASE}/categories`,
  units: `${BASE}/units`,
  items: `${BASE}/items`,
  item: (id: string) => `${BASE}/items/${id}`,
  stock: `${BASE}/stock`,
  movements: `${BASE}/movements`,
  transfers: `${BASE}/transfers`,
  transferApprove: (id: string) => `${BASE}/transfers/${id}/approve`,
  issues: `${BASE}/issues`,
  issueApprove: (id: string) => `${BASE}/issues/${id}/approve`,
  consumptions: `${BASE}/consumptions`,
  batches: `${BASE}/batches`,
  expiry: `${BASE}/expiry`,
  adjustments: `${BASE}/adjustments`,
  adjustmentApprove: (id: string) => `${BASE}/adjustments/${id}/approve`,
  audits: `${BASE}/audits`,
  auditComplete: (id: string) => `${BASE}/audits/${id}/complete`,
  purchaseRequests: `${BASE}/purchase-requests`,
  purchaseRequestApprove: (id: string, level: string) => `${BASE}/purchase-requests/${id}/approve?level=${level}`,
  autoReorder: `${BASE}/auto-reorder`,
  report: (type: string) => `${BASE}/reports/${type}`,
  analytics: `${BASE}/analytics`,
  barcode: (code: string) => `${BASE}/barcode/${encodeURIComponent(code)}`,
} as const;

export const INV_NAV = [
  { label: 'Dashboard', href: INV_ROUTES.home },
  { label: 'Stores', href: INV_ROUTES.stores },
  { label: 'Items', href: INV_ROUTES.items },
  { label: 'Stock', href: INV_ROUTES.stock },
  { label: 'Movements', href: INV_ROUTES.movements },
  { label: 'Issues', href: INV_ROUTES.issues },
  { label: 'Transfers', href: INV_ROUTES.transfers },
  { label: 'Consumption', href: INV_ROUTES.consumption },
  { label: 'Batches', href: INV_ROUTES.batches },
  { label: 'Expiry', href: INV_ROUTES.expiry },
  { label: 'Adjustments', href: INV_ROUTES.adjustments },
  { label: 'Audits', href: INV_ROUTES.audits },
  { label: 'Purchase Requests', href: INV_ROUTES.purchaseRequests },
  { label: 'Scanner', href: INV_ROUTES.scanner },
  { label: 'Mobile', href: INV_ROUTES.mobile },
  { label: 'Reports', href: INV_ROUTES.reports },
  { label: 'Analytics', href: INV_ROUTES.analytics },
] as const;

export function isInventoryRoute(pathname: string): boolean {
  return pathname === '/app/inventory' || pathname.startsWith('/app/inventory/');
}
