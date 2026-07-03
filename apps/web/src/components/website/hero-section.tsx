'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { WebsiteImage } from '@/components/website/website-image';
import type { HeroContent } from '@/features/website/types/content.types';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  content: HeroContent;
  className?: string;
}

export function HeroSection({ content, className }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className={cn('relative h-screen min-h-[640px] overflow-hidden', className)}>
      <motion.div style={{ y }} className="absolute inset-0">
        <WebsiteImage
          src={content.imageUrl}
          alt={content.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          fallbackCategory="exterior"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tunga-navy/60 via-tunga-navy/40 to-tunga-navy/80" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-xs font-medium tracking-[0.3em] text-tunga-gold"
        >
          {content.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="max-w-4xl font-heading text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
        >
          {content.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 max-w-2xl text-base text-white/85 md:text-lg"
        >
          {content.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={asRoute(content.ctaPrimary.href)}
            className="rounded-tunga bg-tunga-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-tunga-navy transition hover:bg-white hover:shadow-tunga-lg"
          >
            {content.ctaPrimary.label}
          </Link>
          <Link
            href={asRoute(content.ctaSecondary.href)}
            className="rounded-tunga border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            {content.ctaSecondary.label}
          </Link>
        </motion.div>

        {content.badge && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 rounded-full border border-tunga-gold/50 bg-tunga-gold/10 px-4 py-1.5 text-xs tracking-widest text-tunga-gold"
          >
            {content.badge}
          </motion.span>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <ChevronDown className="h-8 w-8 animate-bounce text-white/60" />
      </motion.div>
    </section>
  );
}
