import { notFound } from 'next/navigation';

import { HkTaskDetailPage } from '@/features/housekeeping/components/hk-task-detail';
import {
  HkDeepCleaningPage,
  HkGuestRequestsPage,
  HkInspectionPage,
  HkLaundryPage,
  HkLinenPage,
  HkLostFoundPage,
  HkMobilePage,
  HkReportsPage,
  HkStaffPage,
} from '@/features/housekeeping/components/hk-sections';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SECTIONS: Record<string, () => React.ReactNode> = {
  mobile: () => <HkMobilePage />,
  inspection: () => <HkInspectionPage />,
  laundry: () => <HkLaundryPage />,
  linen: () => <HkLinenPage />,
  'lost-found': () => <HkLostFoundPage />,
  'guest-requests': () => <HkGuestRequestsPage />,
  staff: () => <HkStaffPage />,
  'deep-cleaning': () => <HkDeepCleaningPage />,
  reports: () => <HkReportsPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (UUID_RE.test(slug)) return { title: 'Task Detail — Housekeeping' };
  return { title: `${slug.replace(/-/g, ' ')} — Housekeeping` };
}

export default async function HousekeepingSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (UUID_RE.test(slug)) {
    return <HkTaskDetailPage taskId={slug} />;
  }

  const Section = SECTIONS[slug];
  if (Section) return Section();

  notFound();
}
