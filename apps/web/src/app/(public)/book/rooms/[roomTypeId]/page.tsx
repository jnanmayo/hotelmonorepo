'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { BedDouble, Check, Coffee, Shield, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookingProgress } from '@/features/booking/components/booking-progress';
import { BookingSummary } from '@/features/booking/components/booking-summary';
import { bookingService } from '@/features/booking/services/booking.service';
import { buildSearchParams, useBookingStore } from '@/features/booking/stores/booking.store';
import type { RatePlanOption } from '@tungaos/shared/types';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

function RoomDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomTypeId = params.roomTypeId as string;
  const selectRoom = useBookingStore((s) => s.selectRoom);
  const search = useBookingStore((s) => s.search);
  const selectedRatePlan = useBookingStore((s) => s.selectedRatePlan);
  const toggleAddon = useBookingStore((s) => s.toggleAddon);
  const selectedAddons = useBookingStore((s) => s.selectedAddons);

  const [room, setRoom] = useState<Awaited<ReturnType<typeof bookingService.getRoomDetail>> | null>(null);
  const [loading, setLoading] = useState(true);

  const checkIn = searchParams.get('checkIn') ?? search.checkIn;
  const checkOut = searchParams.get('checkOut') ?? search.checkOut;
  const rooms = Number(searchParams.get('rooms') ?? search.rooms);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    bookingService
      .getRoomDetail(roomTypeId, { ...search, checkIn, checkOut, rooms })
      .then(setRoom)
      .finally(() => setLoading(false));
  }, [roomTypeId, checkIn, checkOut, rooms, search]);

  const images = Array.isArray(room?.images)
    ? (room.images as { url?: string }[]).map((i) => i.url).filter(Boolean) as string[]
    : [];

  const handleSelectPlan = (plan: RatePlanOption) => {
    selectRoom(roomTypeId, plan);
  };

  if (loading) return <div className="p-16 text-center">Loading room details...</div>;
  if (!room) return <div className="p-16 text-center">Room not found</div>;

  const checkoutParams = buildSearchParams({ ...search, checkIn, checkOut, rooms });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid gap-2 sm:grid-cols-2">
            {(images.length > 0 ? images : ['/images/rooms/default.jpg']).slice(0, 4).map((img, i) => (
              <div key={i} className={cn('relative aspect-[4/3] overflow-hidden rounded-xl', i === 0 && 'sm:col-span-2 sm:row-span-2 sm:aspect-[16/9]')}>
                <Image src={img} alt={room.name} fill className="object-cover" sizes="50vw" />
              </div>
            ))}
          </div>

          <div>
            <h1 className="font-heading text-3xl font-semibold text-tunga-navy">{room.name}</h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {room.bedType && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{room.bedType}</span>}
              <span className="flex items-center gap-1"><Users className="h-4 w-4" />Up to {room.maxOccupancy} guests</span>
              {room.sizeSqm && <span>{room.sizeSqm} m²</span>}
            </div>
            <p className="mt-4 text-muted-foreground">{room.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {room.amenities?.map((a: string) => (
                <Badge key={a} variant="secondary">{a}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold">Select Rate Plan</h2>
            <div className="mt-4 space-y-3">
              {room.ratePlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition',
                    selectedRatePlan?.id === plan.id ? 'border-tunga-gold bg-tunga-gold/5 ring-1 ring-tunga-gold' : 'hover:border-slate-300',
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{plan.name}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {plan.breakfastIncluded && (
                          <span className="flex items-center gap-1 text-emerald-700"><Coffee className="h-3 w-3" />Breakfast included</span>
                        )}
                        <span className="flex items-center gap-1"><Shield className="h-3 w-3" />{plan.cancellationPolicy.replace(/_/g, ' ')}</span>
                      </div>
                      {plan.description && <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{plan.totalPrice.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">₹{plan.pricePerNight.toLocaleString('en-IN')}/night</p>
                    </div>
                  </div>
                  {selectedRatePlan?.id === plan.id && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-tunga-gold"><Check className="h-3.5 w-3.5" />Selected</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {room.addons.length > 0 && (
            <div>
              <h2 className="font-heading text-xl font-semibold">Enhance Your Stay</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {room.addons.map((addon) => {
                  const selected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={cn(
                        'rounded-xl border p-4 text-left transition',
                        selected ? 'border-tunga-gold bg-tunga-gold/5' : 'hover:border-slate-300',
                      )}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-sm font-semibold">₹{addon.price.toLocaleString('en-IN')}</p>
                      </div>
                      {addon.description && <p className="mt-1 text-xs text-muted-foreground">{addon.description}</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <BookingSummary />
          <Button
            className="mt-4 w-full bg-tunga-navy hover:bg-tunga-gold hover:text-tunga-navy"
            disabled={!selectedRatePlan}
            asChild
          >
            <Link href={asRoute(`/book/checkout?${checkoutParams}`)}>Continue to Checkout</Link>
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">{room.availableCount} rooms available</p>
        </div>
      </div>
    </div>
  );
}

export default function RoomDetailPage() {
  return (
    <>
      <BookingProgress current="room" />
      <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
        <RoomDetailContent />
      </Suspense>
    </>
  );
}
