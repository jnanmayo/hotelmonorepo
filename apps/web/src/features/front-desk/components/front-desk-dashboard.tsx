'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CalendarCheck,
  CalendarX,
  Crown,
  DollarSign,
  Loader2,
  MessageSquare,
  Plane,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FRONT_DESK_API, FRONT_DESK_ROUTES } from '@/features/front-desk/api/endpoints';
import { FrontDeskShell } from '@/features/front-desk/components/front-desk-shell';
import { useFrontDeskRealtime } from '@/features/front-desk/hooks/use-front-desk-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { FrontDeskDashboardStats } from '@tungaos/shared';

function Kpi({ title, value, icon: Icon, warn }: { title: string; value: string | number; icon: React.ElementType; warn?: boolean }) {
  return (
    <Card className={warn ? 'border-amber-200' : undefined}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

export function FrontDeskDashboard() {
  const [stats, setStats] = useState<FrontDeskDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: FrontDeskDashboardStats }>(FRONT_DESK_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFrontDeskRealtime(hotelId, (event) => {
    if (event.type === 'dashboard:update') load();
  });

  if (loading) {
    return (
      <FrontDeskShell title="Front Desk" description="Real-time operations command center">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </FrontDeskShell>
    );
  }

  const s = stats ?? ({} as FrontDeskDashboardStats);

  return (
    <FrontDeskShell title="Front Desk" description="Real-time operations command center — TungaOS by Sharada Sama Solutions">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={asRoute(FRONT_DESK_ROUTES.walkIn)}>Walk-in Guest</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={asRoute(FRONT_DESK_ROUTES.arrivals)}>Arrival Board</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={asRoute(FRONT_DESK_ROUTES.departures)}>Departure Board</Link>
        </Button>
      </div>

      <Badge variant="secondary" className="mb-4">Live · Socket.io enabled</Badge>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Today's Arrivals" value={s.todayArrivals ?? 0} icon={CalendarCheck} />
        <Kpi title="Today's Departures" value={s.todayDepartures ?? 0} icon={CalendarX} />
        <Kpi title="Current Check-ins" value={s.currentCheckIns ?? 0} icon={Users} />
        <Kpi title="Pending Check-ins" value={s.pendingCheckIns ?? 0} icon={CalendarCheck} warn />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Pending Check-outs" value={s.pendingCheckOuts ?? 0} icon={CalendarX} warn />
        <Kpi title="Walk-in Today" value={s.walkInGuests ?? 0} icon={Users} />
        <Kpi title="Available Rooms" value={s.availableRooms ?? 0} icon={Users} />
        <Kpi title="Occupied Rooms" value={s.occupiedRooms ?? 0} icon={Users} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Dirty Rooms" value={s.dirtyRooms ?? 0} icon={AlertTriangle} warn />
        <Kpi title="Cleaning" value={s.cleaningRooms ?? 0} icon={AlertTriangle} />
        <Kpi title="Maintenance" value={s.maintenanceRooms ?? 0} icon={AlertTriangle} warn />
        <Kpi title="VIP Guests" value={s.vipGuests ?? 0} icon={Crown} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Corporate Guests" value={s.corporateGuests ?? 0} icon={Users} />
        <Kpi title="Pending Payments" value={s.pendingPayments ?? 0} icon={DollarSign} warn />
        <Kpi title="Today's Revenue" value={`₹${(s.todayRevenue ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} />
        <Kpi title="Restaurant Charges" value={`₹${(s.restaurantCharges ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Laundry Charges" value={`₹${(s.laundryCharges ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} />
        <Kpi title="Airport Pickups" value={s.airportPickups ?? 0} icon={Plane} />
        <Kpi title="Late Checkouts" value={s.lateCheckouts ?? 0} icon={CalendarX} warn />
        <Kpi title="Early Check-ins" value={s.earlyCheckIns ?? 0} icon={CalendarCheck} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Kpi title="Open Complaints" value={s.openComplaints ?? 0} icon={AlertTriangle} warn />
        <Kpi title="Unread Messages" value={s.unreadMessages ?? 0} icon={MessageSquare} warn />
      </div>
    </FrontDeskShell>
  );
}
