'use client';

import { WebsiteImage } from '@/components/website/website-image';
import Link from 'next/link';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { ExperienceItem } from '@/features/website/types/content.types';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

interface ExperiencesSectionProps {
  experiences: ExperienceItem[];
  showViewAll?: boolean;
}

export function ExperiencesSection({ experiences, showViewAll = true }: ExperiencesSectionProps) {
  return (
    <section className="py-20" aria-labelledby="experiences-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="Curated Moments"
            title="Guest Experiences"
            subtitle="Beyond the room — discover Mumbai and indulge in unforgettable moments."
          />
        </SectionReveal>
        <div className="grid gap-6 md:grid-cols-3">
          {experiences.map((exp, i) => (
            <SectionReveal key={exp.id} delay={i * 0.1}>
              <article className="group relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[3/4]">
                  <WebsiteImage
                    src={exp.imageUrl}
                    alt={exp.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackCategory="spa"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tunga-navy via-tunga-navy/20 to-transparent" />
                  <div className="absolute bottom-0 p-6 text-white">
                    <h3 id={i === 0 ? 'experiences-heading' : undefined} className="font-heading text-xl font-semibold">
                      {exp.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/80">{exp.description}</p>
                  </div>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
        {showViewAll && (
          <SectionReveal className="mt-10 text-center">
            <Link
              href={asRoute(PUBLIC_ROUTES.experiences)}
              className="text-sm font-semibold text-tunga-gold hover:underline"
            >
              Explore All Experiences →
            </Link>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
