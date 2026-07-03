'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Download, Mail, MessageCircle, QrCode } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookingProgress } from '@/features/booking/components/booking-progress';
import { bookingService } from '@/features/booking/services/booking.service';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

export default function ConfirmationPage() {
  const params = useParams();
  const code = params.code as string;
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    bookingService.getBooking(code).then(setBooking).catch(() => {});
  }, [code]);

  return (
    <>
      <BookingProgress current="confirmation" />
      <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
          <h1 className="mt-4 font-heading text-3xl font-semibold text-tunga-navy">Booking Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for booking direct with Tunga International
          </p>
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Confirmation Number</p>
                <p className="font-heading text-2xl font-bold text-tunga-navy">{code}</p>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-slate-50">
                <QrCode className="h-10 w-10 text-tunga-navy/40" />
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              {booking && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest</span>
                    <span className="font-medium">
                      {(booking.guest as { firstName?: string })?.firstName}{' '}
                      {(booking.guest as { lastName?: string })?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room</span>
                    <span className="font-medium">{(booking.roomType as { name?: string })?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-emerald-600">{booking.status as string}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-bold">₹{Number(booking.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
            <Mail className="h-4 w-4 text-tunga-gold" />
            <span>Confirmation email sent</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            <span>WhatsApp notification sent</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
            <Calendar className="h-4 w-4 text-tunga-navy" />
            <span>Added to ERP</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="outline" asChild>
            <Link href={asRoute(`/book/manage/${code}`)}>Manage Booking</Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          <Button asChild className="bg-tunga-navy">
            <Link href={PUBLIC_ROUTES.home}>Back to Home</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
