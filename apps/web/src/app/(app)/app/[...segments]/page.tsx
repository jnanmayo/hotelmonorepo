import { notFound } from 'next/navigation';

import { APP_BASE, flattenNavigation, isAppRoute } from '@/constants/navigation';
import { ModulePlaceholder } from '@/components/shell/module-placeholder';

interface ModulePageProps {
  params: Promise<{ segments: string[] }>;
}

export async function generateMetadata({ params }: ModulePageProps) {
  const { segments } = await params;
  const path = `${APP_BASE}/${segments.join('/')}`;
  const item = flattenNavigation().find((n) => n.href === path);
  return { title: item?.label ?? segments[0] ?? 'Module' };
}

export default async function AppModulePage({ params }: ModulePageProps) {
  const { segments } = await params;
  const path = `${APP_BASE}/${segments.join('/')}`;

  if (!isAppRoute(path)) {
    notFound();
  }

  // Website CMS has dedicated routes under /app/website/*
  if (segments[0] === 'website') {
    notFound();
  }

  // Front Desk has dedicated routes
  if (segments[0] === 'front-desk') {
    notFound();
  }

  // Reservations has dedicated dashboard
  if (segments[0] === 'reservations') {
    notFound();
  }

  // Dashboard, analytics, reports, ai have dedicated pages
  if (['dashboard', 'analytics', 'reports', 'ai'].includes(segments[0] ?? '')) {
    notFound();
  }

  // Room Management has dedicated routes under /app/rooms/*
  if (segments[0] === 'rooms') {
    notFound();
  }

  // Housekeeping has dedicated routes under /app/housekeeping/*
  if (segments[0] === 'housekeeping') {
    notFound();
  }

  // Restaurant POS has dedicated routes under /app/restaurant/* and /app/kitchen/*
  if (segments[0] === 'restaurant' || segments[0] === 'kitchen') {
    notFound();
  }

  // Guest Experience Platform has dedicated routes under /app/gxp/*
  if (segments[0] === 'gxp') {
    notFound();
  }

  // Inventory has dedicated routes under /app/inventory/*
  if (segments[0] === 'inventory') {
    notFound();
  }

  // Procurement has dedicated routes under /app/procurement/*
  if (segments[0] === 'procurement') {
    notFound();
  }

  // Maintenance / EAM has dedicated routes under /app/maintenance/*
  if (segments[0] === 'maintenance') {
    notFound();
  }

  // Legacy purchase/vendors redirect to procurement
  if (segments[0] === 'purchase' || segments[0] === 'vendors') {
    notFound();
  }

  if (segments[0] === 'crm' && segments[1] === 'guests' && segments[2]) {
    notFound();
  }

  // CRM has dedicated routes under /app/crm/*
  if (segments[0] === 'crm') {
    notFound();
  }

  // Legacy corporate redirects to Corporate Sales platform
  if (segments[0] === 'corporate') {
    notFound();
  }

  // Corporate Sales has dedicated routes under /app/corporate-sales/*
  if (segments[0] === 'corporate-sales') {
    notFound();
  }

  // Finance has dedicated routes under /app/finance/*
  if (segments[0] === 'finance') {
    notFound();
  }

  // Legacy accounting redirects to finance
  if (segments[0] === 'accounting') {
    notFound();
  }

  // Channel Manager has dedicated routes
  if (segments[0] === 'channels') {
    notFound();
  }

  // HRMS has dedicated routes under /app/hr/*
  if (segments[0] === 'hr') {
    notFound();
  }

  // Events has dedicated routes under /app/events/*
  if (segments[0] === 'events') {
    notFound();
  }

  // Travel Desk / TMS has dedicated routes under /app/travel-desk/*
  if (segments[0] === 'travel-desk') {
    notFound();
  }

  // Legacy employees/payroll redirect to HR
  if (segments[0] === 'employees' || segments[0] === 'payroll') {
    notFound();
  }

  const item = flattenNavigation().find((n) => n.href === path);
  const title =
    item?.label ??
    segments[segments.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ??
    'Module';

  return (
    <ModulePlaceholder
      title={title}
      iconKey={item?.key ?? 'dashboard'}
      description={`The ${title} module is connected to the enterprise shell. Business logic ships separately.`}
    />
  );
}
