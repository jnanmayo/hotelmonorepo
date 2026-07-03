import type { MetadataRoute } from 'next';

import { PUBLIC_ROUTES } from '@/constants/routes';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tungahotel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.values(PUBLIC_ROUTES);
  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === PUBLIC_ROUTES.home ? 'daily' : 'weekly',
    priority: path === PUBLIC_ROUTES.home ? 1 : path === PUBLIC_ROUTES.book ? 0.9 : 0.7,
  }));
}
