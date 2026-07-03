'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { asRoute } from '@/lib/navigation';
import { FNB_NAV } from '@/features/restaurant/constants/restaurant-navigation';

export function RestaurantNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-1 border-b pb-3">
      {FNB_NAV.map((item) => {
        const isHome = item.href === '/app/restaurant';
        const active = isHome
          ? pathname === '/app/restaurant'
          : pathname === asRoute(item.href) || pathname.startsWith(`${asRoute(item.href)}/`);

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

export function RestaurantShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="mb-4">
        <h2 className="text-h2">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <RestaurantNav />
      {children}
    </div>
  );
}
