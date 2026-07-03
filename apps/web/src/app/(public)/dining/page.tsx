import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock } from 'lucide-react';

import { PageHero } from '@/components/layouts/page-hero';
import { SectionHeader } from '@/components/website/section-reveal';
import { WebsiteImage } from '@/components/website/website-image';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('dining');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function DiningPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Culinary Excellence"
        title="Dining & Beverage"
        subtitle="Award-winning cuisine, artisan coffee, and craft cocktails in elegant settings."
        ctaHref={PUBLIC_ROUTES.contact}
        ctaLabel="Reserve a Table"
        imageUrl={content.dining[0]?.imageUrl}
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            title="Our Venues"
            subtitle="Breakfast, lunch, dinner, and everything in between."
          />
          <div className="grid gap-10 lg:grid-cols-2">
            {content.dining.map((venue) => (
              <article key={venue.id} className="overflow-hidden rounded-2xl bg-white shadow-tunga">
                <div className="relative aspect-video">
                  <WebsiteImage
                    src={venue.imageUrl}
                    alt={venue.name}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    fallbackCategory="dining"
                  />
                </div>
                <div className="p-8">
                  <span className="text-xs font-medium tracking-widest text-tunga-gold uppercase">{venue.type}</span>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-tunga-navy">{venue.name}</h2>
                  <p className="mt-3 text-muted-foreground">{venue.description}</p>
                  {venue.hours && (
                    <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-tunga-gold" /> {venue.hours}
                    </p>
                  )}
                  <div className="mt-6 flex gap-3">
                    <Link href={asRoute(PUBLIC_ROUTES.contact)} className="rounded-tunga bg-tunga-gold px-6 py-2.5 text-sm font-semibold text-tunga-navy hover:bg-tunga-navy hover:text-white">
                      Reserve Table
                    </Link>
                    <button type="button" className="rounded-tunga border border-tunga-navy/20 px-6 py-2.5 text-sm font-semibold text-tunga-navy hover:border-tunga-gold">
                      View Menu
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
