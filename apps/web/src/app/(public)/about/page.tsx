import type { Metadata } from 'next';
import Image from 'next/image';

import { PageHero } from '@/components/layouts/page-hero';
import { AwardsSection } from '@/components/website/awards-section';
import { TestimonialsSection } from '@/components/website/testimonials-section';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('about');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function AboutPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={`About ${content.hotelName}`}
        subtitle="A legacy of true hospitality in the heart of Mumbai's business capital."
        imageUrl={content.hero.imageUrl}
      />
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={content.hero.imageUrl} alt={content.hotelName} fill className="object-cover" sizes="50vw" />
          </div>
          <div>
            <h2 className="font-heading text-3xl font-semibold text-tunga-navy">Experience True Hospitality</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              {content.hotelName} stands as a beacon of luxury and service in Bandra Kurla Complex.
              Designed for the modern business traveler and discerning leisure guest, we combine
              world-class amenities with the warmth of Indian hospitality.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Powered by {content.poweredBy}, our operations deliver seamless experiences from
              direct booking to checkout — ensuring every stay exceeds expectations.
            </p>
          </div>
        </div>
      </section>
      <AwardsSection awards={content.awards} />
      <TestimonialsSection testimonials={content.testimonials} />
    </>
  );
}
