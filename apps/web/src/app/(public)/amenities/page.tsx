import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { AmenitiesSection } from '@/components/website/amenities-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('amenities');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function AmenitiesPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="World-Class Facilities"
        title="Hotel Amenities"
        subtitle="Wellness, business, and convenience — everything for a seamless luxury stay."
        imageUrl={content.hero.imageUrl}
      />
      <AmenitiesSection amenities={content.amenities} />
    </>
  );
}
