import { notFound } from 'next/navigation';

import { RoomProfilePage } from '@/features/rooms/components/room-profile';
import {
  RoomAllocationPage,
  RoomAmenitiesPage,
  RoomAssetsPage,
  RoomBlocksPage,
  RoomCalendarPage,
  RoomInspectionPage,
  RoomMaintenancePage,
  RoomPricingPage,
  RoomReportsPage,
  RoomRevenuePage,
  RoomSearchPage,
} from '@/features/rooms/components/room-sections';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SECTION_PAGES: Record<string, () => React.ReactNode> = {
  calendar: () => <RoomCalendarPage />,
  allocation: () => <RoomAllocationPage />,
  pricing: () => <RoomPricingPage />,
  assets: () => <RoomAssetsPage />,
  revenue: () => <RoomRevenuePage />,
  maintenance: () => <RoomMaintenancePage />,
  blocks: () => <RoomBlocksPage />,
  inspection: () => <RoomInspectionPage />,
  reports: () => <RoomReportsPage />,
  amenities: () => <RoomAmenitiesPage />,
  search: () => <RoomSearchPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (UUID_RE.test(slug)) return { title: 'Room Profile — TungaOS' };
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} — Rooms — TungaOS`,
  };
}

export default async function RoomsSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (UUID_RE.test(slug)) {
    return <RoomProfilePage roomId={slug} />;
  }

  const Section = SECTION_PAGES[slug];
  if (Section) return Section();

  notFound();
}
