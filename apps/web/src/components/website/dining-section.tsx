'use client';

import { WebsiteImage } from '@/components/website/website-image';
import Link from 'next/link';
import { Clock, UtensilsCrossed } from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { DiningVenue } from '@/features/website/types/content.types';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

interface DiningSectionProps {
  venues: DiningVenue[];
}

export function DiningSection({ venues }: DiningSectionProps) {
  return (
    <section className="bg-tunga-navy py-20 text-white" aria-labelledby="dining-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="Culinary Excellence"
            title="Dining & Beverage"
            subtitle="From sunrise breakfast to midnight cocktails — exceptional cuisine at every hour."
          />
        </SectionReveal>
        <div className="grid gap-8 md:grid-cols-3">
          {venues.map((venue, i) => (
            <SectionReveal key={venue.id} delay={i * 0.1}>
              <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition hover:border-tunga-gold/30">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <WebsiteImage
                    src={venue.imageUrl}
                    alt={venue.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackCategory="dining"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium tracking-widest text-tunga-gold uppercase">
                    {venue.type}
                  </span>
                  <h3 id={i === 0 ? 'dining-heading' : undefined} className="mt-2 font-heading text-xl font-semibold">
                    {venue.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{venue.description}</p>
                  {venue.hours && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-white/50">
                      <Clock className="h-3.5 w-3.5" /> {venue.hours}
                    </p>
                  )}
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            href={asRoute(PUBLIC_ROUTES.dining)}
            className="inline-flex items-center gap-2 rounded-tunga bg-tunga-gold px-8 py-3 text-sm font-semibold text-tunga-navy transition hover:bg-white"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Reserve a Table
          </Link>
          <Link
            href={asRoute(PUBLIC_ROUTES.dining)}
            className="inline-flex rounded-tunga border border-white/30 px-8 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            View Menus
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
