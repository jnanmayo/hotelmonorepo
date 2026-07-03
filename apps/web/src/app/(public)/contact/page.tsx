import type { Metadata } from 'next';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

import { PageHero } from '@/components/layouts/page-hero';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('contact');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function ContactPage() {
  const content = await getWebsiteContent();
  const { contact } = content;

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Our team is available 24/7 for reservations, events, and guest assistance."
      />
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div className="space-y-8">
            <ContactItem icon={Phone} label="Phone" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
              {contact.phone}
            </ContactItem>
            <ContactItem icon={Mail} label="Email" href={`mailto:${contact.email}`}>
              {contact.email}
            </ContactItem>
            <ContactItem icon={MessageCircle} label="WhatsApp" href={`https://wa.me/${contact.whatsapp}`}>
              Chat on WhatsApp
            </ContactItem>
            <ContactItem icon={MapPin} label="Address">
              {contact.address}, {contact.city}
            </ContactItem>
          </div>

          <form className="rounded-2xl border border-slate-100 bg-white p-8 shadow-tunga" aria-label="Contact form">
            <h2 className="font-heading text-xl font-semibold text-tunga-navy">Send a Message</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="First Name" required className={inputClass} aria-label="First name" />
              <input type="text" placeholder="Last Name" required className={inputClass} aria-label="Last name" />
            </div>
            <input type="email" placeholder="Email" required className={`${inputClass} mt-4`} aria-label="Email" />
            <input type="tel" placeholder="Phone" className={`${inputClass} mt-4`} aria-label="Phone" />
            <select className={`${inputClass} mt-4`} aria-label="Inquiry type" defaultValue="">
              <option value="" disabled>Select inquiry type</option>
              <option value="booking">Booking</option>
              <option value="restaurant">Restaurant</option>
              <option value="corporate">Corporate</option>
              <option value="events">Events</option>
              <option value="general">General</option>
            </select>
            <textarea placeholder="Your message" rows={5} required className={`${inputClass} mt-4 resize-none`} aria-label="Message" />
            <button type="submit" className="mt-6 w-full rounded-tunga bg-tunga-navy py-3 text-sm font-semibold text-white hover:bg-tunga-gold hover:text-tunga-navy">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function ContactItem({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tunga-gold/15 text-tunga-gold">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 font-medium text-tunga-navy">{children}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block transition hover:opacity-80">
        {inner}
      </a>
    );
  }
  return inner;
}

const inputClass =
  'w-full rounded-tunga border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tunga-gold focus:ring-1 focus:ring-tunga-gold';
