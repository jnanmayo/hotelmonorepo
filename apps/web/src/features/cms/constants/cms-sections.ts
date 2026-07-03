/**
 * CMS section metadata — drives page layout, tabs, and public site mapping.
 */

import { PUBLIC_ROUTES } from '@/constants/routes';

export type CmsSectionKey =
  | 'homepage'
  | 'hero'
  | 'rooms'
  | 'dining'
  | 'amenities'
  | 'offers'
  | 'gallery'
  | 'testimonials'
  | 'awards'
  | 'events'
  | 'corporate'
  | 'attractions'
  | 'contact'
  | 'footer'
  | 'navigation'
  | 'seo'
  | 'media'
  | 'forms'
  | 'newsletter'
  | 'menus'
  | 'blog'
  | 'page-builder'
  | 'settings'
  | 'analytics';

export interface CmsSectionConfig {
  key: CmsSectionKey;
  title: string;
  description: string;
  previewHref?: string;
  tabs: string[];
  features: string[];
  listLabel?: string;
}

export const CMS_SECTIONS: Record<CmsSectionKey, CmsSectionConfig> = {
  homepage: {
    key: 'homepage',
    title: 'Homepage',
    description: 'Manage hero, features, statistics, and homepage section order.',
    previewHref: PUBLIC_ROUTES.home,
    tabs: ['Sections', 'Features', 'Statistics', 'SEO'],
    features: ['Hero Images', 'Hero Video', 'Section Order', 'Enable/Disable Sections'],
  },
  hero: {
    key: 'hero',
    title: 'Hero Banner',
    description: 'Manage hero slides with responsive images, video backgrounds, and scheduling.',
    previewHref: PUBLIC_ROUTES.home,
    tabs: ['Slides', 'Schedule', 'Animation'],
    features: ['Desktop/Tablet/Mobile Images', 'Video Background', 'Overlay', 'Start/End Dates'],
    listLabel: 'Hero Slides',
  },
  rooms: {
    key: 'rooms',
    title: 'Rooms & Suites',
    description: 'Manage room listings displayed on the public website.',
    previewHref: PUBLIC_ROUTES.rooms,
    tabs: ['All Rooms', 'Featured', 'SEO'],
    features: ['Images', '360° Views', 'Amenities', 'Pricing', 'Virtual Tour'],
    listLabel: 'Rooms',
  },
  dining: {
    key: 'dining',
    title: 'Dining',
    description: 'Manage restaurants, cafes, bars, and dining experiences.',
    previewHref: PUBLIC_ROUTES.dining,
    tabs: ['Venues', 'Menus', 'Gallery', 'Offers'],
    features: ['Restaurant', 'Cafe', 'Bar', 'Chef', 'Menu PDF', 'Timings'],
    listLabel: 'Dining Venues',
  },
  amenities: {
    key: 'amenities',
    title: 'Amenities',
    description: 'Manage hotel amenities with icons, categories, and display order.',
    previewHref: PUBLIC_ROUTES.amenities,
    tabs: ['All Amenities', 'Categories'],
    features: ['Image', 'Icon', 'Category', 'Priority', 'Display Order'],
    listLabel: 'Amenities',
  },
  offers: {
    key: 'offers',
    title: 'Special Offers',
    description: 'Create and manage promotional offers and packages.',
    previewHref: PUBLIC_ROUTES.offers,
    tabs: ['Active', 'Scheduled', 'Expired'],
    features: ['Discount', 'Stay Package', 'Corporate', 'Festival', 'Flash Sale'],
    listLabel: 'Offers',
  },
  gallery: {
    key: 'gallery',
    title: 'Gallery',
    description: 'Manage photo, video, and 360° galleries with albums and categories.',
    previewHref: PUBLIC_ROUTES.gallery,
    tabs: ['Photos', 'Videos', '360°', 'Albums'],
    features: ['Drag & Drop', 'Compression', 'Alt Text', 'SEO'],
    listLabel: 'Media Items',
  },
  testimonials: {
    key: 'testimonials',
    title: 'Testimonials',
    description: 'Manage guest reviews and ratings displayed on the website.',
    previewHref: PUBLIC_ROUTES.home,
    tabs: ['Published', 'Draft', 'Featured'],
    features: ['Guest Photo', 'Rating', 'Country', 'Stay Date', 'Room'],
    listLabel: 'Testimonials',
  },
  awards: {
    key: 'awards',
    title: 'Awards & Recognition',
    description: 'Manage awards, certifications, and accolades.',
    previewHref: PUBLIC_ROUTES.about,
    tabs: ['All Awards'],
    features: ['Title', 'Year', 'Image', 'Display Order'],
    listLabel: 'Awards',
  },
  events: {
    key: 'events',
    title: 'Events & Meetings',
    description: 'Manage weddings, conferences, meetings, and event packages.',
    previewHref: PUBLIC_ROUTES.meetingsEvents,
    tabs: ['Event Types', 'Packages', 'Gallery'],
    features: ['Wedding', 'Conference', 'Meeting', 'Birthday', 'Corporate'],
    listLabel: 'Event Spaces',
  },
  corporate: {
    key: 'corporate',
    title: 'Corporate',
    description: 'Manage corporate packages, business travel, and meeting rooms.',
    previewHref: PUBLIC_ROUTES.corporate,
    tabs: ['Packages', 'Companies', 'CTA'],
    features: ['Business Travel', 'Long Stay', 'Meeting Rooms', 'Conference Packages'],
    listLabel: 'Corporate Packages',
  },
  attractions: {
    key: 'attractions',
    title: 'Nearby Attractions',
    description: 'Manage nearby places of interest with maps and distances.',
    previewHref: PUBLIC_ROUTES.location,
    tabs: ['All Attractions', 'Categories'],
    features: ['Google Maps', 'Distance', 'Category', 'Priority'],
    listLabel: 'Attractions',
  },
  contact: {
    key: 'contact',
    title: 'Contact Information',
    description: 'Manage contact details, working hours, and emergency contacts.',
    previewHref: PUBLIC_ROUTES.contact,
    tabs: ['Details', 'Hours', 'Map'],
    features: ['Phone', 'Email', 'WhatsApp', 'Address', 'Emergency Contact'],
  },
  footer: {
    key: 'footer',
    title: 'Footer',
    description: 'Manage footer links, social media, legal pages, and copyright.',
    tabs: ['Quick Links', 'Social Media', 'Legal', 'Newsletter'],
    features: ['Privacy Policy', 'Terms', 'Copyright', 'Powered By'],
  },
  navigation: {
    key: 'navigation',
    title: 'Navigation & Menus',
    description: 'Build dynamic header navigation with nested and mega menus.',
    tabs: ['Header Menu', 'Mega Menu', 'Mobile Menu'],
    features: ['Drag & Drop', 'Nested Menus', 'External Links', 'Role Visibility'],
  },
  seo: {
    key: 'seo',
    title: 'SEO Manager',
    description: 'Manage SEO metadata, Open Graph, schema markup, and redirects.',
    tabs: ['Pages', 'Redirects', 'Schema', 'Sitemap'],
    features: ['Meta Title', 'Description', 'OG Tags', 'Canonical URL', 'Robots'],
  },
  media: {
    key: 'media',
    title: 'Media Library',
    description: 'Enterprise media library with folders, albums, and bulk upload.',
    tabs: ['All Media', 'Folders', 'Videos', 'Documents'],
    features: ['AWS S3', 'Compression', 'Bulk Upload', 'Search & Filter'],
    listLabel: 'Media Files',
  },
  forms: {
    key: 'forms',
    title: 'Form Builder',
    description: 'Create reusable forms for contact, corporate, and event inquiries.',
    tabs: ['All Forms', 'Submissions'],
    features: ['Contact', 'Corporate Inquiry', 'Restaurant Booking', 'Event Inquiry'],
    listLabel: 'Forms',
  },
  newsletter: {
    key: 'newsletter',
    title: 'Newsletter',
    description: 'Manage subscribers, campaigns, and email templates.',
    tabs: ['Subscribers', 'Campaigns', 'Templates'],
    features: ['Import/Export', 'Campaigns', 'Mail Templates'],
    listLabel: 'Subscribers',
  },
  menus: {
    key: 'menus',
    title: 'Restaurant Menus',
    description: 'Manage food and beverage menus with PDF uploads.',
    tabs: ['All Menus', 'Categories'],
    features: ['Breakfast', 'Lunch', 'Dinner', 'Bar Menu', 'PDF Upload'],
    listLabel: 'Menus',
  },
  blog: {
    key: 'blog',
    title: 'Blog',
    description: 'Manage blog categories, posts, tags, and scheduling.',
    tabs: ['Posts', 'Categories', 'Tags', 'Drafts'],
    features: ['Rich Editor', 'Featured Image', 'Schedule Publish', 'Author'],
    listLabel: 'Blog Posts',
  },
  'page-builder': {
    key: 'page-builder',
    title: 'Page Builder',
    description: 'Drag-and-drop page builder with reusable sections.',
    tabs: ['Pages', 'Sections', 'Templates'],
    features: ['Hero', 'Gallery', 'Cards', 'FAQ', 'CTA', 'Statistics'],
    listLabel: 'Pages',
  },
  settings: {
    key: 'settings',
    title: 'Website Settings',
    description: 'Global website settings, branding, and domain configuration.',
    tabs: ['General', 'Branding', 'Domain', 'Integrations'],
    features: ['Hotel Name', 'Logo', 'Colors', 'Fonts', 'Powered By'],
  },
  analytics: {
    key: 'analytics',
    title: 'Website Analytics',
    description: 'Track visitors, conversions, and content performance.',
    tabs: ['Overview', 'Pages', 'Devices', 'Countries'],
    features: ['Visitors', 'Bounce Rate', 'CTA Clicks', 'Booking Conversion'],
  },
};

export function getCmsSection(key: string): CmsSectionConfig | undefined {
  return CMS_SECTIONS[key as CmsSectionKey];
}

export function isCmsSectionKey(key: string): key is CmsSectionKey {
  return key in CMS_SECTIONS;
}
