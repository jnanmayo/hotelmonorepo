'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  ClipboardCheck,
  Loader2,
  Package,
  Sparkles,
  Users,
  WashingMachine,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HK_API, HK_ROUTES } from '@/features/housekeeping/constants/housekeeping-navigation';
import { HousekeepingShell } from '@/features/housekeeping/components/housekeeping-shell';
import { useHousekeepingRealtime } from '@/features/housekeeping/hooks/use-housekeeping-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { HkDashboardStats } from '@tungaos/shared';

function Kpi({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  return (
    <Card>
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

export function HkDashboard() {
  const [stats, setStats] = useState<HkDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: HkDashboardStats }>(HK_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useHousekeepingRealtime(hotelId, () => load());

  if (loading) {
    return (
      <HousekeepingShell title="Housekeeping" description="Real-time operations — TungaOS by Sharada Sama Solutions">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </HousekeepingShell>
    );
  }

  const s = stats ?? ({} as HkDashboardStats);

  return (
    <HousekeepingShell title="Housekeeping Dashboard" description="Real-time room cleaning, laundry, and staff operations">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={asRoute(HK_ROUTES.tasks)}>Task Board</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={asRoute(HK_ROUTES.mobile)}>Staff Mobile</Link>
        </Button>
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Total Rooms" value={s.totalRooms ?? 0} icon={BedDouble} />
        <Kpi title="Dirty" value={s.dirtyRooms ?? 0} icon={Sparkles} />
        <Kpi title="Cleaning" value={s.cleaningRooms ?? 0} icon={Sparkles} />
        <Kpi title="Ready" value={s.readyRooms ?? 0} icon={BedDouble} />
        <Kpi title="Awaiting Inspection" value={s.awaitingInspection ?? 0} icon={ClipboardCheck} />
        <Kpi title="Deep Cleaning" value={s.deepCleaningRooms ?? 0} icon={Sparkles} />
        <Kpi title="Maintenance" value={s.maintenanceRooms ?? 0} icon={Package} />
        <Kpi title="Pending Tasks" value={s.pendingTasks ?? 0} icon={ClipboardCheck} />
        <Kpi title="Completed Today" value={s.completedToday ?? 0} icon={ClipboardCheck} />
        <Kpi title="Avg Clean (min)" value={s.averageCleaningMinutes ?? 0} icon={Sparkles} />
        <Kpi title="Staff On Duty" value={s.staffOnDuty ?? 0} icon={Users} />
        <Kpi title="Laundry Pending" value={s.laundryPending ?? 0} icon={WashingMachine} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Operations</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Lost & Found</span><span>{s.lostFoundItems ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Guest Requests</span><span>{s.guestRequests ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Complaints</span><span>{s.complaints ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Cleaning Score</span><span>{s.cleaningScore ?? 0}%</span></div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Workflow</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Checkout → Dirty → Task Created → Staff Assigned → Cleaning → Inspection → Room Ready → Front Desk Notified
          </CardContent>
        </Card>
      </div>
    </HousekeepingShell>
  );
}
