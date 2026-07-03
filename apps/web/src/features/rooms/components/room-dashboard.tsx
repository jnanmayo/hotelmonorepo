'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Building2,
  Crown,
  DollarSign,
  Loader2,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROOMS_API, ROOMS_ROUTES } from '@/features/rooms/constants/room-navigation';
import { RoomsShell } from '@/features/rooms/components/rooms-shell';
import { useRoomsRealtime } from '@/features/rooms/hooks/use-rooms-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { RoomDashboardStats } from '@tungaos/shared';

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

export function RoomDashboard() {
  const [stats, setStats] = useState<RoomDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: RoomDashboardStats }>(ROOMS_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRoomsRealtime(hotelId, (e) => {
    if (e.type === 'dashboard:update' || e.type === 'room:status' || e.type === 'occupancy:update') load();
  });

  if (loading) {
    return (
      <RoomsShell title="Room Management" description="Digital Twin of your hotel — TungaOS by Sharada Sama Solutions">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </RoomsShell>
    );
  }

  const s = stats ?? ({} as RoomDashboardStats);

  return (
    <RoomsShell title="Room Management" description="Real-time digital twin — occupancy, revenue, and room operations">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={asRoute(ROOMS_ROUTES.board)}>Status Board</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={asRoute(ROOMS_ROUTES.inventory)}>Property Setup</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={asRoute(ROOMS_ROUTES.allocation)}>Room Allocation</Link>
        </Button>
        <Badge variant="secondary" className="self-center">
          Live
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Total Rooms" value={s.totalRooms ?? 0} icon={Building2} />
        <Kpi title="Available" value={s.availableRooms ?? 0} icon={BedDouble} />
        <Kpi title="Occupied" value={s.occupiedRooms ?? 0} icon={Users} />
        <Kpi title="Reserved" value={s.reservedRooms ?? 0} icon={BedDouble} />
        <Kpi title="Dirty" value={s.dirtyRooms ?? 0} icon={Wrench} />
        <Kpi title="Cleaning" value={s.cleaningRooms ?? 0} icon={Wrench} />
        <Kpi title="Inspected" value={s.inspectedRooms ?? 0} icon={BedDouble} />
        <Kpi title="Blocked" value={s.blockedRooms ?? 0} icon={Building2} />
        <Kpi title="Out of Order" value={s.outOfOrderRooms ?? 0} icon={Wrench} />
        <Kpi title="Maintenance" value={s.maintenanceRooms ?? 0} icon={Wrench} />
        <Kpi title="VIP Rooms" value={s.vipRooms ?? 0} icon={Crown} />
        <Kpi title="Corporate" value={s.corporateRooms ?? 0} icon={Users} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Occupancy</span>
              <span className="font-medium">{s.averageOccupancy ?? 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Room Rate</span>
              <span className="font-medium">₹{(s.averageRoomRate ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Stay (nights)</span>
              <span className="font-medium">{s.averageStay ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Most Booked</span>
              <span className="font-medium">{s.mostBookedRoom?.roomNumber ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Least Booked</span>
              <span className="font-medium">{s.leastBookedRoom?.roomNumber ?? '—'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Today</span>
              <span className="font-medium">₹{(s.revenueToday ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-medium">₹{(s.revenueThisMonth ?? 0).toLocaleString()}</span>
            </div>
            <Button asChild variant="link" className="h-auto p-0">
              <Link href={asRoute(ROOMS_ROUTES.revenue)}>View revenue dashboard →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Quick Links</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href={asRoute(ROOMS_ROUTES.calendar)} className="text-sm text-primary hover:underline">
              Occupancy Calendar
            </Link>
            <Link href={asRoute(ROOMS_ROUTES.maintenance)} className="text-sm text-primary hover:underline">
              Maintenance Requests
            </Link>
            <Link href={asRoute(ROOMS_ROUTES.inspection)} className="text-sm text-primary hover:underline">
              Room Inspections
            </Link>
            <Link href={asRoute(ROOMS_ROUTES.reports)} className="text-sm text-primary hover:underline">
              Generate Reports
            </Link>
          </CardContent>
        </Card>
      </div>
    </RoomsShell>
  );
}
