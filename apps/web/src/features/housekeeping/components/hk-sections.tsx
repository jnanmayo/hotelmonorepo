'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Smartphone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HK_API } from '@/features/housekeeping/constants/housekeeping-navigation';
import { HousekeepingShell } from '@/features/housekeeping/components/housekeeping-shell';
import { HkTasksBoard } from '@/features/housekeeping/components/hk-tasks-board';
import { apiClient } from '@/services/api-client';

import type {
  HkGuestRequestItem,
  HkInspectionItem,
  HkLaundryOrder,
  HkLinenItem,
  HkLostFoundItem,
  HkStaffSummary,
  HkTaskItem,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <HousekeepingShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </HousekeepingShell>
  );
}

export function HkInspectionPage() {
  const [items, setItems] = useState<HkInspectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: HkInspectionItem[] }>(HK_API.inspections).then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Supervisor Inspection" description="Checklist, photos, quality score, approve or reject" />;

  return (
    <HousekeepingShell title="Supervisor Inspection" description="Approve or reject completed cleaning tasks">
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div><span className="font-medium">Room {i.roomNumber}</span><div className="text-xs text-muted-foreground">{new Date(i.inspectedAt).toLocaleString()}</div></div>
            <div className="flex gap-2"><Badge variant="outline">Score: {i.qualityScore}</Badge><Badge>{i.status}</Badge></div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No inspections yet. Complete a task to trigger inspection.</p>}
      </div>
    </HousekeepingShell>
  );
}

