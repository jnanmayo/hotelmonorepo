'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { asRoute } from '@/lib/navigation';
import { FRONT_DESK_ROUTES } from '@/features/front-desk/api/endpoints';

const NAV = [
  { label: 'Dashboard', href: FRONT_DESK_ROUTES.home },
  { label: 'Arrivals', href: FRONT_DESK_ROUTES.arrivals },
  { label: 'Departures', href: FRONT_DESK_ROUTES.departures },
  { label: 'Walk-in', href: FRONT_DESK_ROUTES.walkIn },
  { label: 'Room Assign', href: FRONT_DESK_ROUTES.roomAssignment },
  { label: 'Check-in', href: FRONT_DESK_ROUTES.checkIn },
  { label: 'Check-out', href: FRONT_DESK_ROUTES.checkOut },
  { label: 'Payments', href: FRONT_DESK_ROUTES.payments },
  { label: 'Calendar', href: FRONT_DESK_ROUTES.calendar },
  { label: 'Communications', href: FRONT_DESK_ROUTES.communications },
  { label: 'Complaints', href: FRONT_DESK_ROUTES.complaints },
  { label: 'Tasks', href: FRONT_DESK_ROUTES.tasks },
  { label: 'Lost & Found', href: FRONT_DESK_ROUTES.lostFound },
  { label: 'Key Cards', href: FRONT_DESK_ROUTES.keyCards },
  { label: 'Search', href: FRONT_DESK_ROUTES.search },
  { label: 'Performance', href: FRONT_DESK_ROUTES.performance },
];

export function FrontDeskNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-1 border-b pb-3">
      {NAV.map((item) => {
        const active = pathname === asRoute(item.href) || pathname.startsWith(`${asRoute(item.href)}/`);
        return (
          <Link
            key={item.href}
            href={asRoute(item.href)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function FrontDeskShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="mb-4">
        <h2 className="text-h2">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <FrontDeskNav />
      {children}
    </div>
  );
}
