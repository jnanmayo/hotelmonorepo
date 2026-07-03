'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestPortalShell } from '@/features/gxp/components/guest-portal-shell';
import { GXP_PUBLIC_API, GXP_STAY_ROUTES } from '@/features/gxp/constants/gxp-navigation';
import { useGxpRealtime } from '@/features/gxp/hooks/use-gxp-realtime';
import { createGxpClient } from '@/features/gxp/services/gxp-api';

import type { GxpDashboardData, GxpSessionContext } from '@tungaos/shared';
import { GXP_FLOW_MERMAID } from '@tungaos/shared';

export function GuestDashboard({ sessionToken, session }: { sessionToken: string; session: GxpSessionContext }) {
  const [dashboard, setDashboard] = useState<GxpDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    createGxpClient(sessionToken)
      .get<{ data: GxpDashboardData }>(GXP_PUBLIC_API.dashboard)
      .then((r) => setDashboard(r.data.data))
      .finally(() => setLoading(false));
  }, [sessionToken]);

  useEffect(() => {
    load();
  }, [load]);

  useGxpRealtime(session.hotelId, session.reservationId, () => load());

  if (loading) {
    return (
      <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      </GuestPortalShell>
    );
  }

  const d = dashboard!;

  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <div className="mb-6 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-950/40 to-slate-900/60 p-5">
        <p className="text-sm text-white/60">Welcome back</p>
        <h1 className="text-2xl font-semibold text-white">{d.guestName}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">
          {d.roomNumber && <Badge className="bg-amber-500/20 text-amber-200">Room {d.roomNumber}</Badge>}
          <Badge variant="outline" className="border-white/20 text-white/80">{d.stayDuration}</Badge>
          <Badge variant="outline" className="border-white/20 text-white/80">{d.nightsRemaining} nights left</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/50">Current Bill</p>
            <p className="text-lg font-semibold text-amber-300">₹{d.currentBill.toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-white/50">Outstanding</p>
            <p className="text-lg font-semibold">₹{d.outstandingBalance.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/50">Quick Actions</h2>
      <div className="mb-6 grid grid-cols-2 gap-3">
        {d.quickActions.map((a) => (
          <Link
            key={a.id}
            href={GXP_STAY_ROUTES.section(sessionToken, a.href)}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-400/30 hover:bg-white/10"
          >
            <p className="font-medium text-white">{a.label}</p>
          </Link>
        ))}
      </div>

      {d.offers.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/50">Today&apos;s Offers</h2>
          <div className="mb-6 space-y-2">
            {d.offers.map((o) => (
              <Card key={o.id} className="border-amber-400/20 bg-white/5 text-white">
                <CardHeader className="pb-1">
                  <CardTitle className="text-base text-amber-100">{o.title}</CardTitle>
                </CardHeader>
                {o.description && <CardContent className="text-sm text-white/60">{o.description}</CardContent>}
              </Card>
            ))}
          </div>
        </>
      )}

      {d.announcements.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/50">Announcements</h2>
          <div className="mb-6 space-y-2">
            {d.announcements.map((a) => (
              <div key={a.id} className="rounded-xl border border-white/10 p-3 text-sm text-white/70">
                <p className="font-medium text-white">{a.title}</p>
                <p className="mt-1">{a.body}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="rounded-xl border border-white/10 p-3 text-xs text-white/40">
        <p className="mb-2 font-medium text-white/60">Guest Journey</p>
        <pre className="overflow-x-auto whitespace-pre-wrap">{GXP_FLOW_MERMAID}</pre>
      </div>

      {d.hotelPhone && (
        <Button asChild className="mt-4 w-full bg-amber-500 text-slate-950 hover:bg-amber-400">
          <a href={`tel:${d.hotelPhone}`}>Call Reception</a>
        </Button>
      )}
    </GuestPortalShell>
  );
}
