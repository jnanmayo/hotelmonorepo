import { notFound } from 'next/navigation';

import {
  GxpAnnouncementsAdminPage,
  GxpOffersAdminPage,
  GxpQrCodesPage,
  GxpReportsAdminPage,
  GxpRequestsAdminPage,
} from '@/features/gxp/components/gxp-admin-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  'qr-codes': () => <GxpQrCodesPage />,
  requests: () => <GxpRequestsAdminPage />,
  offers: () => <GxpOffersAdminPage />,
  announcements: () => <GxpAnnouncementsAdminPage />,
  reports: () => <GxpReportsAdminPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Guest Experience` };
}

export default async function GxpSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
