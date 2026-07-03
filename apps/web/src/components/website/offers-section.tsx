'use client';

import { WebsiteImage } from '@/components/website/website-image';
import Link from 'next/link';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { OfferItem } from '@/features/website/types/content.types';
import { asRoute } from '@/lib/navigation';

interface OffersSectionProps {
  offers: OfferItem[];
}

export function OffersSection({ offers }: OffersSectionProps) {
  return (
    <section className="bg-slate-50 py-20" aria-labelledby="offers-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="Exclusive Deals"
            title="Special Offers"
            subtitle="Book direct for the best rates and exclusive packages unavailable on OTAs."
          />
        </SectionReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, i) => (
            <SectionReveal key={offer.id} delay={i * 0.08}>
              <Link
                href={asRoute(offer.href)}
                className="group block overflow-hidden rounded-2xl bg-white shadow-tunga transition hover:-translate-y-1 hover:shadow-tunga-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <WebsiteImage
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackCategory="exterior"
                  />
                  {offer.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-tunga-gold px-3 py-1 text-xs font-semibold text-tunga-navy">
                      {offer.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 id={i === 0 ? 'offers-heading' : undefined} className="font-heading text-xl font-semibold text-tunga-navy">
                    {offer.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{offer.description}</p>
                  {offer.priceLabel && (
                    <p className="mt-4 text-sm font-semibold text-tunga-gold">{offer.priceLabel}</p>
                  )}
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
