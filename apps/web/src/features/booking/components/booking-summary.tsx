'use client';

import { useBookingStore } from '@/features/booking/stores/booking.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function BookingSummary() {
  const search = useBookingStore((s) => s.search);
  const quote = useBookingStore((s) => s.quote);
  const selectedRatePlan = useBookingStore((s) => s.selectedRatePlan);
  const selectedAddons = useBookingStore((s) => s.selectedAddons);

  const nights =
    search.checkIn && search.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(search.checkOut).getTime() - new Date(search.checkIn).getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {search.checkIn && (
          <div className="space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>Check-in</span>
              <span className="font-medium text-foreground">{search.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span className="font-medium text-foreground">{search.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests</span>
              <span className="font-medium text-foreground">
                {search.adults} adults{search.children > 0 ? `, ${search.children} children` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Rooms</span>
              <span className="font-medium text-foreground">{search.rooms}</span>
            </div>
            {nights > 0 && (
              <div className="flex justify-between">
                <span>Nights</span>
                <span className="font-medium text-foreground">{nights}</span>
              </div>
            )}
          </div>
        )}

        {selectedRatePlan && (
          <>
            <Separator />
            <div className="flex justify-between">
              <span>{selectedRatePlan.name}</span>
              <span>₹{selectedRatePlan.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </>
        )}

        {selectedAddons.map((addon) => (
          <div key={addon.id} className="flex justify-between text-muted-foreground">
            <span>{addon.name}</span>
            <span>₹{addon.price.toLocaleString('en-IN')}</span>
          </div>
        ))}

        {quote && (
          <>
            <Separator />
            {quote.breakdown.map((line) => (
              <div key={line.label} className="flex justify-between text-muted-foreground">
                <span className="truncate pr-2">{line.label}</span>
                <span className={line.amount < 0 ? 'text-emerald-600' : ''}>
                  {line.amount < 0 ? '-' : ''}₹{Math.abs(line.amount).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-base font-bold text-tunga-navy">
              <span>Total</span>
              <span>₹{quote.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </>
        )}

        <p className="text-center text-[10px] text-muted-foreground">
          Best Rate Guarantee · Book Direct & Save
        </p>
      </CardContent>
    </Card>
  );
}
