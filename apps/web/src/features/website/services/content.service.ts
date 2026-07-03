import { DEFAULT_WEBSITE_CONTENT } from '@/features/website/data/default-content';
import { WEBSITE_API } from '@/features/website/api/endpoints';
import { mapApiToWebsiteContent } from '@/features/website/services/content.mapper';
import type { WebsiteContent } from '@/features/website/types/content.types';
import { resolveImageUrl } from '@/lib/image-url';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/**
 * Fetch website content for a hotel tenant.
 * Falls back to default content when API is unavailable.
 */
export async function getWebsiteContent(hotelSlug = 'tunga-international'): Promise<WebsiteContent> {
  try {
    const res = await fetch(`${API_URL}${WEBSITE_API.content}?hotelSlug=${hotelSlug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_WEBSITE_CONTENT;

    const json = await res.json();
    const data = json.data;
    if (!data?.settings && !data?.hero?.length && !data?.gallery?.length) {
      return DEFAULT_WEBSITE_CONTENT;
    }

    return mapApiToWebsiteContent(data);
  } catch {
    return DEFAULT_WEBSITE_CONTENT;
  }
}

export async function getPageSeo(page: string, content?: WebsiteContent) {
  const c = content ?? (await getWebsiteContent());
  const pageTitles: Record<string, string> = {
    home: c.seo.title,
    rooms: `Rooms & Suites | ${c.hotelName}`,
    dining: `Dining | ${c.hotelName}`,
    offers: `Special Offers | ${c.hotelName}`,
    corporate: `Corporate Booking | ${c.hotelName}`,
    gallery: `Gallery | ${c.hotelName}`,
    amenities: `Amenities | ${c.hotelName}`,
    experiences: `Experiences | ${c.hotelName}`,
    about: `About Us | ${c.hotelName}`,
    contact: `Contact | ${c.hotelName}`,
    location: `Location | ${c.hotelName}`,
    book: `Book Now | ${c.hotelName}`,
    'meetings-events': `Meetings & Events | ${c.hotelName}`,
  };
  return {
    title: pageTitles[page] ?? c.seo.title,
    description: c.seo.description,
    keywords: c.seo.keywords,
    openGraph: {
      title: pageTitles[page] ?? c.seo.title,
      description: c.seo.description,
      images: [{ url: resolveImageUrl(c.seo.ogImage) }],
    },
  };
}
