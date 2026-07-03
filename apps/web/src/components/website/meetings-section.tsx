'use client';

import { WebsiteImage } from '@/components/website/website-image';
import Link from 'next/link';
import { Users } from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { MeetingSpace } from '@/features/website/types/content.types';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

interface MeetingsSectionProps {
  spaces: MeetingSpace[];
}

const EVENT_TYPES = ['Corporate Meetings', 'Weddings', 'Birthdays', 'Conferences', 'Banquets', 'Seminars'];

export function MeetingsSection({ spaces }: MeetingsSectionProps) {
  return (
    <section className="bg-slate-50 py-20" aria-labelledby="meetings-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="MICE & Celebrations"
            title="Meetings & Events"
            subtitle="Versatile venues with dedicated event specialists for flawless execution."
          />
        </SectionReveal>

        <SectionReveal className="mb-10 flex flex-wrap justify-center gap-2">
          {EVENT_TYPES.map((type) => (
            <span
              key={type}
              className="rounded-full border border-tunga-navy/15 bg-white px-4 py-1.5 text-xs font-medium text-tunga-navy"
            >
              {type}
            </span>
          ))}
        </SectionReveal>

        <div className="grid gap-8 md:grid-cols-3">
          {spaces.map((space, i) => (
            <SectionReveal key={space.id} delay={i * 0.1}>
              <article className="overflow-hidden rounded-2xl bg-white shadow-tunga transition hover:shadow-tunga-lg">
                <div className="relative aspect-video overflow-hidden">
                  <WebsiteImage
                    src={space.imageUrl}
                    alt={space.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackCategory="event"
                  />
                </div>
                <div className="p-6">
                  <h3 id={i === 0 ? 'meetings-heading' : undefined} className="font-heading text-xl font-semibold text-tunga-navy">
                    {space.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-tunga-gold">
                    <Users className="h-4 w-4" /> Up to {space.capacity}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{space.description}</p>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal className="mt-12 text-center">
          <Link
            href={asRoute(PUBLIC_ROUTES.meetingsEvents)}
            className="inline-flex rounded-tunga bg-tunga-navy px-8 py-3 text-sm font-semibold text-white transition hover:bg-tunga-gold hover:text-tunga-navy"
          >
            Request a Quote
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
