'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type { PmsReservationDetail } from '@tungaos/shared';

export default function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [reservation, setReservation] = useState<PmsReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    apiClient
      .get<{ data: PmsReservationDetail }>(PMS_API.reservation(id))
      .then((r) => setReservation(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !reservation) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2">{reservation.reservationCode}</h2>
          <p className="text-sm text-muted-foreground">
            {reservation.guest.firstName} {reservation.guest.lastName}
          </p>
        </div>
        <Badge>{reservation.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stay Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Check-in: {reservation.checkInDate}</p>
            <p>Check-out: {reservation.checkOutDate}</p>
            <p>Room type: {reservation.roomType.name}</p>
            <p>Room: {reservation.room?.roomNumber ?? 'Unassigned'}</p>
            <p>Source: {reservation.source}</p>
            <p>Guests: {reservation.adults} adults, {reservation.children} children</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Room rate: ₹{reservation.roomRate.toLocaleString('en-IN')}/night</p>
            <p>Tax: ₹{reservation.taxAmount.toLocaleString('en-IN')}</p>
            <p>Paid: ₹{reservation.paidAmount.toLocaleString('en-IN')}</p>
            <p className="font-semibold">Balance: ₹{reservation.balanceAmount.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={asRoute(`/app/crm/guests/${reservation.guest.id}`)}>Guest Profile</Link>
        </Button>
        <Button asChild size="sm">
          <Link href={asRoute('/app/reservations/check-in')}>Check-in</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href={asRoute('/app/reservations/check-out')}>Check-out</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {reservation.timeline.map((e) => (
              <li key={e.id} className="border-l-2 border-primary/30 pl-4">
                <p className="font-medium">{e.eventType}</p>
                <p className="text-muted-foreground">{e.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(e.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
