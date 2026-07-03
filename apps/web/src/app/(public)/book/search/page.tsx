'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

import { BookingWidget } from '@/components/website/booking-widget';
import { BookingProgress } from '@/features/booking/components/booking-progress';
import { RoomResultCard } from '@/features/booking/components/room-result-card';
import { bookingService } from '@/features/booking/services/booking.service';
import { useBookingStore } from '@/features/booking/stores/booking.store';
import type { AvailableRoom } from '@tungaos/shared/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const sessionId = useBookingStore((s) => s.sessionId);
  const setSearch = useBookingStore((s) => s.setSearch);
  const [rooms, setRooms] = useState<AvailableRoom[]>([]);
  const [hotelName, setHotelName] = useState('Tunga International');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkIn = searchParams.get('checkIn') ?? '';
  const checkOut = searchParams.get('checkOut') ?? '';
  const adults = Number(searchParams.get('adults') ?? 2);
  const children = Number(searchParams.get('children') ?? 0);
  const roomsCount = Number(searchParams.get('rooms') ?? 1);
  const promo = searchParams.get('promo') ?? '';
  const corporate = searchParams.get('corporate') ?? '';

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    setSearch({ checkIn, checkOut, adults, children, rooms: roomsCount, promoCode: promo, corporateCode: corporate });

    setLoading(true);
    setError(null);
    bookingService
      .search({ hotelSlug: 'tunga-international', checkIn, checkOut, adults, children, rooms: roomsCount, sessionId })
      .then((data) => {
        setRooms(data.rooms);
        setHotelName(data.hotel.name);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [checkIn, checkOut, adults, children, roomsCount, promo, corporate, sessionId, setSearch]);

  if (!checkIn || !checkOut) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Select your dates to search available rooms.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-tunga-navy">Available Rooms</h1>
        <p className="mt-1 text-muted-foreground">
          {hotelName} · {checkIn} → {checkOut} · {adults} adults
          {children > 0 ? `, ${children} children` : ''} · {roomsCount} room{roomsCount > 1 ? 's' : ''}
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-medium text-amber-900">Unable to load availability</p>
          <p className="mt-1 text-sm text-amber-700">{error}</p>
          <p className="mt-2 text-xs text-amber-600">Showing best available rates. Connect the API to see live inventory.</p>
        </div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="rounded-xl border p-12 text-center">
          <p className="text-lg font-medium">No rooms available for selected dates</p>
          <p className="mt-2 text-sm text-muted-foreground">Try different dates or fewer rooms.</p>
        </div>
      )}

      <div className="space-y-6">
        {rooms.map((room) => (
          <RoomResultCard key={room.roomTypeId} room={room} />
        ))}
      </div>
    </div>
  );
}

export default function BookSearchPage() {
  return (
    <>
      <BookingProgress current="search" />
      <BookingWidget sticky={false} className="py-4" compact />
      <Suspense fallback={<div className="p-8 text-center">Searching rooms...</div>}>
        <SearchResults />
      </Suspense>
    </>
  );
}
