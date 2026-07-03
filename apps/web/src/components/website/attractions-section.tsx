'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { AttractionItem } from '@/features/website/types/content.types';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

interface AttractionsSectionProps {
  attractions: AttractionItem[];
}

export function AttractionsSection({ attractions }: AttractionsSectionProps) {
  return (
    <section className="bg-slate-50 py-20" aria-labelledby="attractions-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="Explore Mumbai"
            title="Nearby Attractions"
            subtitle="Perfectly positioned for business and leisure — everything within reach."
          />
        </SectionReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {attractions.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 0.08}>
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-tunga-gold/30">
                <span className="text-xs font-medium tracking-wider text-tunga-gold uppercase">{item.type}</span>
                <h3 id={i === 0 ? 'attractions-heading' : undefined} className="mt-2 font-heading text-lg font-semibold text-tunga-navy">
                  {item.name}
                </h3>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {item.distance}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal className="mt-10 text-center">
          <Link
            href={asRoute(PUBLIC_ROUTES.location)}
            className="inline-flex rounded-tunga border border-tunga-navy px-8 py-3 text-sm font-semibold text-tunga-navy transition hover:bg-tunga-navy hover:text-white"
          >
            View Location & Directions
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
