import { WebsiteImage } from '@/components/website/website-image';
import Link from 'next/link';

import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  ctaHref?: string;
  ctaLabel?: string;
  imageUrl?: string;
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  eyebrow,
  ctaHref,
  ctaLabel,
  imageUrl,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('relative min-h-[320px] overflow-hidden pt-20', className)}>
      {imageUrl ? (
        <>
          <WebsiteImage src={imageUrl} alt="" fill className="object-cover" priority sizes="100vw" fallbackCategory="exterior" />
          <div className="absolute inset-0 bg-tunga-navy/75" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-tunga-navy via-tunga-navy/95 to-slate-900" />
      )}
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-white lg:px-8 lg:py-20">
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.25em] text-tunga-gold uppercase">{eyebrow}</p>
        )}
        <h1 className="mt-3 font-heading text-4xl font-semibold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-white/80">{subtitle}</p>}
        {ctaHref && ctaLabel && (
          <Link
            href={asRoute(ctaHref)}
            className="mt-8 inline-block rounded-tunga bg-tunga-gold px-8 py-3.5 text-sm font-semibold text-tunga-navy transition hover:bg-white"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
