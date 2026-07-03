import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { BookingWidget } from '@/components/website/booking-widget';
import { RoomsSection } from '@/components/website/rooms-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('book');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function BookPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Best Rate Guarantee"
        title="Book Direct & Save"
        subtitle="Skip OTA commissions — enjoy exclusive rates, flexible cancellation, and member benefits when you book directly."
        imageUrl={content.hero.imageUrl}
      />
      <section className="bg-slate-50 py-12">
        <BookingWidget sticky={false} />
      </section>
      <RoomsSection rooms={content.rooms} showViewAll={false} />
    </>
  );
}
