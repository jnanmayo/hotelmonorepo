'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';

import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

export function FloatingBookButton() {
  return (
    <Link
      href={asRoute(PUBLIC_ROUTES.book)}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-tunga-gold px-5 py-3 text-sm font-semibold text-tunga-navy shadow-tunga-lg transition hover:scale-105 hover:bg-white md:bottom-8 md:left-8"
      aria-label="Book now"
    >
      <Calendar className="h-4 w-4" />
      <span className="hidden sm:inline">Book Now</span>
      <span className="sm:hidden">Book</span>
    </Link>
  );
}
