'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Clock,
  DollarSign,
  Loader2,
  Receipt,
  ShoppingBag,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FNB_API,
  FNB_ROUTES,
  ORDER_FLOW_MERMAID,
  ROOM_SERVICE_FLOW_MERMAID,
} from '@/features/restaurant/constants/restaurant-navigation';
import { RestaurantShell } from '@/features/restaurant/components/restaurant-shell';
import { useRestaurantRealtime } from '@/features/restaurant/hooks/use-restaurant-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { FnbDashboardStats } from '@tungaos/shared';

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

function formatCurrency(n: number) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function FnbDashboard() {
  const [stats, setStats] = useState<FnbDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: FnbDashboardStats }>(FNB_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRestaurantRealtime(hotelId, () => load());

  if (loading) {
    return (
      <RestaurantShell title="Restaurant POS" description="Enterprise F&B — TungaOS by Sharada Sama Solutions">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </RestaurantShell>
    );
  }

  const s = stats ?? ({} as FnbDashboardStats);

  return (
    <RestaurantShell title="Restaurant Dashboard" description="Real-time sales, kitchen queue, and outlet performance">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={asRoute(FNB_ROUTES.pos)}>Open POS</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={asRoute(FNB_ROUTES.kitchen)}>Kitchen Display</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={asRoute(FNB_ROUTES.tables)}>Table Map</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Today's Sales" value={formatCurrency(s.todaySales ?? 0)} icon={DollarSign} />
        <Kpi title="Today's Orders" value={s.todayOrders ?? 0} icon={ShoppingBag} />
        <Kpi title="Avg Order Value" value={formatCurrency(s.averageOrderValue ?? 0)} icon={Receipt} />
        <Kpi title="Pending Bills" value={s.pendingBills ?? 0} icon={Receipt} />
        <Kpi title="Kitchen Queue" value={s.kitchenQueue ?? 0} icon={ChefHat} />
        <Kpi title="Orders Ready" value={s.ordersReady ?? 0} icon={UtensilsCrossed} />
        <Kpi title="Orders Delayed" value={s.ordersDelayed ?? 0} icon={Clock} />
        <Kpi title="Room Service" value={s.roomServiceOrders ?? 0} icon={UtensilsCrossed} />
        <Kpi title="Occupied Tables" value={s.occupiedTables ?? 0} icon={UtensilsCrossed} />
        <Kpi title="Available Tables" value={s.availableTables ?? 0} icon={UtensilsCrossed} />
        <Kpi title="Restaurant Rev." value={formatCurrency(s.restaurantRevenue ?? 0)} icon={DollarSign} />
        <Kpi title="Bar Rev." value={formatCurrency(s.barRevenue ?? 0)} icon={Wine} />
      </div>

      {s.topSellingItems?.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Top Selling Items Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {s.topSellingItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg border px-4 py-2">
                <span className="font-medium">{item.name}</span>
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <span>{item.quantity} sold</span>
                  <Badge variant="secondary">{formatCurrency(item.revenue)}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">{ORDER_FLOW_MERMAID}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Room Service Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">{ROOM_SERVICE_FLOW_MERMAID}</pre>
          </CardContent>
        </Card>
      </div>
    </RestaurantShell>
  );
}
