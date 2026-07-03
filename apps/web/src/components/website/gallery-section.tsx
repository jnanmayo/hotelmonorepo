'use client';

import { WebsiteImage } from '@/components/website/website-image';
import Link from 'next/link';
import { Play } from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { GalleryItem } from '@/features/website/types/content.types';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface GallerySectionProps {
  items: GalleryItem[];
  limit?: number;
  showViewAll?: boolean;
}

export function GallerySection({ items, limit = 6, showViewAll = true }: GallerySectionProps) {
  const display = items.slice(0, limit);

  return (
    <section className="py-20" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="Visual Journey"
            title="Gallery"
            subtitle="Step inside our world of refined luxury and warm hospitality."
          />
        </SectionReveal>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {display.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 0.06} className="mb-4 break-inside-avoid">
              <div
                className={cn(
                  'group relative overflow-hidden rounded-2xl',
                  item.span === 'wide' && 'sm:col-span-2',
                  item.span === 'tall' && 'row-span-2',
                )}
              >
                <div className={cn('relative', item.span === 'tall' ? 'aspect-[3/4]' : 'aspect-[4/3]')}>
                  <WebsiteImage
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fallbackCategory="exterior"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
        {showViewAll && (
          <SectionReveal className="mt-10 text-center">
            <Link
              href={asRoute(PUBLIC_ROUTES.gallery)}
              className="inline-flex rounded-tunga bg-tunga-navy px-8 py-3 text-sm font-semibold text-white transition hover:bg-tunga-gold hover:text-tunga-navy"
            >
              View Full Gallery
            </Link>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
