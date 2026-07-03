import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, CreditCard, Globe, Users } from 'lucide-react';

import { PageHero } from '@/components/layouts/page-hero';
import { SectionHeader } from '@/components/website/section-reveal';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

const ICONS = [Building2, Globe, CreditCard, Users];

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('corporate');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function CorporatePage() {
  const content = await getWebsiteContent();
  const { corporate } = content;

  return (
    <>
      <PageHero
        eyebrow="Business Travel"
        title={corporate.headline}
        subtitle={corporate.description}
        ctaHref={PUBLIC_ROUTES.contact}
        ctaLabel={corporate.ctaLabel}
        imageUrl={content.hero.imageUrl}
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader title="Corporate Benefits" subtitle="Everything your organization needs for seamless business travel." />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {corporate.features.map((feature, i) => {
              const Icon = ICONS[i % ICONS.length] ?? Building2;
              return (
                <div key={feature.id} className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                  <Icon className="h-8 w-8 text-tunga-gold" />
                  <h2 className="mt-4 font-heading text-xl font-semibold text-tunga-navy">{feature.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-16 rounded-3xl bg-tunga-navy p-8 text-center text-white md:p-12">
            <h2 className="font-heading text-2xl font-semibold">Ready to set up your corporate account?</h2>
            <p className="mt-3 text-white/70">Our team will configure negotiated rates, portal access, and billing within 48 hours.</p>
            <Link
              href={asRoute(PUBLIC_ROUTES.contact)}
              className="mt-8 inline-flex rounded-tunga bg-tunga-gold px-8 py-3.5 text-sm font-semibold text-tunga-navy hover:bg-white"
            >
              Request Corporate Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
