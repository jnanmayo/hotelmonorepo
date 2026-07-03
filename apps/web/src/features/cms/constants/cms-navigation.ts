/**
 * Enterprise Website CMS navigation — sidebar, breadcrumbs, command palette.
 * All CMS routes live under /app/website/*
 */

import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  Contact,
  FileText,
  Footprints,
  FormInput,
  GalleryHorizontal,
  Globe,
  Home,
  Image,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  MapPin,
  Menu,
  MessageSquareQuote,
  Navigation,
  Newspaper,
  PanelTop,
  Search,
  Settings,
  Sparkles,
  Tag,
  UtensilsCrossed,
} from 'lucide-react';

export const CMS_BASE = '/app/website' as const;

export type CmsRole =
  | 'SUPER_ADMIN'
  | 'HOTEL_OWNER'
  | 'MARKETING_MANAGER'
  | 'CONTENT_EDITOR'
  | 'SEO_MANAGER'
  | 'RESTAURANT_MANAGER'
  | 'GALLERY_MANAGER'
  | 'SUPPORT';

export interface CmsNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  roles?: CmsRole[];
  badge?: string | number;
  keywords?: string[];
  children?: CmsNavItem[];
  /** Maps to public site route for preview */
  previewHref?: string;
}

const c = (path: string) => `${CMS_BASE}${path}`;

export const CMS_NAVIGATION: CmsNavItem[] = [
  {
    id: 'cms-dashboard',
    label: 'Dashboard',
    href: c(''),
    icon: LayoutDashboard,
    permission: 'website:content:read',
    keywords: ['overview', 'stats', 'analytics'],
  },
  {
    id: 'homepage',
    label: 'Homepage',
    href: c('/homepage'),
    icon: Home,
    permission: 'website:content:read',
    previewHref: '/',
    keywords: ['home', 'landing'],
  },
  {
    id: 'hero',
    label: 'Hero Banner',
    href: c('/hero'),
    icon: PanelTop,
    permission: 'website:content:read',
    previewHref: '/',
    keywords: ['banner', 'slider', 'video'],
  },
  {
    id: 'rooms',
    label: 'Rooms',
    href: c('/rooms'),
    icon: BedDouble,
    permission: 'website:content:read',
    previewHref: '/rooms',
    keywords: ['suites', 'accommodation'],
  },
  {
    id: 'dining',
    label: 'Dining',
    href: c('/dining'),
    icon: UtensilsCrossed,
    permission: 'website:content:read',
    roles: ['SUPER_ADMIN', 'HOTEL_OWNER', 'MARKETING_MANAGER', 'RESTAURANT_MANAGER', 'CONTENT_EDITOR'],
    previewHref: '/dining',
    keywords: ['restaurant', 'cafe', 'bar', 'menu'],
  },
  {
    id: 'amenities',
    label: 'Amenities',
    href: c('/amenities'),
    icon: Sparkles,
    permission: 'website:content:read',
    previewHref: '/amenities',
  },
  {
    id: 'offers',
    label: 'Offers',
    href: c('/offers'),
    icon: Tag,
    permission: 'website:content:read',
    previewHref: '/offers',
    keywords: ['discount', 'packages', 'promotions'],
  },
  {
    id: 'gallery',
    label: 'Gallery',
    href: c('/gallery'),
    icon: GalleryHorizontal,
    permission: 'website:content:read',
    roles: ['SUPER_ADMIN', 'HOTEL_OWNER', 'MARKETING_MANAGER', 'GALLERY_MANAGER', 'CONTENT_EDITOR'],
    previewHref: '/gallery',
    keywords: ['photos', 'videos', '360'],
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    href: c('/testimonials'),
    icon: MessageSquareQuote,
    permission: 'website:content:read',
    previewHref: '/',
  },
  {
    id: 'awards',
    label: 'Awards',
    href: c('/awards'),
    icon: Award,
    permission: 'website:content:read',
    previewHref: '/about',
  },
  {
    id: 'events',
    label: 'Events',
    href: c('/events'),
    icon: CalendarDays,
    permission: 'website:content:read',
    previewHref: '/meetings-events',
    keywords: ['wedding', 'conference', 'meetings'],
  },
  {
    id: 'corporate',
    label: 'Corporate',
    href: c('/corporate'),
    icon: Building2,
    permission: 'website:content:read',
    previewHref: '/corporate',
  },
  {
    id: 'attractions',
    label: 'Nearby Attractions',
    href: c('/attractions'),
    icon: MapPin,
    permission: 'website:content:read',
    previewHref: '/location',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: c('/contact'),
    icon: Contact,
    permission: 'website:content:read',
    previewHref: '/contact',
  },
  {
    id: 'footer',
    label: 'Footer',
    href: c('/footer'),
    icon: Footprints,
    permission: 'website:content:read',
  },
  {
    id: 'navigation',
    label: 'Navigation',
    href: c('/navigation'),
    icon: Navigation,
    permission: 'website:content:read',
    keywords: ['menu', 'header', 'mega menu'],
  },
  {
    id: 'seo',
    label: 'SEO',
    href: c('/seo'),
    icon: Search,
    permission: 'website:content:read',
    roles: ['SUPER_ADMIN', 'HOTEL_OWNER', 'MARKETING_MANAGER', 'SEO_MANAGER', 'CONTENT_EDITOR'],
    keywords: ['meta', 'schema', 'sitemap'],
  },
  {
    id: 'media',
    label: 'Media Library',
    href: c('/media'),
    icon: Image,
    permission: 'website:content:read',
    roles: ['SUPER_ADMIN', 'HOTEL_OWNER', 'MARKETING_MANAGER', 'GALLERY_MANAGER', 'CONTENT_EDITOR'],
    keywords: ['upload', 'assets', 's3'],
  },
  {
    id: 'forms',
    label: 'Forms',
    href: c('/forms'),
    icon: FormInput,
    permission: 'website:content:read',
    keywords: ['contact form', 'inquiry', 'booking'],
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    href: c('/newsletter'),
    icon: Mail,
    permission: 'website:content:read',
    keywords: ['subscribers', 'campaigns'],
  },
  {
    id: 'menus',
    label: 'Menus',
    href: c('/menus'),
    icon: Menu,
    permission: 'website:content:read',
    roles: ['SUPER_ADMIN', 'HOTEL_OWNER', 'RESTAURANT_MANAGER', 'CONTENT_EDITOR'],
    keywords: ['food menu', 'pdf'],
  },
  {
    id: 'blog',
    label: 'Blog',
    href: c('/blog'),
    icon: Newspaper,
    permission: 'website:content:read',
    keywords: ['posts', 'articles', 'categories'],
  },
  {
    id: 'page-builder',
    label: 'Page Builder',
    href: c('/page-builder'),
    icon: LayoutGrid,
    permission: 'website:content:manage',
    keywords: ['sections', 'drag drop', 'blocks'],
  },
  {
    id: 'settings',
    label: 'Website Settings',
    href: c('/settings'),
    icon: Settings,
    permission: 'website:content:manage',
    keywords: ['branding', 'domain', 'theme'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: c('/analytics'),
    icon: BarChart3,
    permission: 'website:content:read',
    roles: ['SUPER_ADMIN', 'HOTEL_OWNER', 'MARKETING_MANAGER', 'SEO_MANAGER'],
    keywords: ['visitors', 'conversion', 'traffic'],
  },
];

export function flattenCmsNavigation(items: CmsNavItem[] = CMS_NAVIGATION): CmsNavItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenCmsNavigation(item.children) : [])]);
}

