'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FRONT_DESK_API, FRONT_DESK_ROUTES } from '@/features/front-desk/api/endpoints';
import { FrontDeskShell } from '@/features/front-desk/components/front-desk-shell';
import { useFrontDeskRealtime } from '@/features/front-desk/hooks/use-front-desk-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { DepartureBoardRow } from '@tungaos/shared';

export function DepartureBoard() {
  const [rows, setRows] = useState<DepartureBoardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: DepartureBoardRow[] }>(FRONT_DESK_API.departures)
      .then((r) => setRows(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFrontDeskRealtime(hotelId, (event) => {
    if (['departure:update', 'checkout:complete', 'dashboard:update'].includes(event.type)) {
      load();
    }
  });

  return (
    <FrontDeskShell title="Departure Board" description="Today's check-outs and outstanding balances">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Departures Today</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-3">Guest</th>
                  <th className="pb-3 pr-3">Room</th>
                  <th className="pb-3 pr-3">Balance</th>
                  <th className="pb-3 pr-3">Restaurant</th>
                  <th className="pb-3 pr-3">Laundry</th>
                  <th className="pb-3 pr-3">Mini Bar</th>
                  <th className="pb-3 pr-3">Invoice</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-3 pr-3">{r.guestName}</td>
                    <td className="py-3 pr-3">{r.roomNumber ?? '—'}</td>
                    <td className="py-3 pr-3 font-medium">₹{r.outstandingBalance.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-3">₹{r.restaurantCharges.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-3">₹{r.laundryCharges.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-3">₹{r.miniBarCharges.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-3">
                      <Badge variant="outline">{r.invoiceStatus}</Badge>
                    </td>
                    <td className="py-3">
                      <Button asChild size="sm">
                        <Link href={asRoute(FRONT_DESK_ROUTES.checkOut + `?reservation=${r.id}`)}>Checkout</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <p className="py-8 text-center text-muted-foreground">No departures today</p>}
          </CardContent>
        </Card>
      )}
    </FrontDeskShell>
  );
}
