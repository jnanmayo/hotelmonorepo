import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { GallerySection } from '@/components/website/gallery-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('gallery');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function GalleryPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Visual Journey"
        title="Gallery"
        subtitle="Explore our rooms, dining, events, and amenities through photography and virtual experiences."
        imageUrl={content.gallery[0]?.url}
      />
      <GallerySection items={content.gallery} limit={content.gallery.length} showViewAll={false} />
    </>
  );
}
