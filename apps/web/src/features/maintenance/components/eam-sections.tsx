'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, QrCode, Smartphone } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaintenanceShell } from '@/features/maintenance/components/maintenance-shell';
import { EAM_API, EAM_ROUTES } from '@/features/maintenance/constants/maintenance-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type {
  EamAmcContractItem,
  EamAnalyticsData,
  EamAssetItem,
  EamEnergyStats,
  EamInspectionItem,
  EamMaintenanceRequestItem,
  EamOwnerDashboardStats,
  EamPmPlanItem,
  EamSafetyItem,
  EamTechnicianItem,
  EamWarrantyClaimItem,
  EamWorkOrderItem,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <MaintenanceShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </MaintenanceShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const urgent = ['EMERGENCY', 'CRITICAL', 'OPEN', 'NEW', 'OVERDUE'].some((x) => status.includes(x));
  const done = ['CLOSED', 'COMPLETED', 'RESOLVED', 'OPERATIONAL'].some((x) => status.includes(x));
  const variant = urgent ? 'danger' : done ? 'default' : 'secondary';
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
}

export function EamAssetsPage() {
  const [rows, setRows] = useState<EamAssetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamAssetItem[] }>(EAM_API.assets).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Asset Register" description="Complete asset master with QR, barcode, lifecycle, depreciation" />;

  return (
    <MaintenanceShell title="Asset Register" description="Hotel assets — AC, TV, elevator, kitchen, IT, furniture, safety equipment">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((a) => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between gap-2">
                <span className="truncate">{a.name}</span>
                <StatusBadge status={a.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-muted-foreground">{a.code} · {a.categoryName ?? 'Uncategorized'}</div>
              {a.roomNumber && <div>Room {a.roomNumber}</div>}
              {a.serialNumber && <div>S/N: {a.serialNumber}</div>}
              <div className="flex justify-between text-xs">
                <span>{a.lifecycleStage.replace(/_/g, ' ')}</span>
                {a.currentValue != null && <span>₹{a.currentValue.toLocaleString('en-IN')}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">No assets yet. Initialize from Dashboard or register via API.</p>
        )}
      </div>
    </MaintenanceShell>
  );
}

