'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bookingService } from '@/features/booking/services/booking.service';
import { PUBLIC_ROUTES } from '@/constants/routes';
import Link from 'next/link';
import { asRoute } from '@/lib/navigation';

export default function ManageBookingPage() {
  const params = useParams();
  const code = params.code as string;
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    bookingService
      .getBooking(code)
      .then(setBooking)
      .catch(() => toast.error('Booking not found'))
      .finally(() => setLoading(false));
  }, [code]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      await bookingService.cancelBooking(code, 'Guest requested cancellation');
      toast.success('Booking cancelled');
      const updated = await bookingService.getBooking(code);
      setBooking(updated);
    } catch {
      toast.error('Could not cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="p-16 text-center">Loading booking...</div>;
  if (!booking) return <div className="p-16 text-center">Booking not found</div>;

  const guest = booking.guest as { firstName?: string; lastName?: string; email?: string; phone?: string };
  const roomType = booking.roomType as { name?: string };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold text-tunga-navy">Manage Booking</h1>
      <p className="mt-1 text-muted-foreground">Booking #{code}</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">{roomType?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{booking.status as string}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span>{String(booking.checkInDate).split('T')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span>{String(booking.checkOutDate).split('T')[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Guest</span>
            <span>{guest?.firstName} {guest?.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{guest?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold">₹{Number(booking.totalAmount).toLocaleString('en-IN')}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        {booking.status !== 'CANCELLED' && (
          <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        )}
        <Button variant="outline">Download Invoice</Button>
        <Button variant="outline" asChild>
          <Link href={asRoute(PUBLIC_ROUTES.contact)}>Contact Hotel</Link>
        </Button>
      </div>
    </div>
  );
}
