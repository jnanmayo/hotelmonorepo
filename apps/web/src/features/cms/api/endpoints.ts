/**
 * CMS API integration endpoints.
 */

export const CMS_API = {
  dashboard: '/api/v1/cms/dashboard',
  section: (section: string) => `/api/v1/cms/sections/${section}`,
  pages: '/api/v1/cms/pages',
  hero: '/api/v1/cms/sections/hero',
  rooms: '/api/v1/cms/sections/rooms',
  offers: '/api/v1/cms/sections/offers',
  gallery: '/api/v1/cms/sections/gallery',
  testimonials: '/api/v1/cms/sections/testimonials',
  media: '/api/v1/cms/sections/media',
  blog: '/api/v1/cms/sections/blog',
} as const;
