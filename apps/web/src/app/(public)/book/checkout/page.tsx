'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookingProgress } from '@/features/booking/components/booking-progress';
import { BookingSummary } from '@/features/booking/components/booking-summary';
import { bookingService } from '@/features/booking/services/booking.service';
import { useBookingStore } from '@/features/booking/stores/booking.store';
import { asRoute } from '@/lib/navigation';
import { guestDetailsSchema, type GuestDetailsInput } from '@tungaos/shared/validation';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = useBookingStore((s) => s.search);
  const sessionId = useBookingStore((s) => s.sessionId);
  const selectedRoomTypeId = useBookingStore((s) => s.selectedRoomTypeId);
  const selectedRatePlan = useBookingStore((s) => s.selectedRatePlan);
  const selectedAddons = useBookingStore((s) => s.selectedAddons);
  const setGuest = useBookingStore((s) => s.setGuest);
  const setQuote = useBookingStore((s) => s.setQuote);
  const specialRequests = useBookingStore((s) => s.specialRequests);
  const setSpecialRequests = useBookingStore((s) => s.setSpecialRequests);
  const [loading, setLoading] = useState(false);

  const checkIn = searchParams.get('checkIn') ?? search.checkIn;
  const checkOut = searchParams.get('checkOut') ?? search.checkOut;

  const { register, handleSubmit, formState: { errors } } = useForm<GuestDetailsInput>({
    resolver: zodResolver(guestDetailsSchema),
  });

  useEffect(() => {
    if (!selectedRoomTypeId || !checkIn || !checkOut) return;
    bookingService
      .getQuote({
        hotelSlug: search.hotelSlug,
        checkIn,
        checkOut,
        adults: search.adults,
        children: search.children,
        rooms: search.rooms,
        roomTypeId: selectedRoomTypeId,
        ratePlanId: selectedRatePlan?.id !== 'default' ? selectedRatePlan?.id : undefined,
        addonIds: selectedAddons.map((a) => a.id),
        promoCode: search.promoCode || undefined,
        corporateCode: search.corporateCode || undefined,
      })
      .then(setQuote)
      .catch(() => {});
  }, [selectedRoomTypeId, checkIn, checkOut, search, selectedRatePlan, selectedAddons, setQuote]);

  useEffect(() => {
    if (!selectedRoomTypeId) {
      router.replace(asRoute(`/book/search?checkIn=${checkIn}&checkOut=${checkOut}`));
    }
  }, [selectedRoomTypeId, router, checkIn, checkOut]);

  const onSubmit = async (data: GuestDetailsInput) => {
    setGuest(data);
    setLoading(true);
    try {
      if (selectedRoomTypeId) {
        await bookingService.createHold({
          hotelSlug: search.hotelSlug,
          sessionId,
          roomTypeId: selectedRoomTypeId,
          roomCount: search.rooms,
          checkIn,
          checkOut,
        });
      }
      router.push(asRoute('/book/payment'));
    } catch {
      toast.error('Unable to hold room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-tunga-navy">Guest Details</h1>
      <p className="mt-1 text-muted-foreground">Complete your details to proceed to payment</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register('firstName')} className="mt-1.5" />
              {errors.firstName && <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register('lastName')} className="mt-1.5" />
              {errors.lastName && <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register('email')} className="mt-1.5" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" {...register('phone')} className="mt-1.5" />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" {...register('nationality')} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input id="gstNumber" {...register('gstNumber')} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} className="mt-1.5" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register('state')} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register('postalCode')} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="High floor, twin beds, late arrival, celebration setup..."
              className="mt-1.5"
              rows={3}
            />
          </div>

          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm font-medium">Special Request Options</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['High Floor', 'Twin Bed', 'Extra Pillow', 'Airport Pickup', 'Late Arrival', 'Anniversary Setup'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSpecialRequests(specialRequests ? `${specialRequests}, ${opt}` : opt)}
                  className="rounded-full border px-3 py-1 text-xs hover:bg-slate-50"
                >
                  + {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <BookingSummary />
          <Button type="submit" className="mt-4 w-full bg-tunga-navy" disabled={loading}>
            {loading ? 'Holding room...' : 'Continue to Payment'}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Room held for 15 minutes · <Link href={asRoute('/book/search')} className="underline">Modify search</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <BookingProgress current="checkout" />
      <Suspense fallback={<div className="p-16 text-center">Loading checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </>
  );
}
