import {
  BarChart3,
  BedDouble,
  Bell,
  Building2,
  Calendar,
  ClipboardList,
  ConciergeBell,
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Sparkles,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

/** Standard module icons for sidebar and navigation */
export const moduleIcons = {
  dashboard: LayoutDashboard,
  reservations: Calendar,
  rooms: BedDouble,
  housekeeping: Sparkles,
  restaurant: UtensilsCrossed,
  inventory: Package,
  finance: CreditCard,
  crm: Users,
  hr: ClipboardList,
  reports: BarChart3,
  settings: Settings,
  hotel: Building2,
  concierge: ConciergeBell,
  documents: FileText,
  notifications: Bell,
} as const satisfies Record<string, LucideIcon>;

export type ModuleIconKey = keyof typeof moduleIcons;

export function getModuleIcon(key: ModuleIconKey): LucideIcon {
  return moduleIcons[key];
}

/** Icon sizing standards */
export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;
