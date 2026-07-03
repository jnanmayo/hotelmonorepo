import { notFound } from 'next/navigation';

import {
  TmsAirportPage,
  TmsAnalyticsPage,
  TmsBillingPage,
  TmsCalendarPage,
  TmsCorporatePage,
  TmsDispatchPage,
  TmsDriversPage,
  TmsFuelPage,
  TmsGpsPage,
  TmsMaintenancePage,
  TmsMobilePage,
  TmsOwnerPage,
  TmsReportsPage,
  TmsRequestsPage,
  TmsShuttlePage,
  TmsTripsPage,
  TmsVehiclesPage,
  TmsVendorsPage,
} from '@/features/travel-desk/components/tms-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  requests: () => <TmsRequestsPage />,
  dispatch: () => <TmsDispatchPage />,
  trips: () => <TmsTripsPage />,
  airport: () => <TmsAirportPage />,
  corporate: () => <TmsCorporatePage />,
  shuttle: () => <TmsShuttlePage />,
  vehicles: () => <TmsVehiclesPage />,
  drivers: () => <TmsDriversPage />,
  vendors: () => <TmsVendorsPage />,
  fuel: () => <TmsFuelPage />,
  maintenance: () => <TmsMaintenancePage />,
  gps: () => <TmsGpsPage />,
  billing: () => <TmsBillingPage />,
  calendar: () => <TmsCalendarPage />,
  analytics: () => <TmsAnalyticsPage />,
  reports: () => <TmsReportsPage />,
  owner: () => <TmsOwnerPage />,
  mobile: () => <TmsMobilePage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Travel Desk` };
}

export default async function TravelDeskSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (!Section) notFound();
  return Section();
}
