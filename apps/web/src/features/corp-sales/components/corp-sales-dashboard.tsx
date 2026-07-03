'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  DollarSign,
  FileText,
  Loader2,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CorpSalesShell } from '@/features/corp-sales/components/corp-sales-shell';
import { CORP_SALES_API, CORP_SALES_ROUTES } from '@/features/corp-sales/constants/corp-sales-navigation';
import { useCorpSalesRealtime } from '@/features/corp-sales/hooks/use-corp-sales-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { CorpSalesDashboardStats } from '@tungaos/shared';
import { CORP_SALES_WORKFLOW_MERMAID } from '@tungaos/shared';

function Kpi({ title, value, icon: Icon, suffix }: { title: string; value: string | number; icon: React.ElementType; suffix?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}{suffix ?? ''}</div>
      </CardContent>
    </Card>
  );
}

export function CorpSalesDashboard() {
  const [stats, setStats] = useState<CorpSalesDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient.get<{ data: CorpSalesDashboardStats }>(CORP_SALES_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useCorpSalesRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(CORP_SALES_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <CorpSalesShell title="Corporate Sales" description="Enterprise B2B Sales & Contract Management — TungaOS">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </CorpSalesShell>
    );
  }

  const s = stats ?? ({} as CorpSalesDashboardStats);
  const needsSetup = (s.contractsActive ?? 0) === 0 && (s.corporateLeads ?? 0) === 0;

  return (
    <CorpSalesShell title="Corporate Sales Executive Dashboard" description="B2B pipeline, contracts, revenue, and key account performance">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href={asRoute(CORP_SALES_ROUTES.leads)}>Corporate Leads</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(CORP_SALES_ROUTES.pipeline)}>Sales Pipeline</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(CORP_SALES_ROUTES.contracts)}>Contracts</Link></Button>
        {needsSetup && (
          <Button size="sm" variant="secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Initializing…' : 'Initialize Corporate Sales'}
          </Button>
        )}
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Corporate Leads" value={s.corporateLeads ?? 0} icon={Users} />
        <Kpi title="Qualified Leads" value={s.qualifiedLeads ?? 0} icon={Users} />
        <Kpi title="Proposals Sent" value={s.proposalsSent ?? 0} icon={FileText} />
        <Kpi title="Active Contracts" value={s.contractsActive ?? 0} icon={FileText} />
        <Kpi title="Expiring Soon" value={s.contractsExpiring ?? 0} icon={FileText} />
        <Kpi title="Corporate Revenue" value={`₹${(s.corporateRevenue ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} />
        <Kpi title="Avg Contract Value" value={`₹${(s.averageContractValue ?? 0).toLocaleString('en-IN')}`} icon={TrendingUp} />
        <Kpi title="Monthly Room Nights" value={s.monthlyRoomNights ?? 0} icon={Building2} />
        <Kpi title="Corporate Occupancy" value={s.corporateOccupancyPct ?? 0} icon={Building2} suffix="%" />
        <Kpi title="Corporate ADR" value={`₹${(s.corporateAdr ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} />
        <Kpi title="Corporate RevPAR" value={`₹${(s.corporateRevpar ?? 0).toLocaleString('en-IN')}`} icon={TrendingUp} />
        <Kpi title="Credit Outstanding" value={`₹${(s.creditOutstanding ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} />
        <Kpi title="Collection Rate" value={s.collectionStatusPct ?? 0} icon={Target} suffix="%" />
        <Kpi title="Sales Achievement" value={s.salesAchievementPct ?? 0} icon={Target} suffix="%" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Corporate Sales Workflow</CardTitle></CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{CORP_SALES_WORKFLOW_MERMAID}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Top Corporate Clients</CardTitle></CardHeader>
          <CardContent>
            {(s.topCorporateClients ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No corporate clients yet. Initialize the platform to get started.</p>
            ) : (
              <div className="space-y-2">
                {(s.topCorporateClients ?? []).map((c) => (
                  <div key={c.name} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="tabular-nums">₹{c.revenue.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CorpSalesShell>
  );
}
