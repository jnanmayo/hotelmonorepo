import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { MeetingsSection } from '@/components/website/meetings-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';
import { PUBLIC_ROUTES } from '@/constants/routes';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('meetings-events');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function MeetingsEventsPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="MICE & Celebrations"
        title="Meetings & Events"
        subtitle="Corporate meetings, weddings, conferences, and banquets — executed flawlessly."
        ctaHref={PUBLIC_ROUTES.contact}
        ctaLabel="Request a Quote"
        imageUrl={content.meetings[0]?.imageUrl}
      />
      <MeetingsSection spaces={content.meetings} />
    </>
  );
}