export function resolveCmsNavFromPath(pathname: string): {
  item?: CmsNavItem;
  breadcrumbs: { label: string; href?: string }[];
} {
  const flat = flattenCmsNavigation();
  const normalized = pathname.replace(/\/$/, '') || CMS_BASE;
  const item =
    flat.find((n) => n.href === normalized || n.href === pathname) ??
    flat.find((n) => pathname.startsWith(`${n.href}/`));

  const breadcrumbs = [
    { label: 'ERP', href: '/app/dashboard' },
    { label: 'Website CMS', href: CMS_BASE },
  ];

  if (!pathname.startsWith(CMS_BASE)) {
    return { breadcrumbs };
  }

  const remainder = pathname.replace(CMS_BASE, '').split('/').filter(Boolean);
  let path = CMS_BASE;
  for (const seg of remainder) {
    path += `/${seg}`;
    const match = flat.find((n) => n.href === path);
    breadcrumbs.push({
      label: match?.label ?? seg.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
      href: path,
    });
  }

  return { item, breadcrumbs };
}

export function isCmsRoute(pathname: string): boolean {
  return pathname === CMS_BASE || pathname.startsWith(`${CMS_BASE}/`);
}

export const CMS_QUICK_ACTIONS = [
  { id: 'preview-site', label: 'Preview Website', href: '/', keywords: ['view', 'public'] },
  { id: 'new-hero', label: 'Add Hero Slide', href: c('/hero/new'), keywords: ['banner'] },
  { id: 'new-room', label: 'Add Room', href: c('/rooms/new'), keywords: ['accommodation'] },
  { id: 'new-offer', label: 'Create Offer', href: c('/offers/new'), keywords: ['promotion'] },
  { id: 'upload-media', label: 'Upload Media', href: c('/media/upload'), keywords: ['image', 'video'] },
  { id: 'edit-homepage', label: 'Edit Homepage', href: c('/homepage'), keywords: ['landing'] },
] as const;
