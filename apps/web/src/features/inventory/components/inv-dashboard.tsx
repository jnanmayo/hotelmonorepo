'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeftRight,
  ClipboardList,
  Loader2,
  Package,
  ShoppingCart,
  TrendingDown,
  Warehouse,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryShell } from '@/features/inventory/components/inventory-shell';
import { INV_API, INV_ROUTES } from '@/features/inventory/constants/inventory-navigation';
import { useInventoryRealtime } from '@/features/inventory/hooks/use-inventory-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { InvDashboardStats } from '@tungaos/shared';

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

export function InvDashboard() {
  const [stats, setStats] = useState<InvDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: InvDashboardStats }>(INV_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useInventoryRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(INV_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <InventoryShell title="Inventory" description="Enterprise Inventory & Store Management — TungaOS">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </InventoryShell>
    );
  }

  const s = stats ?? ({} as InvDashboardStats);
  const needsSetup = (s.totalItems ?? 0) === 0;

  return (
    <InventoryShell title="Inventory Dashboard" description="Real-time stock, consumption, and store operations across all departments">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href={asRoute(INV_ROUTES.items)}>Item Master</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(INV_ROUTES.scanner)}>Barcode Scanner</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(INV_ROUTES.mobile)}>Mobile App</Link></Button>
        {needsSetup && (
          <Button size="sm" variant="secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Initializing…' : 'Initialize Stores & Categories'}
          </Button>
        )}
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Total Items" value={s.totalItems ?? 0} icon={Package} />
        <Kpi title="Available Stock" value={s.availableStock ?? 0} icon={Warehouse} />
        <Kpi title="Low Stock" value={s.lowStock ?? 0} icon={TrendingDown} />
        <Kpi title="Out of Stock" value={s.outOfStock ?? 0} icon={AlertTriangle} />
        <Kpi title="Expired Items" value={s.expiredItems ?? 0} icon={AlertTriangle} />
        <Kpi title="Near Expiry" value={s.nearExpiry ?? 0} icon={AlertTriangle} />
        <Kpi title="Today's Consumption" value={s.todayConsumption ?? 0} icon={Package} />
        <Kpi title="Today's Receipts" value={s.todayReceipts ?? 0} icon={Package} />
        <Kpi title="Pending Requests" value={s.pendingPurchaseRequests ?? 0} icon={ClipboardList} />
        <Kpi title="Pending Approvals" value={s.pendingApprovals ?? 0} icon={ClipboardList} />
        <Kpi title="Store Transfers" value={s.storeTransfers ?? 0} icon={ArrowLeftRight} />
        <Kpi title="Stock Value" value={s.stockValue ?? 0} icon={ShoppingCart} suffix="₹" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Department Stock</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Food / Kitchen</span><span>{s.foodCost ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bar Stock</span><span>{s.barStock ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Laundry</span><span>{s.laundryStock ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Housekeeping</span><span>{s.housekeepingStock ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Maintenance</span><span>{s.maintenanceStock ?? 0}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link href={asRoute(INV_ROUTES.transfers)}>Transfer</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={asRoute(INV_ROUTES.issues)}>Issue Stock</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={asRoute(INV_ROUTES.purchaseRequests)}>Purchase Request</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={asRoute(INV_ROUTES.audits)}>Stock Audit</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Workflow</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Department Request → Store Manager Approval → Stock Issue / Transfer → Consumption → Auto Reorder → Purchase Request
          </CardContent>
        </Card>
      </div>
    </InventoryShell>
  );
}
