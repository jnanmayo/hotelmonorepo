import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { ExperiencesSection } from '@/components/website/experiences-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';
import { PUBLIC_ROUTES } from '@/constants/routes';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('experiences');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function ExperiencesPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Curated Moments"
        title="Guest Experiences"
        subtitle="City tours, wellness retreats, culinary journeys, and bespoke concierge services."
        ctaHref={PUBLIC_ROUTES.contact}
        ctaLabel="Plan Your Experience"
        imageUrl={content.experiences[0]?.imageUrl}
      />
      <ExperiencesSection experiences={content.experiences} showViewAll={false} />
    </>
  );
}
