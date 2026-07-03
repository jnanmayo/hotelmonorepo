'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FNB_API } from '@/features/restaurant/constants/restaurant-navigation';
import { useRestaurantRealtime } from '@/features/restaurant/hooks/use-restaurant-realtime';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { KitchenOrderSummary } from '@tungaos/shared';

const COLUMNS: { key: KitchenOrderSummary['status']; label: string }[] = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'PREPARING', label: 'Preparing' },
  { key: 'READY', label: 'Ready' },
];

const NEXT_STATUS: Partial<Record<KitchenOrderSummary['status'], KitchenOrderSummary['status']>> = {
  PENDING: 'PREPARING',
  PREPARING: 'READY',
  READY: 'SERVED',
};

export function FnbKitchenBoard() {
  const [orders, setOrders] = useState<KitchenOrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: KitchenOrderSummary[] }>(FNB_API.kitchenOrders)
      .then((r) => setOrders(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRestaurantRealtime(hotelId, () => load());

  const advance = async (order: KitchenOrderSummary) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await apiClient.patch(FNB_API.kitchenStatus(order.id), { status: next });
    load();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="mb-6">
        <h2 className="text-h2">Kitchen Display System</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time KDS — pending, preparing, ready, delayed, room service, VIP priority
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          return (
            <div key={col.key}>
              <h3 className="mb-3 text-lg font-semibold">
                {col.label}
                <Badge className="ml-2" variant="secondary">{colOrders.length}</Badge>
              </h3>
              <div className="space-y-3">
                {colOrders.map((o) => (
                  <Card key={o.id} className={o.isDelayed ? 'border-red-400' : undefined}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{o.orderNumber}</CardTitle>
                        <Badge variant={o.priority === 'HIGH' ? 'default' : 'outline'}>{o.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {o.orderType.replace(/_/g, ' ')}
                        {o.tableNumber ? ` · T${o.tableNumber}` : ''}
                        {o.roomNumber ? ` · Room ${o.roomNumber}` : ''}
                        {o.isDelayed ? ' · DELAYED' : ''}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="mb-3 space-y-1 text-sm">
                        {o.items.map((item, idx) => (
                          <li key={idx}>
                            {item.quantity}× {item.name}
                            {item.notes ? ` (${item.notes})` : ''}
                          </li>
                        ))}
                      </ul>
                      {NEXT_STATUS[o.status] && (
                        <Button size="sm" className="w-full" onClick={() => advance(o)}>
                          Mark {NEXT_STATUS[o.status]!.replace(/_/g, ' ')}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {colOrders.length === 0 && (
                  <p className="text-sm text-muted-foreground">No orders</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
