'use client';

import { Award } from 'lucide-react';

import { SectionReveal } from '@/components/website/section-reveal';
import type { AwardItem } from '@/features/website/types/content.types';

interface AwardsSectionProps {
  awards: AwardItem[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section className="border-y border-slate-100 bg-white py-12" aria-label="Awards and recognition">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {awards.map((award, i) => (
            <SectionReveal key={award.id} delay={i * 0.1}>
              <div className="flex items-center gap-3 text-center md:text-left">
                <Award className="h-8 w-8 shrink-0 text-tunga-gold" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-tunga-navy">{award.title}</p>
                  <p className="text-xs text-muted-foreground">{award.year}</p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
