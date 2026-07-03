import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWebsiteContent();
  return {
    title: `Privacy Policy | ${content.hotelName}`,
    description: `Privacy policy for ${content.hotelName}. Learn how we collect, use, and protect your personal information.`,
  };
}

export default async function PrivacyPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Your privacy matters to us."
        imageUrl={content.hero.imageUrl}
      />
      <section className="py-16">
        <div className="prose prose-neutral mx-auto max-w-3xl px-4 lg:px-8">
          <p className="lead text-muted-foreground">
            {content.hotelName} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
            This policy explains how we collect, use, and safeguard your personal information when you visit our website or stay at our property.
          </p>
          <h2>Information We Collect</h2>
          <p>
            We may collect personal information including your name, email address, phone number, payment details,
            and booking preferences when you make a reservation, subscribe to our newsletter, or contact us.
          </p>
          <h2>How We Use Your Information</h2>
          <p>
            Your information is used to process reservations, provide customer service, send promotional communications
            (with your consent), and improve our services. We do not sell your personal data to third parties.
          </p>
          <h2>Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information.
            All payment transactions are encrypted using SSL technology.
          </p>
          <h2>Contact Us</h2>
          <p>
            For privacy-related inquiries, contact us at{' '}
            <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a> or call {content.contact.phone}.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
        </div>
      </section>
    </>
  );
}
