'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 'search', label: 'Search', href: '/book/search' },
  { key: 'room', label: 'Select Room', href: '/book/search' },
  { key: 'checkout', label: 'Guest Details', href: '/book/checkout' },
  { key: 'payment', label: 'Payment', href: '/book/payment' },
  { key: 'confirmation', label: 'Confirmation', href: '#' },
];

interface BookingProgressProps {
  current: 'search' | 'room' | 'checkout' | 'payment' | 'confirmation';
}

export function BookingProgress({ current }: BookingProgressProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Booking progress" className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 overflow-x-auto px-4 py-4 lg:px-8">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.key} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    done && 'bg-emerald-600 text-white',
                    active && 'bg-tunga-navy text-white',
                    !done && !active && 'bg-slate-100 text-slate-400',
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span
                  className={cn(
                    'hidden truncate text-xs font-medium sm:block',
                    active ? 'text-tunga-navy' : done ? 'text-emerald-700' : 'text-slate-400',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('mx-1 hidden h-px flex-1 sm:block', done ? 'bg-emerald-300' : 'bg-slate-200')} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export function BookingBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={asRoute(href)} className="text-sm text-tunga-navy/70 hover:text-tunga-gold">
      ← {label}
    </Link>
  );
}
