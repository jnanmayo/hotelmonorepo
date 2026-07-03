import { env } from '@/lib/env';

const DEFAULT_HOTEL_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';

const PLACEHOLDER_BY_CATEGORY: Record<string, string> = {
  room: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
  dining: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  event: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b8?auto=format&fit=crop&w=1200&q=80',
  lobby: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  exterior: DEFAULT_HOTEL_IMAGE,
};

/** Resolve CMS / API / relative image URLs to absolute URLs safe for next/image. */
export function resolveImageUrl(
  url: string | null | undefined,
  fallbackCategory: keyof typeof PLACEHOLDER_BY_CATEGORY | 'default' = 'default',
): string {
  if (!url || url.trim() === '') {
    return fallbackCategory === 'default'
      ? DEFAULT_HOTEL_IMAGE
      : PLACEHOLDER_BY_CATEGORY[fallbackCategory] ?? DEFAULT_HOTEL_IMAGE;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  const apiOrigin = env.apiUrl.replace(/\/api\/v1\/?$/, '');

  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('/images/') && !trimmed.includes('.')) {
      return fallbackCategory === 'default'
        ? DEFAULT_HOTEL_IMAGE
        : PLACEHOLDER_BY_CATEGORY[fallbackCategory] ?? DEFAULT_HOTEL_IMAGE;
    }
    return `${apiOrigin}${trimmed}`;
  }

  return `${apiOrigin}/${trimmed}`;
}

export function isOptimizableImageUrl(url: string): boolean {
  if (url.startsWith('/')) return true;
  try {
    const host = new URL(url).hostname;
    return (
      host === 'images.unsplash.com' ||
      host.endsWith('.amazonaws.com') ||
      host.endsWith('.cloudfront.net') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

export { DEFAULT_HOTEL_IMAGE, PLACEHOLDER_BY_CATEGORY };
