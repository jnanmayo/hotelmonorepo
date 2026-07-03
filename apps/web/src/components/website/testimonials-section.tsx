'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { TestimonialItem } from '@/features/website/types/content.types';
import { cn } from '@/lib/utils';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 6000);
    return () => {
      clearInterval(timer);
    };
  }, [next]);

  const current = testimonials[active];
  if (!current) return null;

  return (
    <section className="bg-tunga-navy py-20 text-white" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="Guest Voices"
            title="What Our Guests Say"
            subtitle="Rated among Mumbai's finest — trusted by business leaders and leisure travelers alike."
          />
        </SectionReveal>

        <SectionReveal>
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
            <div className="flex justify-center gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-tunga-gold text-tunga-gold" />
              ))}
            </div>
            <blockquote id="testimonials-heading" className="mt-6 text-center font-heading text-xl leading-relaxed md:text-2xl">
              &ldquo;{current.text}&rdquo;
            </blockquote>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActive(i);
                    }}
                    className={cn(
                      'h-2 w-2 rounded-full transition',
                      i === active ? 'bg-tunga-gold w-6' : 'bg-white/30',
                    )}
                    aria-label={`Go to testimonial ${String(i + 1)}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                className="rounded-full border border-white/20 p-2 transition hover:bg-white/10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
