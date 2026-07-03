import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { BookingWidget } from '@/components/website/booking-widget';
import { RoomsSection } from '@/components/website/rooms-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';
import { PUBLIC_ROUTES } from '@/constants/routes';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('rooms');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function RoomsPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Accommodations"
        title="Rooms & Suites"
        subtitle="From executive rooms to presidential suites — designed for comfort in Mumbai's business district."
        ctaHref={PUBLIC_ROUTES.book}
        ctaLabel="Check Availability"
        imageUrl={content.rooms[0]?.imageUrl}
      />
      <div className="sticky top-[72px] z-30 bg-white py-4 shadow-sm">
        <BookingWidget sticky={false} />
      </div>
      <RoomsSection rooms={content.rooms} showViewAll={false} />
    </>
  );
}
