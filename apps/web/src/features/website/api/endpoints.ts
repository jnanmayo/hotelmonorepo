/**
 * CMS API integration points for the public website.
 * Wire these when the admin panel and public API are live.
 */

export const WEBSITE_API = {
  /** GET — full website content for tenant */
  content: '/api/v1/public/website',
  /** GET — paginated rooms */
  rooms: '/api/v1/public/website/rooms',
  /** GET — offers */
  offers: '/api/v1/public/website/offers',
  /** GET — gallery items */
  gallery: '/api/v1/public/website/gallery',
  /** POST — newsletter subscription */
  newsletter: '/api/v1/public/website/newsletter',
  /** POST — contact form */
  contact: '/api/v1/public/website/contact',
  /** POST — corporate account request */
  corporate: '/api/v1/public/website/corporate',
} as const;
