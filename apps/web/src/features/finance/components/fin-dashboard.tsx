'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Building2,
  Loader2,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinanceShell } from '@/features/finance/components/finance-shell';
import { FINANCE_WORKFLOW_MERMAID, FIN_API, FIN_ROUTES } from '@/features/finance/constants/finance-navigation';
import { useFinanceRealtime } from '@/features/finance/hooks/use-finance-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { FinDashboardStats } from '@tungaos/shared';

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

export function FinDashboard() {
  const [stats, setStats] = useState<FinDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: FinDashboardStats }>(FIN_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useFinanceRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(FIN_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  const handleSync = () => {
    setSyncing(true);
    apiClient.post(FIN_API.sync).then(() => load()).finally(() => setSyncing(false));
  };

  if (loading) {
    return (
      <FinanceShell title="Finance" description="Enterprise Hotel Financial Management — TungaOS">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </FinanceShell>
    );
  }

  const s = stats ?? ({} as FinDashboardStats);

  return (
    <FinanceShell title="Finance Dashboard" description="Real-time revenue, expenses, cash flow, GST — auto-posted from PMS, POS, Procurement">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
          {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Initialize COA & Cost Centers
        </Button>
        <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
          {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Sync from Modules
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={asRoute(FIN_ROUTES.nightAudit)}>Night Audit</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Kpi title="Today's Revenue" value={s.todayRevenue ?? 0} icon={TrendingUp} suffix="₹" />
        <Kpi title="Today's Expenses" value={s.todayExpenses ?? 0} icon={Receipt} suffix="₹" />
        <Kpi title="Today's Profit" value={s.todayProfit ?? 0} icon={ArrowUpRight} suffix="₹" />
        <Kpi title="Cash Balance" value={s.cashBalance ?? 0} icon={Wallet} suffix="₹" />
        <Kpi title="Bank Balance" value={s.bankBalance ?? 0} icon={Building2} suffix="₹" />
        <Kpi title="Receivables" value={s.outstandingReceivables ?? 0} icon={ArrowDownLeft} suffix="₹" />
        <Kpi title="Payables" value={s.outstandingPayables ?? 0} icon={ArrowUpRight} suffix="₹" />
        <Kpi title="GST Liability" value={s.gstLiability ?? 0} icon={Banknote} suffix="₹" />
        <Kpi title="Monthly Revenue" value={s.monthlyRevenue ?? 0} icon={TrendingUp} suffix="₹" />
        <Kpi title="Monthly Expenses" value={s.monthlyExpenses ?? 0} icon={Receipt} suffix="₹" />
        <Kpi title="Monthly Profit" value={s.monthlyProfit ?? 0} icon={ArrowUpRight} suffix="₹" />
        <Kpi title="Budget Used" value={s.budgetUtilization ?? 0} icon={Banknote} suffix="%" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Finance Workflow</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs overflow-x-auto p-3 bg-muted rounded-md">{FINANCE_WORKFLOW_MERMAID}</pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Department Revenue (Month)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(s.departmentRevenue ?? []).map((d) => (
              <div key={d.department} className="flex justify-between">
                <span>{d.department}</span>
                <Badge variant="outline">₹{d.amount.toLocaleString('en-IN')}</Badge>
              </div>
            ))}
            {(s.departmentRevenue ?? []).length === 0 && (
              <p className="text-muted-foreground">Sync from modules or post revenue entries.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </FinanceShell>
  );
}
