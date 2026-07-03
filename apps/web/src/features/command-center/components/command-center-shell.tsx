'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { asRoute } from '@/lib/navigation';
import { CC_NAV } from '@/features/command-center/constants/command-center-navigation';

export function CommandCenterNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-1 overflow-x-auto border-b pb-3">
      {CC_NAV.map((item) => {
        const isHome = item.href === '/app/dashboard';
        const active = isHome
          ? pathname === '/app/dashboard'
          : pathname === asRoute(item.href) || pathname.startsWith(`${asRoute(item.href)}/`);

        return (
          <Link
            key={item.href}
            href={asRoute(item.href)}
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors',
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

export function CommandCenterShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">TungaOS Executive Intelligence</p>
        <h2 className="text-h2 mt-1">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{description}</p>}
      </div>
      <CommandCenterNav />
      {children}
    </div>
  );
}
