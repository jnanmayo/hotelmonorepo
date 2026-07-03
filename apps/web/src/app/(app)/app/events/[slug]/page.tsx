import { notFound } from 'next/navigation';

import {
  EventsAiPage,
  EventsBookingsPage,
  EventsCalendarPage,
  EventsChecklistsPage,
  EventsClientsPage,
  EventsContractsPage,
  EventsHallsPage,
  EventsLeadsPage,
  EventsMenusPage,
  EventsMobilePage,
  EventsOperationsPage,
  EventsOwnerPage,
  EventsPackagesPage,
  EventsPaymentsPage,
  EventsQuotationsPage,
  EventsReportsPage,
  EventsResourcesPage,
  EventsRoomBlocksPage,
  EventsSeatingPage,
  EventsTasksPage,
  EventsTimelinePage,
  EventsVendorsPage,
} from '@/features/events/components/events-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  leads: () => <EventsLeadsPage />,
  clients: () => <EventsClientsPage />,
  halls: () => <EventsHallsPage />,
  calendar: () => <EventsCalendarPage />,
  bookings: () => <EventsBookingsPage />,
  quotations: () => <EventsQuotationsPage />,
  packages: () => <EventsPackagesPage />,
  menus: () => <EventsMenusPage />,
  seating: () => <EventsSeatingPage />,
  tasks: () => <EventsTasksPage />,
  resources: () => <EventsResourcesPage />,
  'room-blocks': () => <EventsRoomBlocksPage />,
  payments: () => <EventsPaymentsPage />,
  contracts: () => <EventsContractsPage />,
  vendors: () => <EventsVendorsPage />,
  checklists: () => <EventsChecklistsPage />,
  timeline: () => <EventsTimelinePage />,
  operations: () => <EventsOperationsPage />,
  owner: () => <EventsOwnerPage />,
  reports: () => <EventsReportsPage />,
  mobile: () => <EventsMobilePage />,
  ai: () => <EventsAiPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Events` };
}

export default async function EventsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
