import { notFound } from 'next/navigation';

import {
  CcAlertsPage,
  CcAiPage,
  CcFinancialAnalyticsPage,
  CcGenericModulePage,
  CcInvestorPage,
  CcMapsPage,
  CcMobilePage,
  CcReportsBuilderPage,
  CcRevenueAnalyticsPage,
  CcWarRoomPage,
} from '@/features/command-center/components/cc-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  revenue: () => <CcRevenueAnalyticsPage />,
  financial: () => <CcFinancialAnalyticsPage />,
  rooms: () => <CcGenericModulePage title="Room Analytics" description="Occupancy heatmap, revenue per room, cleaning time" moduleHref="/app/rooms/analytics" moduleLabel="Open Rooms Analytics" />,
  booking: () => <CcGenericModulePage title="Booking Analytics" description="Website, OTA, corporate, walk-in, cancellation funnel" moduleHref="/app/channels" moduleLabel="Open Channel Manager" />,
  crm: () => <CcGenericModulePage title="CRM Analytics" description="Guest LTV, loyalty, campaigns, satisfaction" moduleHref="/app/crm/analytics" moduleLabel="Open CRM Analytics" />,
  restaurant: () => <CcGenericModulePage title="Restaurant Analytics" description="Sales, food cost, top items, peak hours" moduleHref="/app/restaurant/analytics" moduleLabel="Open Restaurant Analytics" />,
  banquet: () => <CcGenericModulePage title="Banquet Analytics" description="Wedding, conference, hall utilization" moduleHref="/app/events/analytics" moduleLabel="Open Events Analytics" />,
  inventory: () => <CcGenericModulePage title="Inventory Analytics" description="Stock value, consumption, waste, dead stock" moduleHref="/app/inventory/analytics" moduleLabel="Open Inventory Analytics" />,
  procurement: () => <CcGenericModulePage title="Procurement Analytics" description="Purchase cost, vendor performance, lead time" moduleHref="/app/procurement/analytics" moduleLabel="Open Procurement Analytics" />,
  maintenance: () => <CcGenericModulePage title="Maintenance Analytics" description="Cost, downtime, asset health" moduleHref="/app/maintenance/analytics" moduleLabel="Open EAM Analytics" />,
  hr: () => <CcGenericModulePage title="HR Analytics" description="Attendance, payroll, attrition, recruitment" moduleHref="/app/hr/analytics" moduleLabel="Open HR Analytics" />,
  corporate: () => <CcGenericModulePage title="Corporate Sales Analytics" description="Revenue, contracts, lead conversion" moduleHref="/app/corporate-sales/analytics" moduleLabel="Open Corporate Sales Analytics" />,
  'travel-desk': () => <CcGenericModulePage title="Travel Desk Analytics" description="Trips, airport transfers, fleet utilization" moduleHref="/app/travel-desk/analytics" moduleLabel="Open Travel Desk Analytics" />,
  maps: () => <CcMapsPage />,
  alerts: () => <CcAlertsPage />,
  'war-room': () => <CcWarRoomPage />,
  investor: () => <CcInvestorPage />,
  reports: () => <CcReportsBuilderPage />,
  mobile: () => <CcMobilePage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Analytics` };
}

export default async function AnalyticsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (!Section) notFound();
  return Section();
}
