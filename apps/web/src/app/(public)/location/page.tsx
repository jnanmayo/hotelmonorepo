import type { Metadata } from 'next';
import { MapPin, Navigation } from 'lucide-react';

import { PageHero } from '@/components/layouts/page-hero';
import { getPageSeo, getWebsiteContent } from '@/features/website/services/content.service';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('location');
  return { title: seo.title, description: seo.description, openGraph: seo.openGraph };
}

export default async function LocationPage() {
  const content = await getWebsiteContent();
  const { contact, location } = content;

  return (
    <>
      <PageHero
        eyebrow="Find Us"
        title={location.headline}
        subtitle={location.description}
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="overflow-hidden rounded-2xl shadow-tunga">
            <iframe
              title="Hotel location map"
              src={contact.mapEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-tunga-navy">Address</h2>
              <p className="mt-4 flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-tunga-gold" />
                {contact.address}, {contact.city}
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${contact.address}, ${contact.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-tunga bg-tunga-navy px-6 py-3 text-sm font-semibold text-white hover:bg-tunga-gold hover:text-tunga-navy"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </a>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-semibold text-tunga-navy">Nearby</h2>
              <ul className="mt-4 space-y-3">
                {location.nearby.map((place) => (
                  <li key={place.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                    <div>
                      <p className="font-medium text-tunga-navy">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.type}</p>
                    </div>
                    <span className="text-sm text-tunga-gold">{place.distance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
