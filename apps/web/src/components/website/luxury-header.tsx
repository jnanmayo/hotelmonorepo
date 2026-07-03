'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  BedDouble,
  Building2,
  Calendar,
  ChevronRight,
  Globe,
  ImageIcon,
  Info,
  LogIn,
  Mail,
  Menu,
  Phone,
  Sparkles,
  Star,
  UtensilsCrossed,
  X,
} from 'lucide-react';

import { Logo } from '@/components/common/logo';
import { AUTH_ROUTES, NAV_LINKS, PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Sparkles,
  rooms: BedDouble,
  dining: UtensilsCrossed,
  meetings: Calendar,
  corporate: Building2,
  offers: Star,
  gallery: ImageIcon,
  amenities: Sparkles,
  experiences: Star,
  about: Info,
  contact: Mail,
};

interface LuxuryHeaderProps {
  activePath?: string;
  transparent?: boolean;
  phone?: string;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function LuxuryHeader({
  activePath,
  transparent = false,
  phone = '+91 22 1234 5678',
  mobileOpen: mobileOpenProp,
  onMobileOpenChange,
}: LuxuryHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpenInternal, setMobileOpenInternal] = useState(false);

  const mobileOpen = mobileOpenProp ?? mobileOpenInternal;
  const setMobileOpen = onMobileOpenChange ?? setMobileOpenInternal;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isTransparent = transparent && !scrolled && !mobileOpen;

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 w-full transition-all duration-500',
          isTransparent
            ? 'bg-transparent text-white'
            : 'bg-tunga-navy/95 text-white shadow-tunga backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <Logo href={PUBLIC_ROUTES.home} size="sm" inverted className="shrink-0" />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
            {NAV_LINKS.slice(0, 8).map((link) => (
              <NavItem key={link.key} link={link} activePath={activePath} />
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 rounded-tunga px-3 py-2 text-xs font-medium text-white/80 transition hover:text-tunga-gold"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{phone}</span>
            </a>
            <button
              type="button"
              className="flex items-center gap-1 rounded-tunga px-2 py-2 text-xs text-white/80 transition hover:text-tunga-gold"
              aria-label="Change language"
            >
              <Globe className="h-3.5 w-3.5" />
              EN
            </button>
            <Link
              href={AUTH_ROUTES.login}
              className="rounded-tunga px-3 py-2 text-xs font-medium text-white/80 transition hover:text-tunga-gold"
            >
              Login
            </Link>
            <Link
              href={asRoute(PUBLIC_ROUTES.book)}
              className="rounded-tunga bg-tunga-gold px-5 py-2.5 text-xs font-semibold tracking-wide text-tunga-navy transition hover:bg-white"
            >
              Book Now
            </Link>
          </div>

          <button
            type="button"
            className="rounded-tunga p-2 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobile}
            aria-label="Close menu"
          />

          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-gradient-to-b from-tunga-navy via-tunga-navy to-[#0a1628] shadow-2xl">
            <div className="relative overflow-hidden border-b border-white/10 px-5 pb-5 pt-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_55%)]" />
              <div className="relative flex items-center justify-between">
                <Logo href={PUBLIC_ROUTES.home} size="sm" inverted />
                <button
                  type="button"
                  onClick={closeMobile}
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="relative mt-3 text-xs tracking-[0.25em] text-tunga-gold uppercase">
                Luxury Hospitality
              </p>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const Icon = NAV_ICONS[link.key] ?? ChevronRight;
                  const isActive = activePath === link.href;

                  return (
                    <li key={link.key}>
                      <Link
                        href={asRoute(link.href)}
                        onClick={closeMobile}
                        className={cn(
                          'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-tunga-gold text-tunga-navy shadow-md'
                            : 'text-white/90 hover:bg-white/10 hover:text-white',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                            isActive ? 'bg-tunga-navy/10' : 'bg-white/5 group-hover:bg-white/10',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{link.label}</span>
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 opacity-0 transition-all group-hover:opacity-60',
                            isActive && 'opacity-80',
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-2 border-t border-white/10 bg-black/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 transition hover:border-tunga-gold/40 hover:text-tunga-gold"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
              <Link
                href={AUTH_ROUTES.login}
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-tunga-gold hover:bg-white/5"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href={asRoute(PUBLIC_ROUTES.book)}
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 rounded-xl bg-tunga-gold px-4 py-3 text-sm font-semibold text-tunga-navy shadow-tunga transition hover:bg-white"
              >
                <Calendar className="h-4 w-4" />
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ link, activePath }: { link: (typeof NAV_LINKS)[number]; activePath?: string }) {
  const isActive = activePath === link.href;
  return (
    <Link
      href={asRoute(link.href)}
      className={cn(
        'relative px-2.5 py-2 text-[11px] font-medium tracking-wide transition-colors hover:text-tunga-gold',
        isActive ? 'text-tunga-gold' : 'text-white/85',
      )}
    >
      {link.label}
      {isActive && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-tunga-gold" />}
    </Link>
  );
}
