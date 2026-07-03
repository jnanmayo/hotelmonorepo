const BASE = '/maintenance';

export const EAM_ROUTES = {
  home: '/app/maintenance',
  assets: '/app/maintenance/assets',
  workOrders: '/app/maintenance/work-orders',
  requests: '/app/maintenance/requests',
  preventive: '/app/maintenance/preventive',
  corrective: '/app/maintenance/corrective',
  amc: '/app/maintenance/amc',
  warranty: '/app/maintenance/warranty',
  technicians: '/app/maintenance/technicians',
  parts: '/app/maintenance/parts',
  inspection: '/app/maintenance/inspection',
  safety: '/app/maintenance/safety',
  energy: '/app/maintenance/energy',
  rooms: '/app/maintenance/rooms',
  owner: '/app/maintenance/owner',
  reports: '/app/maintenance/reports',
  analytics: '/app/maintenance/analytics',
  mobile: '/app/maintenance/mobile',
  scanner: '/app/maintenance/scanner',
} as const;

export const EAM_API = {
  dashboard: `${BASE}/dashboard`,
  ownerDashboard: `${BASE}/owner-dashboard`,
  seed: `${BASE}/seed`,
  assets: `${BASE}/assets`,
  asset: (id: string) => `${BASE}/assets/${id}`,
  assetCategories: `${BASE}/asset-categories`,
  requests: `${BASE}/requests`,
  requestReview: (id: string) => `${BASE}/requests/${id}/review`,
  requestWorkOrder: (id: string) => `${BASE}/requests/${id}/work-order`,
  workOrders: `${BASE}/work-orders`,
  woAssign: (id: string) => `${BASE}/work-orders/${id}/assign`,
  woStatus: (id: string) => `${BASE}/work-orders/${id}/status`,
  woParts: (id: string) => `${BASE}/work-orders/${id}/parts`,
  preventive: `${BASE}/preventive`,
  preventiveGenerate: `${BASE}/preventive/generate`,
  amc: `${BASE}/amc`,
  warranty: `${BASE}/warranty`,
  technicians: `${BASE}/technicians`,
  inspections: `${BASE}/inspections`,
  safety: `${BASE}/safety`,
  energy: `${BASE}/energy`,
  analytics: `${BASE}/analytics`,
  report: (type: string) => `${BASE}/reports/${type}`,
} as const;

export const EAM_NAV = [
  { label: 'Dashboard', href: EAM_ROUTES.home },
  { label: 'Assets', href: EAM_ROUTES.assets },
  { label: 'Work Orders', href: EAM_ROUTES.workOrders },
  { label: 'Requests', href: EAM_ROUTES.requests },
  { label: 'Preventive', href: EAM_ROUTES.preventive },
  { label: 'Corrective', href: EAM_ROUTES.corrective },
  { label: 'AMC', href: EAM_ROUTES.amc },
  { label: 'Warranty', href: EAM_ROUTES.warranty },
  { label: 'Technicians', href: EAM_ROUTES.technicians },
  { label: 'Parts', href: EAM_ROUTES.parts },
  { label: 'Inspection', href: EAM_ROUTES.inspection },
  { label: 'Safety', href: EAM_ROUTES.safety },
  { label: 'Energy', href: EAM_ROUTES.energy },
  { label: 'Room Assets', href: EAM_ROUTES.rooms },
  { label: 'Owner View', href: EAM_ROUTES.owner },
  { label: 'Reports', href: EAM_ROUTES.reports },
  { label: 'Analytics', href: EAM_ROUTES.analytics },
  { label: 'Scanner', href: EAM_ROUTES.scanner },
  { label: 'Mobile', href: EAM_ROUTES.mobile },
] as const;

export function isMaintenanceRoute(pathname: string): boolean {
  return pathname === '/app/maintenance' || pathname.startsWith('/app/maintenance/');
}

export const MAINTENANCE_WORKFLOW_MERMAID = `flowchart TD
  A[Asset] --> B[Maintenance Request]
  B --> C[Priority Assignment]
  C --> D[Manager Review]
  D --> E[Technician Assignment]
  E --> F[Work Order Created]
  F --> G[Repair Started]
  G --> H[Parts Requested]
  H --> I[Inventory Updated]
  I --> J[Repair Completed]
  J --> K[Inspection]
  K --> L[Asset Operational]
  L --> M[Maintenance Closed]`;
