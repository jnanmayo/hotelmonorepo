'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ClipboardList,
  FileText,
  Loader2,
  Package,
  ShoppingCart,
  Truck,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcurementShell } from '@/features/procurement/components/procurement-shell';
import { PROC_API, PROC_ROUTES } from '@/features/procurement/constants/procurement-navigation';
import { useProcurementRealtime } from '@/features/procurement/hooks/use-procurement-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { ProcDashboardStats } from '@tungaos/shared';

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

export function ProcDashboard() {
  const [stats, setStats] = useState<ProcDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: ProcDashboardStats }>(PROC_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useProcurementRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(PROC_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <ProcurementShell title="Procurement" description="Enterprise Procurement Management — TungaOS">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ProcurementShell>
    );
  }

  const s = stats ?? ({} as ProcDashboardStats);

  return (
    <ProcurementShell title="Procurement Dashboard" description="Purchase requests, RFQs, POs, GRNs, and vendor performance — real-time">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href={asRoute(PROC_ROUTES.purchaseRequests)}>New PR</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(PROC_ROUTES.vendors)}>Vendors</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={PROC_ROUTES.vendorPortal}>Vendor Portal</Link></Button>
        <Button size="sm" variant="secondary" onClick={handleSeed} disabled={seeding}>
          {seeding ? 'Initializing…' : 'Initialize Categories & Budgets'}
        </Button>
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Pending PRs" value={s.pendingPurchaseRequests ?? 0} icon={ClipboardList} />
        <Kpi title="Pending RFQs" value={s.pendingRfqs ?? 0} icon={FileText} />
        <Kpi title="Pending Quotations" value={s.pendingQuotations ?? 0} icon={FileText} />
        <Kpi title="Pending POs" value={s.pendingPurchaseOrders ?? 0} icon={ShoppingCart} />
        <Kpi title="Pending GRN" value={s.pendingGoodsReceipt ?? 0} icon={Truck} />
        <Kpi title="Pending Invoices" value={s.pendingInvoices ?? 0} icon={FileText} />
        <Kpi title="Today's Purchases" value={s.todayPurchases ?? 0} icon={Package} />
        <Kpi title="Monthly Purchases" value={s.monthlyPurchases ?? 0} icon={Package} />
        <Kpi title="Purchase Value" value={s.purchaseValue ?? 0} icon={ShoppingCart} suffix="₹" />
        <Kpi title="Budget Used" value={s.budgetUtilization ?? 0} icon={AlertTriangle} suffix="%" />
        <Kpi title="Late Deliveries" value={s.lateDeliveries ?? 0} icon={AlertTriangle} />
        <Kpi title="Rejected GRNs" value={s.rejectedDeliveries ?? 0} icon={AlertTriangle} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Vendors</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(s.topVendors ?? []).map((v, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-muted-foreground">{v.name}</span>
                <span>₹{v.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
            {(s.topVendors ?? []).length === 0 && <p className="text-muted-foreground">No vendor data yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Workflow</CardTitle></CardHeader>
          <CardContent className="text-xs text-muted-foreground font-mono leading-relaxed">
            Department → PR → Dept Approval → PM Approval → RFQ → Quotation → Comparison → PO → GRN → Inventory → Invoice Match → Closed
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link href={asRoute(PROC_ROUTES.rfqs)}>Create RFQ</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={asRoute(PROC_ROUTES.purchaseOrders)}>Purchase Orders</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={asRoute(PROC_ROUTES.grns)}>Goods Receipt</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={asRoute(PROC_ROUTES.analytics)}>Analytics</Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Procurement Flow</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto text-sm">
          <pre className="text-muted-foreground whitespace-pre">{`flowchart TD
    A[Department] --> B[Purchase Request]
    B --> C[Department Approval]
    C --> D[Purchase Manager Approval]
    D --> E[RFQ Generated]
    E --> F[Vendor Quotation]
    F --> G[Comparison]
    G --> H[Vendor Selected]
    H --> I[Purchase Order]
    I --> J[Goods Receipt]
    J --> K[Inventory Updated]
    K --> L[Invoice Verification]
    L --> M[Finance Approval]
    M --> N[Vendor Payment]
    N --> O[Purchase Closed]`}</pre>
          <p className="mt-2 text-xs text-muted-foreground">Full procurement lifecycle integrated with Inventory module.</p>
        </CardContent>
      </Card>
    </ProcurementShell>
  );
}