export function HkLaundryPage() {
  const [orders, setOrders] = useState<HkLaundryOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: HkLaundryOrder[] }>(HK_API.laundry).then((r) => setOrders(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const advance = async (id: string, status: string) => {
    await apiClient.patch(HK_API.laundryStatus(id), { status });
    load();
  };

  if (loading) return <Loading title="Laundry Management" description="Collect → Wash → Dry → Iron → Fold → Store → Ready" />;

  const nextStatus: Record<string, string> = { COLLECTED: 'IN_PROCESS', IN_PROCESS: 'READY', READY: 'DELIVERED' };

  return (
    <HousekeepingShell title="Laundry Management" description="Track bed sheets, towels, uniforms through every stage">
      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{o.orderNumber}</div>
              <div className="text-xs text-muted-foreground">Room {o.roomNumber ?? '—'} · {o.itemCount} items · ₹{o.totalAmount}</div>
            </div>
            <div className="flex gap-2">
              <Badge>{o.status.replace(/_/g, ' ')}</Badge>
              {nextStatus[o.status] && (
                <Button size="sm" variant="outline" onClick={() => advance(o.id, nextStatus[o.status]!)}>
                  → {nextStatus[o.status]!.replace(/_/g, ' ')}
                </Button>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-sm text-muted-foreground">No laundry orders.</p>}
      </div>
    </HousekeepingShell>
  );
}

export function HkLinenPage() {
  const [items, setItems] = useState<HkLinenItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: HkLinenItem[] }>(HK_API.linen).then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const seed = () => apiClient.post(HK_API.linenSeed, {}).then(() => load());

  if (loading) return <Loading title="Linen Inventory" description="Available, in laundry, damaged, lost lifecycle" />;

  return (
    <HousekeepingShell title="Linen Inventory" description="Track every linen item across the hotel">
      {items.length === 0 && (
        <Button size="sm" className="mb-4" onClick={seed}>Initialize Default Linen Stock</Button>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((i) => (
          <Card key={i.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{i.itemName}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>Available: <strong>{i.available}</strong></div>
              <div>In Laundry: <strong>{i.inLaundry}</strong></div>
              <div>Damaged: <strong>{i.damaged}</strong></div>
              <div>Lost: <strong>{i.lost}</strong></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </HousekeepingShell>
  );
}

export function HkLostFoundPage() {
  const [items, setItems] = useState<HkLostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: HkLostFoundItem[] }>(HK_API.lostFound).then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Lost & Found" description="Enterprise lost & found with QR labels" />;

  return (
    <HousekeepingShell title="Lost & Found" description="Track items found in rooms and public areas">
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
            <div><span className="font-medium">{i.itemName}</span> · Room {i.roomNumber ?? '—'}</div>
            <Badge>{i.status}</Badge>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No lost & found items.</p>}
      </div>
    </HousekeepingShell>
  );
}

export function HkGuestRequestsPage() {
  const [items, setItems] = useState<HkGuestRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: HkGuestRequestItem[] }>(HK_API.guestRequests).then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Guest Requests" description="Extra pillows, towels, cleaning, baby crib, and more" />;

  return (
    <HousekeepingShell title="Guest Requests" description="Housekeeping-related guest service requests">
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
            <div><span className="font-medium">{i.requestType.replace(/_/g, ' ')}</span><div className="text-xs text-muted-foreground">{i.description}</div></div>
            <Badge>{i.status}</Badge>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No pending guest requests.</p>}
      </div>
    </HousekeepingShell>
  );
}

export function HkStaffPage() {
  const [staff, setStaff] = useState<HkStaffSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: HkStaffSummary[] }>(HK_API.staff).then((r) => setStaff(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Housekeeping Staff" description="Performance, workload, and attendance" />;

  return (
    <HousekeepingShell title="Housekeeping Staff" description="Staff workload, performance scores, and task counts">
      <div className="space-y-2">
        {staff.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.employeeCode} · {s.department ?? 'Housekeeping'}</div>
            </div>
            <div className="flex gap-2 text-sm">
              <Badge variant="outline">{s.activeTasks} active</Badge>
              <Badge variant="outline">{s.completedToday} today</Badge>
              <Badge>{s.performanceScore}%</Badge>
            </div>
          </div>
        ))}
        {staff.length === 0 && <p className="text-sm text-muted-foreground">No housekeeping staff found. Add staff with department &quot;Housekeeping&quot;.</p>}
      </div>
    </HousekeepingShell>
  );
}

export function HkDeepCleaningPage() {
  const [schedules, setSchedules] = useState<{ id: string; roomId: string; frequency: string; nextDueDate: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: typeof schedules }>(HK_API.deepCleaning).then((r) => setSchedules(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Deep Cleaning Schedule" description="Weekly, monthly, quarterly, yearly schedules" />;

  return (
    <HousekeepingShell title="Deep Cleaning Schedule" description="Scheduled deep cleaning calendar">
      {schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground">No deep cleaning schedules configured.</p>
      ) : (
        schedules.map((s) => (
          <div key={s.id} className="mb-2 rounded-lg border px-4 py-3 text-sm">
            Room {s.roomId.slice(0, 8)}… · {s.frequency} · Due {s.nextDueDate.split('T')[0]}
          </div>
        ))
      )}
    </HousekeepingShell>
  );
}

export function HkReportsPage() {
  const [reportType, setReportType] = useState('cleaning');
  const [report, setReport] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(() => {
    setLoading(true);
    apiClient.get<{ data: unknown }>(HK_API.report(reportType)).then((r) => setReport(r.data.data)).finally(() => setLoading(false));
  }, [reportType]);

  useEffect(() => { generate(); }, [generate]);

  return (
    <HousekeepingShell title="Housekeeping Reports" description="Cleaning, staff performance, laundry, and linen reports">
      <div className="mb-4 flex flex-wrap gap-2">
        {['cleaning', 'staff', 'laundry', 'linen'].map((t) => (
          <Button key={t} size="sm" variant={reportType === t ? 'default' : 'outline'} onClick={() => setReportType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>
      {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
        <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">{JSON.stringify(report, null, 2)}</pre>
      )}
    </HousekeepingShell>
  );
}

export function HkMobilePage() {
  const [tasks, setTasks] = useState<HkTaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: HkTaskItem[] }>(`${HK_API.tasks}?status=ASSIGNED`).then((r) => setTasks(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-6">
        <div className="flex items-center gap-2 mb-6"><Smartphone className="h-5 w-5" /><h2 className="text-lg font-bold">HK Mobile</h2></div>
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-6 flex items-center gap-2">
        <Smartphone className="h-5 w-5" />
        <div>
          <h2 className="text-lg font-bold">Housekeeping Mobile</h2>
          <p className="text-xs text-muted-foreground">Today&apos;s tasks — accept, clean, complete</p>
        </div>
      </div>
      <div className="space-y-3">
        {tasks.map((t) => (
          <Card key={t.id}>
            <CardContent className="py-4">
              <div className="text-xl font-bold">Room {t.roomNumber}</div>
              <div className="text-sm text-muted-foreground">{t.taskType.replace(/_/g, ' ')} · F{t.floorNumber}</div>
              <Badge className="mt-2">{t.status}</Badge>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && <p className="text-sm text-muted-foreground">No assigned tasks for today.</p>}
      </div>
    </div>
  );
}

export { HkTasksBoard };
