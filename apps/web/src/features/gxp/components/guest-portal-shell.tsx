'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { GXP_GUEST_NAV, GXP_STAY_ROUTES } from '@/features/gxp/constants/gxp-navigation';

export function GuestPortalShell({
  sessionToken,
  hotelName,
  children,
}: {
  sessionToken: string;
  hotelName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-400/80">TungaOS Guest</p>
            <p className="text-sm font-medium text-white/90">{hotelName ?? 'Digital Concierge'}</p>
          </div>
          <span className="rounded-full border border-amber-400/30 px-2 py-0.5 text-[10px] text-amber-300">PWA</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-24 pt-4">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg justify-around py-2">
          {GXP_GUEST_NAV.slice(0, 5).map((item) => {
            const href = item.slug
              ? GXP_STAY_ROUTES.section(sessionToken, item.slug)
              : GXP_STAY_ROUTES.home(sessionToken);
            const active = pathname === href || (item.slug && pathname.includes(`/${item.slug}`));

            return (
              <Link
                key={item.slug || 'home'}
                href={href}
                className={cn(
                  'flex flex-col items-center px-2 py-1 text-[10px]',
                  active ? 'text-amber-400' : 'text-white/50 hover:text-white/80',
                )}
              >
                <span className="mb-0.5 text-base">{iconFor(item.slug)}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function iconFor(slug: string) {
  const map: Record<string, string> = {
    '': '🏠',
    room: '🛏️',
    dining: '🍽️',
    concierge: '🛎️',
    folio: '🧾',
    chat: '💬',
    checkout: '🚪',
  };
  return map[slug] ?? '•';
}