export function EamWorkOrdersPage() {
  const [rows, setRows] = useState<EamWorkOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: EamWorkOrderItem[] }>(EAM_API.workOrders).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loading title="Work Orders" description="New → Assigned → In Progress → Parts → Completed → Inspected → Closed" />;

  return (
    <MaintenanceShell title="Work Order Management" description="Corrective, preventive, and breakdown maintenance work orders">
      <div className="space-y-2">
        {rows.map((w) => (
          <Card key={w.id}>
            <CardContent className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{w.workOrderNumber} — {w.issue}</div>
                <div className="text-sm text-muted-foreground">
                  {w.assetName ?? 'No asset'} {w.roomNumber ? `· Room ${w.roomNumber}` : ''} · {w.assignedTo ?? 'Unassigned'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={w.priority} />
                <StatusBadge status={w.status} />
                {w.isPreventive && <Badge variant="outline">PM</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No work orders. Create from a maintenance request.</p>}
      </div>
    </MaintenanceShell>
  );
}

export function EamRequestsPage() {
  const [rows, setRows] = useState<EamMaintenanceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: EamMaintenanceRequestItem[] }>(EAM_API.requests).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const createWo = async (id: string) => {
    await apiClient.post(EAM_API.requestWorkOrder(id));
    load();
  };

  if (loading) return <Loading title="Maintenance Requests" description="Front Desk, HK, Restaurant, Guest Portal, IoT sources" />;

  return (
    <MaintenanceShell title="Maintenance Requests" description="Request → Priority → SLA → Manager review → Work order">
      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardContent className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{r.requestNumber} — {r.title}</div>
                <div className="text-sm text-muted-foreground">
                  {r.source.replace(/_/g, ' ')} · {r.roomNumber ? `Room ${r.roomNumber}` : r.assetName ?? 'General'}
                  {r.slaDueAt && ` · SLA ${new Date(r.slaDueAt).toLocaleString()}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={r.priority} />
                <StatusBadge status={r.status} />
                {r.status === 'OPEN' && (
                  <Button size="sm" variant="outline" onClick={() => createWo(r.id)}>Create WO</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No requests. Submit from Front Desk, HK, or Guest Portal.</p>}
      </div>
    </MaintenanceShell>
  );
}

export function EamPreventivePage() {
  const [rows, setRows] = useState<EamPmPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(() => {
    apiClient.get<{ data: EamPmPlanItem[] }>(EAM_API.preventive).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const generate = async () => {
    setGenerating(true);
    await apiClient.post(EAM_API.preventiveGenerate).finally(() => { setGenerating(false); load(); });
  };

  if (loading) return <Loading title="Preventive Maintenance" description="Daily, weekly, monthly, quarterly, yearly, meter-based schedules" />;

  return (
    <MaintenanceShell title="Preventive Maintenance" description="Automatic work order generation from PM schedules">
      <div className="mb-4">
        <Button onClick={generate} disabled={generating}>
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Generate Due Work Orders
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>{p.assetName}</div>
              <Badge variant="outline">{p.frequency.replace(/_/g, ' ')}</Badge>
              {p.nextDueAt && <div className="text-muted-foreground">Next: {new Date(p.nextDueAt).toLocaleDateString()}</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </MaintenanceShell>
  );
}

export function EamCorrectivePage() {
  const [rows, setRows] = useState<EamWorkOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamWorkOrderItem[] }>(EAM_API.workOrders)
      .then((r) => setRows(r.data.data.filter((w) => !w.isPreventive)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Corrective Maintenance" description="Breakdown, fault, damage, electrical, mechanical repairs" />;

  return (
    <MaintenanceShell title="Corrective Maintenance" description="Breakdown · Fault · Damage · Leakage · Electrical · Mechanical">
      <div className="space-y-2">
        {rows.map((w) => (
          <Card key={w.id}>
            <CardContent className="py-3 flex justify-between">
              <span>{w.workOrderNumber} — {w.issue}</span>
              <StatusBadge status={w.status} />
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No corrective work orders.</p>}
      </div>
    </MaintenanceShell>
  );
}

export function EamAmcPage() {
  const [rows, setRows] = useState<EamAmcContractItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamAmcContractItem[] }>(EAM_API.amc).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="AMC Management" description="Contract coverage, SLA, renewal reminders, service visits" />;

  return (
    <MaintenanceShell title="AMC Management" description="Annual Maintenance Contracts — vendor, coverage, SLA, renewal">
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{c.contractNumber}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>{c.vendorName}</div>
              {c.assetName && <div className="text-muted-foreground">{c.assetName}</div>}
              <div>{new Date(c.startDate).toLocaleDateString()} — {new Date(c.endDate).toLocaleDateString()}</div>
              <div className="flex justify-between"><span>₹{c.cost.toLocaleString('en-IN')}</span><StatusBadge status={c.status} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MaintenanceShell>
  );
}

export function EamWarrantyPage() {
  const [rows, setRows] = useState<EamWarrantyClaimItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamWarrantyClaimItem[] }>(EAM_API.warranty).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Warranty Management" description="Warranty claims, OEM service, expiry tracking" />;

  return (
    <MaintenanceShell title="Warranty Management" description="Track warranty, claims, OEM repairs, expiry alerts">
      <div className="space-y-2">
        {rows.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{c.claimNumber} — {c.assetName}</div>
                <div className="text-sm text-muted-foreground">{new Date(c.claimDate).toLocaleDateString()}</div>
              </div>
              <StatusBadge status={c.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </MaintenanceShell>
  );
}

export function EamTechniciansPage() {
  const [rows, setRows] = useState<EamTechnicianItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamTechnicianItem[] }>(EAM_API.technicians).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Technician Management" description="Skills, certifications, performance, current jobs" />;

  return (
    <MaintenanceShell title="Technicians" description="Maintenance team skills, workload, and performance metrics">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((t) => (
          <Card key={t.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between">
                {t.name}
                <Badge variant={t.isAvailable ? 'default' : 'secondary'}>{t.isAvailable ? 'Available' : 'Busy'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>{t.department ?? 'Maintenance'}</div>
              <div>Jobs: {t.currentJobs} active · {t.completedJobs} done</div>
              {t.performanceScore != null && <div>Score: {t.performanceScore}/100</div>}
              {t.skills.length > 0 && <div className="text-xs text-muted-foreground">{t.skills.join(', ')}</div>}
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No technician profiles. Link staff to maintenance team.</p>}
      </div>
    </MaintenanceShell>
  );
}

export function EamPartsPage() {
  const [rows, setRows] = useState<EamWorkOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamWorkOrderItem[] }>(EAM_API.workOrders)
      .then((r) => setRows(r.data.data.filter((w) => w.partsCost > 0 || ['WAITING_FOR_PARTS', 'IN_PROGRESS'].includes(w.status))))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Parts Management" description="Spare parts consumption integrated with Inventory module" />;

  return (
    <MaintenanceShell title="Parts & Spares" description="Parts issued to work orders — auto-updates inventory stock">
      <div className="space-y-2">
        {rows.map((w) => (
          <Card key={w.id}>
            <CardContent className="py-3 flex justify-between">
              <span>{w.workOrderNumber} — {w.issue}</span>
              <span className="font-medium">Parts: ₹{w.partsCost.toLocaleString('en-IN')}</span>
            </CardContent>
          </Card>
        ))}
        <p className="text-xs text-muted-foreground mt-4">
          Issue parts via Work Order API — integrates with{' '}
          <Link href={asRoute('/app/inventory')} className="underline">Inventory Module</Link>.
        </p>
      </div>
    </MaintenanceShell>
  );
}

export function EamInspectionPage() {
  const [rows, setRows] = useState<EamInspectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamInspectionItem[] }>(EAM_API.inspections).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Inspection Management" description="Electrical, mechanical, cleaning, safety, performance checklists" />;

  return (
    <MaintenanceShell title="Inspections" description="Post-repair and scheduled asset inspections with photo evidence">
      <div className="space-y-2">
        {rows.map((i) => (
          <Card key={i.id}>
            <CardContent className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{i.inspectionType.replace(/_/g, ' ')}</div>
                <div className="text-sm text-muted-foreground">{i.assetName ?? i.workOrderNumber ?? '—'}</div>
              </div>
              {i.passed == null ? <Badge variant="secondary">Pending</Badge> : i.passed ? <Badge>Passed</Badge> : <Badge variant="danger">Failed</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
    </MaintenanceShell>
  );
}

export function EamSafetyPage() {
  const [rows, setRows] = useState<EamSafetyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamSafetyItem[] }>(EAM_API.safety).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Safety Compliance" description="Fire extinguishers, smoke detectors, emergency exits, first aid" />;

  return (
    <MaintenanceShell title="Safety Compliance" description="Fire · Smoke · Emergency lights · Exits · First aid kits">
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((s) => (
          <Card key={s.id}>
            <CardContent className="py-3">
              <div className="font-medium">{s.equipmentType.replace(/_/g, ' ')}</div>
              <div className="text-sm text-muted-foreground">{s.location}</div>
              <div className="flex justify-between mt-2">
                <StatusBadge status={s.complianceStatus} />
                {s.nextDue && <span className="text-xs">Due {new Date(s.nextDue).toLocaleDateString()}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MaintenanceShell>
  );
}

export function EamEnergyPage() {
  const [stats, setStats] = useState<EamEnergyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamEnergyStats }>(EAM_API.energy).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Energy Monitoring" description="Electricity, water, gas — IoT-ready meter integration" />;

  const s = stats ?? { electricityTotal: 0, waterTotal: 0, monthlyTrend: [], departmentUsage: [], peakHours: [] };

  return (
    <MaintenanceShell title="Energy Monitoring" description="Consumption by department, room, peak hours — future IoT integration">
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <KpiCard title="Electricity (month)" value={`${s.electricityTotal.toLocaleString()} kWh`} />
        <KpiCard title="Water (month)" value={`${s.waterTotal.toLocaleString()} L`} />
      </div>
      {s.departmentUsage.length > 0 && (
        <Card className="mb-4">
          <CardHeader><CardTitle className="text-base">Department Usage</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.departmentUsage}>
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </MaintenanceShell>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
    </Card>
  );
}

export function EamRoomsPage() {
  const [rows, setRows] = useState<EamAssetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamAssetItem[] }>(EAM_API.assets)
      .then((r) => setRows(r.data.data.filter((a) => a.roomNumber)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Room Asset Integration" description="Assets per room — history, complaints, inspections" />;

  const byRoom = rows.reduce<Record<string, EamAssetItem[]>>((acc, a) => {
    const key = a.roomNumber!;
    (acc[key] ??= []).push(a);
    return acc;
  }, {});

  return (
    <MaintenanceShell title="Room Assets" description="Integrated with PMS Room Management — assets, maintenance history per room">
      <div className="space-y-4">
        {Object.entries(byRoom).map(([room, assets]) => (
          <Card key={room}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Room {room}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                {assets.map((a) => (
                  <li key={a.id} className="flex justify-between">
                    <span>{a.name} ({a.categoryName})</span>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
              <Button variant="link" size="sm" className="px-0 mt-2" asChild>
                <Link href={asRoute('/app/rooms/maintenance')}>Room maintenance history →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {Object.keys(byRoom).length === 0 && (
          <p className="text-sm text-muted-foreground">Assign assets to rooms in Asset Register to see room-level view.</p>
        )}
      </div>
    </MaintenanceShell>
  );
}

export function EamOwnerPage() {
  const [stats, setStats] = useState<EamOwnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamOwnerDashboardStats }>(EAM_API.ownerDashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Owner Dashboard" description="Maintenance cost, asset value, depreciation, AMC spend" />;

  const s = stats ?? {} as EamOwnerDashboardStats;

  return (
    <MaintenanceShell title="Owner Dashboard" description="Executive view — costs, asset value, replacement planning">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard title="Maintenance Cost" value={`₹${(s.maintenanceCost ?? 0).toLocaleString('en-IN')}`} />
        <KpiCard title="Asset Value" value={`₹${(s.assetValue ?? 0).toLocaleString('en-IN')}`} />
        <KpiCard title="Depreciation" value={`₹${(s.assetDepreciation ?? 0).toLocaleString('en-IN')}`} />
        <KpiCard title="AMC Cost" value={`₹${(s.amcCost ?? 0).toLocaleString('en-IN')}`} />
      </div>
      {s.topExpensiveAssets && s.topExpensiveAssets.length > 0 && (
        <Card className="mb-4">
          <CardHeader><CardTitle className="text-base">Most Expensive Assets (Maintenance)</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            {s.topExpensiveAssets.map((a) => (
              <div key={a.name} className="flex justify-between"><span>{a.name}</span><span>₹{a.cost.toLocaleString('en-IN')}</span></div>
            ))}
          </CardContent>
        </Card>
      )}
    </MaintenanceShell>
  );
}

export function EamReportsPage() {
  const reports = ['assets', 'work-orders', 'requests', 'amc', 'warranty', 'inspection', 'safety', 'energy', 'downtime'];

  return (
    <MaintenanceShell title="Reports" description="Asset register, work orders, AMC, warranty, technician, energy, safety">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((type) => (
          <Card key={type} className="cursor-pointer hover:bg-muted/50">
            <CardContent className="py-4 capitalize">{type.replace(/-/g, ' ')} Report</CardContent>
          </Card>
        ))}
      </div>
    </MaintenanceShell>
  );
}

export function EamAnalyticsPage() {
  const [data, setData] = useState<EamAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: EamAnalyticsData }>(EAM_API.analytics).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Analytics" description="Cost analysis, failure rate, technician productivity, downtime" />;

  const d = data ?? { costByDepartment: [], failureRate: [], repairFrequency: [], technicianProductivity: [], downtimeByAsset: [] };

  return (
    <MaintenanceShell title="Maintenance Analytics" description="Cost by department, failure patterns, repair frequency">
      <div className="grid gap-4 lg:grid-cols-2">
        {d.costByDepartment.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Cost by Department</CardTitle></CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.costByDepartment}>
                  <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="cost" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
        {d.technicianProductivity.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Technician Productivity</CardTitle></CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.technicianProductivity}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </MaintenanceShell>
  );
}

export function EamScannerPage() {
  return (
    <MaintenanceShell title="Asset Scanner" description="QR / barcode scan for asset lookup and work order creation">
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
          <QrCode className="h-16 w-16 text-muted-foreground" />
          <p className="text-sm text-muted-foreground max-w-md">
            Scan asset QR codes or barcodes to view asset details, maintenance history, and create work orders on mobile.
          </p>
          <Button asChild><Link href={asRoute(EAM_ROUTES.mobile)}>Open Mobile App</Link></Button>
        </CardContent>
      </Card>
    </MaintenanceShell>
  );
}

export function EamMobilePage() {
  return (
    <MaintenanceShell title="Technician Mobile" description="Work orders, inspections, QR scanner — offline-ready architecture">
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
          <Smartphone className="h-16 w-16 text-muted-foreground" />
          <p className="text-sm text-muted-foreground max-w-md">
            Mobile PWA for technicians and maintenance managers — accept jobs, update status, capture photos, complete inspections.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge>Work Orders</Badge>
            <Badge variant="secondary">QR Scanner</Badge>
            <Badge variant="outline">Inspections</Badge>
            <Badge variant="outline">Offline Mode</Badge>
          </div>
        </CardContent>
      </Card>
    </MaintenanceShell>
  );
}
