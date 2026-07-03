'use client';

import {
  Waves,
  Dumbbell,
  Sparkles,
  Presentation,
  Wifi,
  Car,
  ParkingCircle,
  Briefcase,
} from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { AmenityItem } from '@/features/website/types/content.types';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  pool: Waves,
  gym: Dumbbell,
  spa: Sparkles,
  conference: Presentation,
  wifi: Wifi,
  transfer: Car,
  parking: ParkingCircle,
  business: Briefcase,
};

interface AmenitiesSectionProps {
  amenities: AmenityItem[];
}

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  return (
    <section className="py-20" aria-labelledby="amenities-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="World-Class Facilities"
            title="Hotel Amenities"
            subtitle="Everything you need for a seamless stay — from wellness to business."
          />
        </SectionReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Sparkles;
            return (
              <SectionReveal key={item.id} delay={i * 0.05}>
                <div className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-tunga-gold/30 hover:shadow-tunga">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tunga-navy/5 text-tunga-gold transition group-hover:bg-tunga-gold group-hover:text-tunga-navy">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3
                    id={i === 0 ? 'amenities-heading' : undefined}
                    className="mt-4 font-heading text-lg font-semibold text-tunga-navy"
                  >
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
