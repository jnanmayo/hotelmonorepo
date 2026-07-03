'use client';

import { Calendar, Users, Tag, Building2, Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PUBLIC_ROUTES } from '@/constants/routes';
import { buildSearchParams, useBookingStore } from '@/features/booking/stores/booking.store';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface BookingWidgetProps {
  sticky?: boolean;
  className?: string;
  compact?: boolean;
}

export function BookingWidget({ sticky = true, className, compact = false }: BookingWidgetProps) {
  const router = useRouter();
  const storeSearch = useBookingStore((s) => s.search);
  const setSearch = useBookingStore((s) => s.setSearch);

  const [checkIn, setCheckIn] = useState(storeSearch.checkIn);
  const [checkOut, setCheckOut] = useState(storeSearch.checkOut);
  const [adults, setAdults] = useState(storeSearch.adults);
  const [children, setChildren] = useState(storeSearch.children);
  const [rooms, setRooms] = useState(storeSearch.rooms);
  const [promo, setPromo] = useState(storeSearch.promoCode);
  const [corporate, setCorporate] = useState(storeSearch.corporateCode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    const search = {
      hotelSlug: 'tunga-international',
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      promoCode: promo,
      corporateCode: corporate,
    };
    setSearch(search);
    const params = buildSearchParams(search);
    router.push(asRoute(`/book/search?${params}`));
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className={cn('z-40 w-full', sticky && 'sticky top-[72px]', className)}>
      <form onSubmit={handleSearch} className="mx-auto max-w-7xl px-4 lg:px-8" aria-label="Search availability">
        <div className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-tunga-lg backdrop-blur-xl md:p-6">
          {!compact && (
            <div className="mb-4 flex items-center gap-2 text-sm text-tunga-navy/70">
              <MapPin className="h-4 w-4 text-tunga-gold" />
              <span className="font-medium">Tunga International, Mumbai</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Best Rate Guarantee
              </span>
            </div>
          )}

          <div className={cn('grid gap-4', compact ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-6')}>
            <Field label="Check-in" icon={<Calendar className="h-4 w-4" />}>
              <input
                type="date"
                value={checkIn}
                min={minDate}
                onChange={(e) => setCheckIn(e.target.value)}
                className={inputClass}
                required
                aria-label="Check-in date"
              />
            </Field>
            <Field label="Check-out" icon={<Calendar className="h-4 w-4" />}>
              <input
                type="date"
                value={checkOut}
                min={checkIn || minDate}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputClass}
                required
                aria-label="Check-out date"
              />
            </Field>
            <Field label="Adults" icon={<Users className="h-4 w-4" />}>
              <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className={inputClass} aria-label="Adults">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
            {!compact && (
              <>
                <Field label="Children" icon={<Users className="h-4 w-4" />}>
                  <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className={inputClass} aria-label="Children">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Rooms" icon={<Building2 className="h-4 w-4" />}>
                  <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className={inputClass} aria-label="Rooms">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </Field>
              </>
            )}
            <div className={cn('flex items-end', compact && 'md:col-span-1')}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-tunga bg-tunga-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-tunga-gold hover:text-tunga-navy"
              >
                <Search className="h-4 w-4" />
                {compact ? 'Search' : 'Search Rooms'}
              </button>
            </div>
          </div>

          {!compact && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Promo Code" icon={<Tag className="h-4 w-4" />}>
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className={inputClass}
                  aria-label="Promo code"
                />
              </Field>
              <Field label="Corporate Code" icon={<Building2 className="h-4 w-4" />}>
                <input
                  type="text"
                  value={corporate}
                  onChange={(e) => setCorporate(e.target.value.toUpperCase())}
                  placeholder="Enter corporate code"
                  className={inputClass}
                  aria-label="Corporate code"
                />
              </Field>
            </div>
          )}

          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Book direct and save up to 15% vs OTAs · <a href={PUBLIC_ROUTES.offers} className="underline">View offers</a>
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-tunga-navy/70">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-tunga border border-slate-200 bg-white px-3 py-2.5 text-sm text-tunga-navy outline-none transition focus:border-tunga-gold focus:ring-1 focus:ring-tunga-gold';
