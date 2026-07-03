import Link from 'next/link';

import { NAV_LINKS, PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

export function PublicFooter() {
  return (
    <footer className="bg-tunga-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-heading text-xl font-semibold">Tunga International Hotel</p>
            <p className="mt-2 text-sm text-white/70">
              Stay in the heart of Mumbai&apos;s business hub. Experience true hospitality.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-tunga-gold">Explore</p>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.slice(1, 5).map((link) => (
                <li key={link.key}>
                  <Link href={asRoute(link.href)} className="text-sm text-white/80 hover:text-tunga-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-tunga-gold">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>BKC, Mumbai, Maharashtra 400051</li>
              <li>
                <a href="tel:+912212345678" className="hover:text-tunga-gold">+91 22 1234 5678</a>
              </li>
              <li>
                <a href="mailto:reservations@tungahotel.com" className="hover:text-tunga-gold">
                  reservations@tungahotel.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Tunga International Hotel. All rights reserved.</p>
          <p>
            Powered by{' '}
            <Link href={PUBLIC_ROUTES.home} className="text-tunga-gold hover:underline">
              TungaOS
            </Link>{' '}
            — Sharada Sama Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
