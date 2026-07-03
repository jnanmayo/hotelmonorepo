'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { usePmsRealtime } from '@/features/pms/hooks/use-pms-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type { PmsReservationSummary } from '@tungaos/shared';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'danger' | 'outline'> = {
  CONFIRMED: 'default',
  GUARANTEED: 'default',
  CHECKED_IN: 'secondary',
  CHECKED_OUT: 'outline',
  CANCELLED: 'danger',
  NO_SHOW: 'danger',
  PENDING: 'outline',
  WAITLISTED: 'outline',
};

export function PmsReservationsList() {
  const [items, setItems] = useState<PmsReservationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    apiClient
      .get<{ data: { items: PmsReservationSummary[] } }>(PMS_API.reservations)
      .then((r) => setItems(r.data.data.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  usePmsRealtime(null, (e) => {
    if (e.type === 'reservation:update') load();
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2">Reservations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Direct, OTA, walk-in, corporate, travel agent & group bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button asChild size="sm">
            <Link href={asRoute('/app/reservations/new')}>
              <Plus className="mr-2 h-4 w-4" /> New Reservation
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
          <CardDescription>Modify, cancel, transfer, or duplicate from reservation detail</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No reservations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4">Code</th>
                    <th className="pb-3 pr-4">Check-in</th>
                    <th className="pb-3 pr-4">Check-out</th>
                    <th className="pb-3 pr-4">Room</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4 text-right">Amount</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 pr-4 font-mono text-xs">{r.reservationCode}</td>
                      <td className="py-3 pr-4">{r.checkInDate}</td>
                      <td className="py-3 pr-4">{r.checkOutDate}</td>
                      <td className="py-3 pr-4">{r.roomNumber ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={STATUS_VARIANT[r.status] ?? 'outline'}>{r.status}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-right">₹{r.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={asRoute(`/app/reservations/${r.id}`)}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
