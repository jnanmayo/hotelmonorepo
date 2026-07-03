'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Building2,
  CalendarCheck,
  CalendarX,
  Crown,
  DollarSign,
  DoorOpen,
  Loader2,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { usePmsRealtime } from '@/features/pms/hooks/use-pms-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type { PmsDashboardStats } from '@tungaos/shared';

function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  variant,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  variant?: 'default' | 'warning' | 'success';
}) {
  const border =
    variant === 'warning' ? 'border-amber-200' : variant === 'success' ? 'border-emerald-200' : undefined;
  return (
    <Card className={border}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function PmsDashboard() {
  const [stats, setStats] = useState<PmsDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient
      .get<{ data: PmsDashboardStats }>(PMS_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  usePmsRealtime(null, (event) => {
    if (event.type === 'dashboard:update') load();
  });

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const s = stats ?? ({} as PmsDashboardStats);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2">Property Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            TungaOS PMS — Real-time operational command center
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={asRoute('/app/reservations/new')}>New Reservation</Link>
          </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={asRoute('/app/front-desk/check-in')}>Check-in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href={asRoute('/app/front-desk/check-out')}>Check-out</Link>
        </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" /> Live
        </Badge>
        <span className="text-sm text-muted-foreground">
          Occupancy {s.occupancyPct ?? 0}% · {s.currentOccupancy ?? 0} of {s.totalRooms ?? 0} rooms
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Today's Arrivals" value={s.todayArrivals ?? 0} icon={CalendarCheck} />
        <KpiCard title="Today's Departures" value={s.todayDepartures ?? 0} icon={CalendarX} />
        <KpiCard
          title="Current Occupancy"
          value={`${s.occupancyPct ?? 0}%`}
          sub={`${s.currentOccupancy ?? 0} in-house`}
          icon={Users}
        />
        <KpiCard title="Available Rooms" value={s.availableRooms ?? 0} icon={DoorOpen} variant="success" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Dirty Rooms" value={s.dirtyRooms ?? 0} icon={BedDouble} variant="warning" />
        <KpiCard title="Cleaning" value={s.cleaningRooms ?? 0} icon={Sparkles} />
        <KpiCard title="Under Maintenance" value={s.underMaintenance ?? 0} icon={Wrench} variant="warning" />
        <KpiCard title="Blocked" value={s.blockedRooms ?? 0} icon={Building2} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="VIP Guests" value={s.vipGuests ?? 0} icon={Crown} />
        <KpiCard title="Corporate Guests" value={s.corporateGuests ?? 0} icon={Building2} />
        <KpiCard title="Pending Check-ins" value={s.pendingCheckIns ?? 0} icon={CalendarCheck} variant="warning" />
        <KpiCard title="Pending Check-outs" value={s.pendingCheckOuts ?? 0} icon={CalendarX} variant="warning" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Revenue Today" value={`₹${(s.revenueToday ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} />
        <KpiCard title="Room Revenue" value={`₹${(s.roomRevenue ?? 0).toLocaleString('en-IN')}`} icon={BedDouble} />
        <KpiCard
          title="Restaurant Revenue"
          value={`₹${(s.restaurantRevenue ?? 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <KpiCard title="Pending Payments" value={s.pendingPayments ?? 0} icon={DollarSign} variant="warning" />
      </div>
    </div>
  );
}
