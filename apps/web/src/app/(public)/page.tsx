import type { Metadata } from 'next';

import { HotelJsonLd } from '@/components/website/hotel-json-ld';
import { HeroSection } from '@/components/website/hero-section';
import { BookingWidget } from '@/components/website/booking-widget';
import { OffersSection } from '@/components/website/offers-section';
import { RoomsSection } from '@/components/website/rooms-section';
import { DiningSection } from '@/components/website/dining-section';
import { AmenitiesSection } from '@/components/website/amenities-section';
import { MeetingsSection } from '@/components/website/meetings-section';
import { ExperiencesSection } from '@/components/website/experiences-section';
import { AttractionsSection } from '@/components/website/attractions-section';
import { GallerySection } from '@/components/website/gallery-section';
import { TestimonialsSection } from '@/components/website/testimonials-section';
import { AwardsSection } from '@/components/website/awards-section';
import { CorporateSection } from '@/components/website/corporate-section';
import { NewsletterSection } from '@/components/website/newsletter-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('home');
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: seo.openGraph,
    twitter: { card: 'summary_large_image', ...seo.openGraph },
  };
}

export default async function HomePage() {
  const content = await getWebsiteContent();

  return (
    <>
      <HotelJsonLd content={content} />
      <HeroSection content={content.hero} />
      <div className="-mt-16 relative z-20 pb-8">
        <BookingWidget />
      </div>
      <OffersSection offers={content.offers} />
      <RoomsSection rooms={content.rooms} />
      <DiningSection venues={content.dining} />
      <AmenitiesSection amenities={content.amenities} />
      <MeetingsSection spaces={content.meetings} />
      <ExperiencesSection experiences={content.experiences} />
      <AttractionsSection attractions={content.attractions} />
      <GallerySection items={content.gallery} />
      <TestimonialsSection testimonials={content.testimonials} />
      <AwardsSection awards={content.awards} />
      <CorporateSection corporate={content.corporate} />
      <NewsletterSection newsletter={content.newsletter} />
    </>
  );
}
