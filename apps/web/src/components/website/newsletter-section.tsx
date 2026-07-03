'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

import { SectionReveal } from '@/components/website/section-reveal';
import type { WebsiteContent } from '@/features/website/types/content.types';

interface NewsletterSectionProps {
  newsletter: WebsiteContent['newsletter'];
}

export function NewsletterSection({ newsletter }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // UI only — CMS/API integration pending
  };

  return (
    <section className="bg-slate-50 py-16" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
        <SectionReveal>
          <Mail className="mx-auto h-8 w-8 text-tunga-gold" aria-hidden />
          <h2 id="newsletter-heading" className="mt-4 font-heading text-2xl font-semibold text-tunga-navy md:text-3xl">
            {newsletter.headline}
          </h2>
          <p className="mt-3 text-muted-foreground">{newsletter.description}</p>

          {submitted ? (
            <p className="mt-6 text-sm font-medium text-tunga-gold" role="status">
              Thank you for subscribing. Exclusive offers are on their way.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-tunga border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tunga-gold focus:ring-1 focus:ring-tunga-gold"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="rounded-tunga bg-tunga-navy px-8 py-3 text-sm font-semibold text-white transition hover:bg-tunga-gold hover:text-tunga-navy"
              >
                Subscribe
              </button>
            </form>
          )}
        </SectionReveal>
      </div>
    </section>
  );
}
