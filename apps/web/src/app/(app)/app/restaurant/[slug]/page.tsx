import { notFound } from 'next/navigation';

import {
  FnbBarPage,
  FnbBillingPage,
  FnbMenuPage,
  FnbOutletsPage,
  FnbPosPage,
  FnbQrMenuPage,
  FnbReportsPage,
  FnbRoomServicePage,
  FnbTablesPage,
  FnbWaiterPage,
} from '@/features/restaurant/components/fnb-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  pos: () => <FnbPosPage />,
  tables: () => <FnbTablesPage />,
  menu: () => <FnbMenuPage />,
  billing: () => <FnbBillingPage />,
  'room-service': () => <FnbRoomServicePage />,
  bar: () => <FnbBarPage />,
  'qr-menu': () => <FnbQrMenuPage />,
  waiter: () => <FnbWaiterPage />,
  outlets: () => <FnbOutletsPage />,
  reports: () => <FnbReportsPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Restaurant POS` };
}

export default async function RestaurantSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
