'use client';

import Link from 'next/link';
import { Building2, CreditCard, Globe, Users } from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { WebsiteContent } from '@/features/website/types/content.types';
import { asRoute } from '@/lib/navigation';

const FEATURE_ICONS = [Building2, Globe, CreditCard, Users];

interface CorporateSectionProps {
  corporate: WebsiteContent['corporate'];
}

export function CorporateSection({ corporate }: CorporateSectionProps) {
  return (
    <section className="py-20" aria-labelledby="corporate-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-tunga-navy to-tunga-navy/90 text-white">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16">
              <SectionReveal>
                <SectionHeader
                  eyebrow="Business Travel"
                  title={corporate.headline}
                  subtitle={corporate.description}
                  align="left"
                />
                <Link
                  href={asRoute(corporate.ctaHref)}
                  id="corporate-heading"
                  className="inline-flex rounded-tunga bg-tunga-gold px-8 py-3.5 text-sm font-semibold text-tunga-navy transition hover:bg-white"
                >
                  {corporate.ctaLabel}
                </Link>
              </SectionReveal>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              {corporate.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length] ?? Building2;
                return (
                  <SectionReveal key={feature.id} delay={i * 0.08}>
                    <div className="h-full bg-tunga-navy/50 p-6 backdrop-blur-sm md:p-8">
                      <Icon className="h-6 w-6 text-tunga-gold" />
                      <h3 className="mt-4 font-heading text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
