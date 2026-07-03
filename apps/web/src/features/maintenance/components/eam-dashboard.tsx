'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Box,
  ClipboardList,
  Loader2,
  Shield,
  Wrench,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaintenanceShell } from '@/features/maintenance/components/maintenance-shell';
import { EAM_API, EAM_ROUTES, MAINTENANCE_WORKFLOW_MERMAID } from '@/features/maintenance/constants/maintenance-navigation';
import { useMaintenanceRealtime } from '@/features/maintenance/hooks/use-maintenance-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { EamDashboardStats } from '@tungaos/shared';

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

export function EamDashboard() {
  const [stats, setStats] = useState<EamDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: EamDashboardStats }>(EAM_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useMaintenanceRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(EAM_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <MaintenanceShell title="EAM / CMMS" description="Enterprise Asset & Maintenance Management — TungaOS">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </MaintenanceShell>
    );
  }

  const s = stats ?? ({} as EamDashboardStats);

  return (
    <MaintenanceShell title="Maintenance Dashboard" description="Real-time asset, work order, and technician operations — powered by Sharada Sama Solutions">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
          {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Initialize Categories & Safety
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={asRoute(EAM_ROUTES.workOrders)}>Work Orders</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={asRoute(EAM_ROUTES.assets)}>Asset Register</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Kpi title="Total Assets" value={s.totalAssets ?? 0} icon={Box} />
        <Kpi title="Operational" value={s.operationalAssets ?? 0} icon={Shield} />
        <Kpi title="Under Repair" value={s.assetsUnderRepair ?? 0} icon={Wrench} />
        <Kpi title="Under AMC" value={s.assetsUnderAmc ?? 0} icon={ClipboardList} />
        <Kpi title="Under Warranty" value={s.assetsUnderWarranty ?? 0} icon={Shield} />
        <Kpi title="Open Work Orders" value={s.openWorkOrders ?? 0} icon={Wrench} />
        <Kpi title="Completed (Month)" value={s.completedWorkOrders ?? 0} icon={ClipboardList} />
        <Kpi title="Overdue WOs" value={s.overdueWorkOrders ?? 0} icon={AlertTriangle} />
        <Kpi title="Emergency Repairs" value={s.emergencyRepairs ?? 0} icon={AlertTriangle} />
        <Kpi title="Maintenance Cost" value={s.maintenanceCost ?? 0} icon={Box} suffix="₹" />
        <Kpi title="MTTR (min)" value={s.mttr ?? 0} icon={Wrench} />
        <Kpi title="MTBF (days est.)" value={s.mtbf ?? 0} icon={Box} />
        <Kpi title="Tech Productivity" value={s.technicianProductivity ?? 0} icon={Wrench} suffix="/tech" />
        <Kpi title="Upcoming PM" value={s.upcomingPreventive ?? 0} icon={ClipboardList} />
        <Kpi title="Warranty Expiring" value={s.upcomingWarrantyExpiry ?? 0} icon={AlertTriangle} />
        <Kpi title="AMC Expiring" value={s.upcomingAmcExpiry ?? 0} icon={AlertTriangle} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Maintenance Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-x-auto p-3 bg-muted rounded-md">{MAINTENANCE_WORKFLOW_MERMAID}</pre>
            <p className="text-xs text-muted-foreground mt-2">
              Asset → Request → Priority → Manager Review → Technician → Work Order → Parts → Inventory → Complete → Inspect → Operational → Closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Open Requests</span><Badge>{s.openRequests ?? 0}</Badge></div>
            <div className="flex justify-between"><span>Pending Inspections</span><Badge variant="secondary">{s.pendingInspections ?? 0}</Badge></div>
            <div className="flex justify-between"><span>Downtime Hours</span><Badge variant="outline">{s.downtimeHours ?? 0}h</Badge></div>
          </CardContent>
        </Card>
      </div>
    </MaintenanceShell>
  );
}
