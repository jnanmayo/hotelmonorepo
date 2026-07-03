'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Car,
  DollarSign,
  Fuel,
  Loader2,
  MapPin,
  Plane,
  Users,
  Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TravelDeskShell } from '@/features/travel-desk/components/travel-desk-shell';
import { TMS_API, TMS_ROUTES, TMS_WORKFLOW_MERMAID } from '@/features/travel-desk/constants/travel-desk-navigation';
import { useTravelDeskRealtime } from '@/features/travel-desk/hooks/use-travel-desk-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { TmsDashboardStats } from '@tungaos/shared';

function Kpi({ title, value, icon: Icon, suffix }: { title: string; value: string | number; icon: React.ElementType; suffix?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {typeof value === 'number' && suffix === '₹' ? `₹${value.toLocaleString('en-IN')}` : value}
          {suffix && suffix !== '₹' ? suffix : ''}
        </div>
      </CardContent>
    </Card>
  );
}

export function TmsDashboard() {
  const [stats, setStats] = useState<TmsDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: TmsDashboardStats }>(TMS_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useTravelDeskRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(TMS_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <TravelDeskShell title="Travel Desk & Fleet" description="Enterprise Transportation Management — TungaOS">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </TravelDeskShell>
    );
  }

  const s = stats ?? ({} as TmsDashboardStats);
  const needsSetup = (s.availableVehicles ?? 0) === 0 && (s.driversOnDuty ?? 0) === 0;

  return (
    <TravelDeskShell title="Executive Dashboard" description="Real-time transport operations — powered by Sharada Sama Solutions">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href={asRoute(TMS_ROUTES.dispatch)}>Dispatch Center</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(TMS_ROUTES.requests)}>Travel Desk</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(TMS_ROUTES.trips)}>All Trips</Link></Button>
        {needsSetup && (
          <Button size="sm" variant="secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Initializing…' : 'Initialize Fleet & Drivers'}
          </Button>
        )}
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Today's Trips" value={s.todaysTrips ?? 0} icon={MapPin} />
        <Kpi title="Airport Pickups" value={s.airportPickups ?? 0} icon={Plane} />
        <Kpi title="Airport Drops" value={s.airportDrops ?? 0} icon={Plane} />
        <Kpi title="Corporate Trips" value={s.corporateTrips ?? 0} icon={Users} />
        <Kpi title="VIP Transfers" value={s.vipTransfers ?? 0} icon={Users} />
        <Kpi title="Available Vehicles" value={s.availableVehicles ?? 0} icon={Car} />
        <Kpi title="Vehicles On Trip" value={s.vehiclesOnTrip ?? 0} icon={Car} />
        <Kpi title="Drivers Available" value={s.driversAvailable ?? 0} icon={Users} />
        <Kpi title="Drivers On Duty" value={s.driversOnDuty ?? 0} icon={Users} />
        <Kpi title="Pending Requests" value={s.pendingRequests ?? 0} icon={MapPin} />
        <Kpi title="Trip Revenue" value={s.tripRevenue ?? 0} icon={DollarSign} suffix="₹" />
        <Kpi title="Fuel Cost" value={s.fuelCost ?? 0} icon={Fuel} suffix="₹" />
        <Kpi title="Maintenance Cost" value={s.maintenanceCost ?? 0} icon={Wrench} suffix="₹" />
        <Kpi title="Vehicle Utilization" value={s.vehicleUtilizationPct ?? 0} icon={Car} suffix="%" />
        <Kpi title="Driver Performance" value={s.driverPerformanceAvg ?? 0} icon={Users} suffix="/5" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Live Trips</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(s.liveTrips ?? []).slice(0, 5).map((t) => (
              <div key={t.id} className="flex justify-between text-sm border-b pb-2">
                <div>
                  <div className="font-medium">{t.tripNumber} — {t.guestName}</div>
                  <div className="text-muted-foreground">{t.pickupLocation} → {t.dropLocation}</div>
                </div>
                <Badge variant="secondary">{t.status.replace(/_/g, ' ')}</Badge>
              </div>
            ))}
            {(s.liveTrips ?? []).length === 0 && <p className="text-sm text-muted-foreground">No live trips</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Pending Trips</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(s.pendingTrips ?? []).slice(0, 5).map((t) => (
              <div key={t.id} className="flex justify-between text-sm border-b pb-2">
                <div>
                  <div className="font-medium">{t.tripNumber} — {t.guestName}</div>
                  <div className="text-muted-foreground">{t.tripType.replace(/_/g, ' ')}</div>
                </div>
                <Badge variant="outline">{t.status.replace(/_/g, ' ')}</Badge>
              </div>
            ))}
            {(s.pendingTrips ?? []).length === 0 && <p className="text-sm text-muted-foreground">No pending trips</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">Transport Workflow</CardTitle></CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">{TMS_WORKFLOW_MERMAID}</pre>
        </CardContent>
      </Card>
    </TravelDeskShell>
  );
}
