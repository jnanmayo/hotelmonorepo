import { DEFAULT_WEBSITE_CONTENT } from '@/features/website/data/default-content';
import type { WebsiteContent } from '@/features/website/types/content.types';
import { resolveImageUrl } from '@/lib/image-url';

type ApiContent = {
  hotel?: { name?: string; logoUrl?: string };
  settings?: Record<string, unknown>;
  hero?: Array<{
    id: string;
    title: string;
    subtitle?: string | null;
    desktopImageUrl?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
  }>;
  rooms?: Array<{
    id: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    description?: string | null;
    images?: unknown;
    price?: { toNumber?: () => number } | number | null;
    maxGuests?: number | null;
    amenities?: unknown;
    virtualTourUrl?: string | null;
  }>;
  offers?: Array<{
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    priceLabel?: string | null;
    slug?: string;
  }>;
  gallery?: Array<{
    id: string;
    url: string;
    altText?: string | null;
    mediaType?: string;
    category?: string | null;
  }>;
  testimonials?: Array<{
    id: string;
    guestName?: string | null;
    rating?: number | null;
    content?: string | null;
    source?: string | null;
  }>;
};

function firstImage(images: unknown, category: 'room' = 'room'): string {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string') return resolveImageUrl(first, category);
    if (first && typeof first === 'object' && 'url' in first) {
      return resolveImageUrl(String((first as { url?: string }).url), category);
    }
  }
  return resolveImageUrl(null, category);
}

export function mapApiToWebsiteContent(data: ApiContent): WebsiteContent {
  const base = { ...DEFAULT_WEBSITE_CONTENT };

  if (data.hotel?.name) base.hotelName = data.hotel.name;
  if (data.hotel?.logoUrl) base.logoUrl = resolveImageUrl(data.hotel.logoUrl);

  const heroSlide = data.hero?.[0];
  if (heroSlide) {
    base.hero = {
      ...base.hero,
      title: heroSlide.title || base.hero.title,
      subtitle: heroSlide.subtitle ?? base.hero.subtitle,
      imageUrl: resolveImageUrl(heroSlide.desktopImageUrl ?? base.hero.imageUrl, 'exterior'),
      ctaPrimary: heroSlide.buttonText
        ? { label: heroSlide.buttonText, href: heroSlide.buttonLink ?? base.hero.ctaPrimary.href }
        : base.hero.ctaPrimary,
    };
  }

  if (data.rooms && data.rooms.length > 0) {
    base.rooms = data.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.shortDescription ?? r.description ?? '',
      priceFrom: Number(
        typeof r.price === 'object' && r.price && 'toNumber' in r.price
          ? (r.price as { toNumber: () => number }).toNumber()
          : r.price ?? 0,
      ),
      currency: 'INR',
      occupancy: r.maxGuests ? `${r.maxGuests} Guests` : '2 Guests',
      amenities: Array.isArray(r.amenities) ? (r.amenities as string[]).slice(0, 6) : [],
      imageUrl: firstImage(r.images, 'room'),
      href: `/rooms#${r.slug}`,
      virtualTourUrl: r.virtualTourUrl ?? undefined,
    }));
  }

  if (data.offers && data.offers.length > 0) {
    base.offers = data.offers.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description ?? '',
      priceLabel: o.priceLabel ?? undefined,
      imageUrl: resolveImageUrl(o.imageUrl, 'exterior'),
      href: `/offers#${o.slug ?? o.id}`,
    }));
  }

  if (data.gallery && data.gallery.length > 0) {
    base.gallery = data.gallery.map((g, i) => ({
      id: g.id,
      type: g.mediaType === 'VIDEO' ? 'video' as const : 'image' as const,
      url: resolveImageUrl(g.url, g.category?.toLowerCase().includes('room') ? 'room' : 'exterior'),
      alt: g.altText ?? g.category ?? 'Hotel gallery',
      span: i === 0 || i === 4 ? 'wide' as const : i === 2 ? 'tall' as const : undefined,
    }));
  }

  if (data.testimonials && data.testimonials.length > 0) {
    base.testimonials = data.testimonials.map((t) => ({
      id: t.id,
      guest: t.guestName ?? 'Guest',
      rating: t.rating ?? 5,
      text: t.content ?? '',
      source: t.source ?? 'Google',
      date: new Date().getFullYear().toString(),
    }));
  }

  base.seo.ogImage = resolveImageUrl(base.hero.imageUrl, 'exterior');

  return base;
}
