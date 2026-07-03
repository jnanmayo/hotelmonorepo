/**
 * Channel Manager navigation — all routes under /app/channels/*
 */

import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  BarChart3,
  BedDouble,
  CalendarOff,
  DollarSign,
  LayoutDashboard,
  Link2,
  Plug,
  RefreshCw,
  Settings,
  Webhook,
} from 'lucide-react';

export const CHANNEL_BASE = '/app/channels' as const;

export interface ChannelNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  keywords?: string[];
}

const c = (path: string) => `${CHANNEL_BASE}${path}`;

export const CHANNEL_NAVIGATION: ChannelNavItem[] = [
  { id: 'ch-dash', label: 'Dashboard', href: c(''), icon: LayoutDashboard, keywords: ['overview', 'sync'] },
  { id: 'ch-connections', label: 'Connected Channels', href: c('/connections'), icon: Plug, keywords: ['ota', 'booking.com', 'agoda'] },
  { id: 'ch-room-map', label: 'Room Mapping', href: c('/room-mapping'), icon: BedDouble, keywords: ['map', 'inventory'] },
  { id: 'ch-rate-map', label: 'Rate Plan Mapping', href: c('/rate-mapping'), icon: Link2, keywords: ['pricing', 'rates'] },
  { id: 'ch-restrictions', label: 'Restrictions', href: c('/restrictions'), icon: CalendarOff, keywords: ['min stay', 'stop sell'] },
  { id: 'ch-sync', label: 'Sync Logs', href: c('/sync-logs'), icon: RefreshCw, keywords: ['failed', 'pending'] },
  { id: 'ch-webhooks', label: 'Webhooks', href: c('/webhooks'), icon: Webhook, keywords: ['events', 'queue'] },
  { id: 'ch-ota-bookings', label: 'OTA Bookings', href: c('/ota-bookings'), icon: ArrowLeftRight, keywords: ['reservations'] },
  { id: 'ch-commission', label: 'Commission', href: c('/commission'), icon: DollarSign, keywords: ['paid', 'outstanding'] },
  { id: 'ch-analytics', label: 'Analytics', href: c('/analytics'), icon: BarChart3, keywords: ['performance', 'revpar'] },
  { id: 'ch-settings', label: 'Settings', href: c('/settings'), icon: Settings, keywords: ['api keys', 'environment'] },
];

export const CHANNEL_SECTIONS: Record<string, { title: string; description: string; tabs?: string[] }> = {
  connections: {
    title: 'Connected Channels',
    description: 'Connect and manage OTA integrations — Booking.com, Agoda, MMT, Expedia, Airbnb, and more.',
    tabs: ['All Channels', 'Active', 'Inactive'],
  },
  'room-mapping': {
    title: 'Room Mapping',
    description: 'Map ERP room types to OTA room codes across all connected channels.',
    tabs: ['All Mappings', 'Pending Sync', 'Failed'],
  },
  'rate-mapping': {
    title: 'Rate Plan Mapping',
    description: 'Map ERP rate plans to OTA rate codes — standard, corporate, promo, and package rates.',
    tabs: ['All Mappings', 'By Channel'],
  },
  restrictions: {
    title: 'Restrictions',
    description: 'Manage minimum stay, stop sell, close to arrival, and blackout dates.',
    tabs: ['Active', 'Scheduled', 'Blackout'],
  },
  'sync-logs': {
    title: 'Sync Logs',
    description: 'Inventory, rate, and restriction sync history with retry queue.',
    tabs: ['All', 'Success', 'Failed', 'Pending'],
  },
  webhooks: {
    title: 'Webhook Events',
    description: 'Incoming OTA webhooks — bookings, cancellations, modifications, and sync events.',
    tabs: ['All Events', 'Unprocessed', 'Errors'],
  },
  'ota-bookings': {
    title: 'OTA Bookings',
    description: 'All reservations received from connected OTAs with commission tracking.',
    tabs: ['All', 'Confirmed', 'Cancelled'],
  },
  commission: {
    title: 'Commission Management',
    description: 'Track commission paid, outstanding, and savings from direct bookings.',
    tabs: ['Summary', 'By Channel', 'Outstanding'],
  },
  analytics: {
    title: 'Channel Analytics',
    description: 'Revenue by OTA, booking source mix, cancellation rate, and channel performance.',
    tabs: ['Overview', 'Revenue', 'Occupancy'],
  },
  settings: {
    title: 'Channel Settings',
    description: 'Global sync settings, webhook configuration, and queue worker preferences.',
    tabs: ['General', 'Webhooks', 'Queue'],
  },
};

export function flattenChannelNavigation(items: ChannelNavItem[] = CHANNEL_NAVIGATION): ChannelNavItem[] {
  return items;
}

export function resolveChannelNavFromPath(pathname: string): {
  item?: ChannelNavItem;
  breadcrumbs: { label: string; href?: string }[];
} {
  const flat = flattenChannelNavigation();
  const normalized = pathname.replace(/\/$/, '') || CHANNEL_BASE;
  const item = flat.find((n) => n.href === normalized || n.href === pathname);

  const breadcrumbs = [
    { label: 'ERP', href: '/app/dashboard' },
    { label: 'Channel Manager', href: CHANNEL_BASE },
  ];

  if (!pathname.startsWith(CHANNEL_BASE)) return { breadcrumbs };

  const remainder = pathname.replace(CHANNEL_BASE, '').split('/').filter(Boolean);
  let path = CHANNEL_BASE;
  for (const seg of remainder) {
    path += `/${seg}`;
    const match = flat.find((n) => n.href === path);
    const section = CHANNEL_SECTIONS[seg];
    breadcrumbs.push({
      label: match?.label ?? section?.title ?? seg.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
      href: path,
    });
  }

  return { item, breadcrumbs };
}

export function isChannelRoute(pathname: string): boolean {
  return pathname === CHANNEL_BASE || pathname.startsWith(`${CHANNEL_BASE}/`);
}

export const SUPPORTED_OTAS = [
  { id: 'BOOKING_COM', name: 'Booking.com', logo: '🅱️' },
  { id: 'AGODA', name: 'Agoda', logo: '🅰️' },
  { id: 'GOIBIBO', name: 'Goibibo', logo: '🚌' },
  { id: 'MMT', name: 'MakeMyTrip', logo: '✈️' },
  { id: 'EXPEDIA', name: 'Expedia', logo: '🌐' },
  { id: 'HOTELS_COM', name: 'Hotels.com', logo: '🏨' },
  { id: 'AIRBNB', name: 'Airbnb', logo: '🏠' },
  { id: 'TRIP_COM', name: 'Trip.com', logo: '🧳' },
  { id: 'TRAVEL_AGENT', name: 'Travel Agents', logo: '🤝' },
  { id: 'CORPORATE', name: 'Corporate Portal', logo: '🏢' },
  { id: 'DIRECT_WEBSITE', name: 'Direct Website', logo: '🌍' },
];
