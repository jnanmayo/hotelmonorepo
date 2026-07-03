'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FRONT_DESK_API, FRONT_DESK_ROUTES } from '@/features/front-desk/api/endpoints';
import { FrontDeskShell } from '@/features/front-desk/components/front-desk-shell';
import { useFrontDeskRealtime } from '@/features/front-desk/hooks/use-front-desk-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { ArrivalBoardRow } from '@tungaos/shared';

export function ArrivalBoard() {
  const [rows, setRows] = useState<ArrivalBoardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: ArrivalBoardRow[] }>(FRONT_DESK_API.arrivals)
      .then((r) => setRows(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFrontDeskRealtime(hotelId, (event) => {
    if (['arrival:update', 'room:assigned', 'checkin:complete', 'dashboard:update'].includes(event.type)) {
      load();
    }
  });

  async function startCheckIn(id: string) {
    try {
      await apiClient.post(FRONT_DESK_API.checkInStart(id));
      toast.success('Check-in started');
      load();
    } catch {
      toast.error('Check-in failed');
    }
  }

  return (
    <FrontDeskShell title="Arrival Board" description="Today's expected arrivals and check-in status">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Arrivals Today</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-3">Booking</th>
                  <th className="pb-3 pr-3">Guest</th>
                  <th className="pb-3 pr-3">Room Type</th>
                  <th className="pb-3 pr-3">Room</th>
                  <th className="pb-3 pr-3">Payment</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-3 pr-3 font-mono text-xs">{r.reservationCode}</td>
                    <td className="py-3 pr-3">
                      {r.guestName}
                      {r.isVip && <Crown className="ml-1 inline h-3 w-3 text-amber-500" />}
                      {r.isCorporate && <Badge variant="secondary" className="ml-1 text-[10px]">Corp</Badge>}
                    </td>
                    <td className="py-3 pr-3">{r.roomTypeName}</td>
                    <td className="py-3 pr-3">{r.assignedRoom ?? '—'}</td>
                    <td className="py-3 pr-3">
                      <Badge variant={r.paymentStatus === 'PAID' ? 'default' : 'outline'}>{r.paymentStatus}</Badge>
                    </td>
                    <td className="py-3 pr-3">{r.checkInStatus}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={asRoute(FRONT_DESK_ROUTES.roomAssignment + `?reservation=${r.id}`)}>Assign</Link>
                        </Button>
                        {r.checkInStatus !== 'CHECKED_IN' && (
                          <Button variant="outline" size="sm" onClick={() => startCheckIn(r.id)}>Check-in</Button>
                        )}
                        <Button asChild variant="ghost" size="sm">
                          <Link href={asRoute(FRONT_DESK_ROUTES.folio(r.id))}>Folio</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <p className="py-8 text-center text-muted-foreground">No arrivals today</p>}
          </CardContent>
        </Card>
      )}
    </FrontDeskShell>
  );
}
