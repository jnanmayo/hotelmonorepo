import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { OffersSection } from '@/components/website/offers-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';
import { PUBLIC_ROUTES } from '@/constants/routes';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('offers');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function OffersPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Exclusive Deals"
        title="Special Offers"
        subtitle="Book direct for the best rates — packages unavailable on third-party sites."
        ctaHref={PUBLIC_ROUTES.book}
        ctaLabel="Book Direct & Save"
        imageUrl={content.offers[0]?.imageUrl}
      />
      <OffersSection offers={content.offers} />
    </>
  );
}
