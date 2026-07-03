'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreditCard, Smartphone, Building, Wallet, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { BookingProgress } from '@/features/booking/components/booking-progress';
import { BookingSummary } from '@/features/booking/components/booking-summary';
import { bookingService } from '@/features/booking/services/booking.service';
import { useBookingStore } from '@/features/booking/stores/booking.store';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const PAYMENT_METHODS = [
  { id: 'RAZORPAY', label: 'Razorpay (UPI / Cards / Net Banking)', icon: Smartphone },
  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { id: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'NET_BANKING', label: 'Net Banking', icon: Building },
  { id: 'WALLET', label: 'Wallet', icon: Wallet },
  { id: 'CASH', label: 'Pay at Hotel', icon: Banknote },
] as const;

export default function PaymentPage() {
  const router = useRouter();
  const search = useBookingStore((s) => s.search);
  const sessionId = useBookingStore((s) => s.sessionId);
  const selectedRoomTypeId = useBookingStore((s) => s.selectedRoomTypeId);
  const selectedRatePlan = useBookingStore((s) => s.selectedRatePlan);
  const selectedAddons = useBookingStore((s) => s.selectedAddons);
  const guest = useBookingStore((s) => s.guest);
  const specialRequests = useBookingStore((s) => s.specialRequests);
  const reset = useBookingStore((s) => s.reset);

  const [method, setMethod] = useState<string>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [promoInput, setPromoInput] = useState(search.promoCode);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const applyPromo = async () => {
    if (!promoInput) return;
    try {
      const result = await bookingService.applyCoupon({
        hotelSlug: search.hotelSlug,
        code: promoInput,
        subtotal: 10000,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
      });
      if (result.valid && result.discount) {
        setPromoDiscount(result.discount);
        toast.success(`Coupon applied! You save ₹${result.discount.toLocaleString('en-IN')}`);
      } else {
        toast.error(result.message ?? 'Invalid coupon');
      }
    } catch {
      toast.error('Could not apply coupon');
    }
  };

  const handlePay = async () => {
    if (!selectedRoomTypeId || !guest.email || !guest.firstName) {
      toast.error('Please complete guest details first');
      router.push(asRoute('/book/checkout'));
      return;
    }

    setLoading(true);
    try {
      const confirmation = await bookingService.createBooking({
        hotelSlug: search.hotelSlug,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        adults: search.adults,
        children: search.children,
        rooms: search.rooms,
        roomTypeId: selectedRoomTypeId,
        ratePlanId: selectedRatePlan?.id !== 'default' ? selectedRatePlan?.id : undefined,
        addonIds: selectedAddons.map((a) => a.id),
        promoCode: promoInput || undefined,
        corporateCode: search.corporateCode || undefined,
        sessionId,
        guest: {
          firstName: guest.firstName!,
          lastName: guest.lastName!,
          email: guest.email!,
          phone: guest.phone!,
          nationality: guest.nationality,
          address: guest.address,
          city: guest.city,
          state: guest.state,
          postalCode: guest.postalCode,
          gstNumber: guest.gstNumber,
          specialRequests: specialRequests || guest.specialRequests,
        },
        paymentMethod: method as 'RAZORPAY',
      });

      reset();
      router.push(asRoute(`/book/confirmation/${confirmation.reservationCode}`));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BookingProgress current="payment" />
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-tunga-navy">Payment</h1>
        <p className="mt-1 text-muted-foreground">Choose your preferred payment method</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="font-medium">Payment Method</h2>
              <div className="mt-3 space-y-2">
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setMethod(pm.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition',
                        method === pm.id ? 'border-tunga-gold bg-tunga-gold/5 ring-1 ring-tunga-gold' : 'hover:border-slate-300',
                      )}
                    >
                      <Icon className="h-5 w-5 text-tunga-navy" />
                      <span className="text-sm font-medium">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <h2 className="font-medium">Apply Promo Code</h2>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 rounded-tunga border px-3 py-2 text-sm"
                />
                <Button type="button" variant="outline" onClick={applyPromo}>Apply</Button>
              </div>
              {promoDiscount > 0 && (
                <p className="mt-2 text-sm text-emerald-600">Discount: ₹{promoDiscount.toLocaleString('en-IN')}</p>
              )}
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="font-medium">Secure Payment</p>
              <p className="mt-1">Your payment is encrypted and processed securely via Razorpay / Stripe.</p>
            </div>
          </div>

          <div>
            <BookingSummary />
            <Button
              className="mt-4 w-full bg-tunga-navy hover:bg-tunga-gold hover:text-tunga-navy"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Processing...' : method === 'CASH' ? 'Confirm Booking (Pay at Hotel)' : 'Pay & Confirm Booking'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
