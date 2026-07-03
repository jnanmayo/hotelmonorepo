import type { Metadata } from 'next';

import { PageHero } from '@/components/layouts/page-hero';
import { getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWebsiteContent();
  return {
    title: `Terms of Service | ${content.hotelName}`,
    description: `Terms and conditions for using ${content.hotelName} website and services.`,
  };
}

export default async function TermsPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our services."
        imageUrl={content.hero.imageUrl}
      />
      <section className="py-16">
        <div className="prose prose-neutral mx-auto max-w-3xl px-4 lg:px-8">
          <p className="lead text-muted-foreground">
            These Terms of Service govern your use of the {content.hotelName} website and hotel services.
            By accessing our website or making a reservation, you agree to these terms.
          </p>
          <h2>Reservations &amp; Cancellations</h2>
          <p>
            All reservations are subject to availability. Cancellation policies vary by rate type and are
            displayed at the time of booking. No-shows may be charged the full room rate.
          </p>
          <h2>Check-in &amp; Check-out</h2>
          <p>
            Standard check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in and late check-out
            are subject to availability and may incur additional charges.
          </p>
          <h2>Guest Conduct</h2>
          <p>
            Guests are expected to conduct themselves in a manner that does not disturb other guests or staff.
            The hotel reserves the right to refuse service or evict guests who violate this policy.
          </p>
          <h2>Liability</h2>
          <p>
            {content.hotelName} is not liable for loss or damage to personal belongings unless caused by our negligence.
            Valuables should be stored in the in-room safe or front desk safety deposit.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact us at{' '}
            <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
        </div>
      </section>
    </>
  );
}
