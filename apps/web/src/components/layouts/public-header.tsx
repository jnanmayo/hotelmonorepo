import Link from 'next/link';

import { AUTH_ROUTES, NAV_LINKS, PUBLIC_ROUTES } from '@/constants/routes';
import { Logo } from '@/components/common/logo';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface PublicHeaderProps {
  activePath?: string;
}

export function PublicHeader({ activePath }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-tunga-navy text-white shadow-tunga">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Logo href={PUBLIC_ROUTES.home} size="sm" inverted className="shrink-0" />

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const isActive = activePath === link.href;
            return (
              <Link
                key={link.key}
                href={asRoute(link.href)}
                className={cn(
                  'relative px-3 py-2 text-xs font-medium tracking-wide transition-colors hover:text-tunga-gold',
                  isActive ? 'text-tunga-gold' : 'text-white/90',
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-tunga-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href="tel:+912212345678"
            className="hidden items-center gap-1 text-sm text-white/80 hover:text-white md:flex"
          >
            <span aria-hidden>📞</span>
            <span>+91 22 1234 5678</span>
          </a>
          <Link
            href={AUTH_ROUTES.login}
            className="rounded-tunga bg-tunga-gold px-4 py-2 text-xs font-semibold tracking-wide text-tunga-navy transition hover:bg-white"
          >
            BOOK NOW
          </Link>
        </div>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto border-t border-white/10 px-4 py-2 lg:hidden"
        aria-label="Mobile"
      >
        {NAV_LINKS.map((link) => {
          const isActive = activePath === link.href;
          return (
            <Link
              key={link.key}
              href={asRoute(link.href)}
              className={cn(
                'shrink-0 rounded-tunga px-3 py-1.5 text-xs font-medium',
                isActive ? 'bg-tunga-gold text-tunga-navy' : 'text-white/80 hover:bg-white/10',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
