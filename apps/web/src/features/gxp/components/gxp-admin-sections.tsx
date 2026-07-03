'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, QrCode } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GXP_ADMIN_API } from '@/features/gxp/constants/gxp-navigation';
import { GxpAdminShell } from '@/features/gxp/components/gxp-admin-shell';
import { apiClient } from '@/services/api-client';

import type { GxpAdminDashboardStats } from '@tungaos/shared';

function Kpi({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent><div className="text-2xl font-bold tabular-nums">{value}</div></CardContent>
    </Card>
  );
}

export function GxpAdminDashboard() {
  const [stats, setStats] = useState<GxpAdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: GxpAdminDashboardStats }>(GXP_ADMIN_API.dashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <GxpAdminShell title="Guest Experience Platform" description="Digital Concierge — TungaOS by Sharada Sama Solutions">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </GxpAdminShell>
    );
  }

  const s = stats ?? ({} as GxpAdminDashboardStats);

  return (
    <GxpAdminShell title="GXP Owner Dashboard" description="Guest engagement, requests, satisfaction, and revenue insights">
      <div className="mb-4 flex gap-2">
        <Button size="sm" onClick={() => apiClient.post(GXP_ADMIN_API.seed, {}).then(() => load())}>Initialize Defaults</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Active Guest Sessions" value={s.activeSessions ?? 0} />
        <Kpi title="Pending Requests" value={s.pendingRequests ?? 0} />
        <Kpi title="Requests Today" value={s.todayRequests ?? 0} />
        <Kpi title="Avg Response (min)" value={s.avgResponseMinutes ?? 0} />
        <Kpi title="Guest Satisfaction" value={`${s.guestSatisfaction ?? 0}/5`} />
        <Kpi title="Food Orders Today" value={s.foodOrdersToday ?? 0} />
        <Kpi title="Chat Messages Today" value={s.chatMessagesToday ?? 0} />
      </div>
      {s.topServices?.length > 0 && (
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-base">Most Used Services</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {s.topServices.map((t) => (
              <div key={t.service} className="flex justify-between rounded border px-3 py-2 text-sm">
                <span>{t.service.replace(/_/g, ' ')}</span>
                <Badge>{t.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </GxpAdminShell>
  );
}

export function GxpQrCodesPage() {
  const [codes, setCodes] = useState<{ roomNumber: string; qrData: string; portalUrl: string; scanCount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(() => {
    apiClient.get<{ data: typeof codes }>(GXP_ADMIN_API.qrCodes).then((r) => setCodes(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const generate = () => {
    setGenerating(true);
    apiClient.post(GXP_ADMIN_API.qrGenerate, {}).then(() => load()).finally(() => setGenerating(false));
  };

  if (loading) return <GxpAdminShell title="Room QR Codes"><div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div></GxpAdminShell>;

  return (
    <GxpAdminShell title="Room QR Codes" description="One QR per room — guest scans to open Digital Concierge PWA">
      <Button size="sm" className="mb-4" onClick={generate} disabled={generating}>
        <QrCode className="mr-2 h-4 w-4" />
        {generating ? 'Generating…' : 'Generate QR Codes for All Rooms'}
      </Button>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {codes.map((c) => (
          <Card key={c.qrData}>
            <CardHeader className="pb-2"><CardTitle className="text-base">Room {c.roomNumber}</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-mono text-xs text-muted-foreground">{c.qrData}</p>
              <p>Scans: {c.scanCount}</p>
              <a href={c.portalUrl} className="text-primary underline" target="_blank" rel="noreferrer">Preview portal link</a>
            </CardContent>
          </Card>
        ))}
      </div>
      {codes.length === 0 && <p className="text-sm text-muted-foreground">No QR codes yet. Generate for all active rooms.</p>}
    </GxpAdminShell>
  );
}

export function GxpRequestsAdminPage() {
  const [requests, setRequests] = useState<{ id: string; category: string; subType: string; status: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: typeof requests }>(GXP_ADMIN_API.requests).then((r) => setRequests(r.data.data)).finally(() => setLoading(false));
  }, []);

  const advance = async (id: string, status: string) => {
    await apiClient.patch(GXP_ADMIN_API.requestStatus(id), { status });
    const res = await apiClient.get<{ data: typeof requests }>(GXP_ADMIN_API.requests);
    setRequests(res.data.data);
  };

  if (loading) return <GxpAdminShell title="Guest Requests"><Loader2 className="mx-auto mt-16 h-8 w-8 animate-spin" /></GxpAdminShell>;

  return (
    <GxpAdminShell title="Guest Requests" description="Track housekeeping, maintenance, transport, and concierge requests">
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3">
            <div>
              <p className="font-medium">{r.subType.replace(/_/g, ' ')}</p>
              <p className="text-xs text-muted-foreground">{r.category} · {new Date(r.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Badge>{r.status}</Badge>
              {r.status === 'PENDING' && <Button size="sm" variant="outline" onClick={() => advance(r.id, 'IN_PROGRESS')}>Accept</Button>}
              {r.status === 'IN_PROGRESS' && <Button size="sm" onClick={() => advance(r.id, 'COMPLETED')}>Complete</Button>}
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="text-sm text-muted-foreground">No guest requests yet.</p>}
      </div>
    </GxpAdminShell>
  );
}

export function GxpOffersAdminPage() {
  return (
    <GxpAdminShell title="Guest Offers" description="Happy hours, spa discounts, room upgrades, festival offers">
      <p className="text-sm text-muted-foreground">Create offers via API or seed defaults from the GXP dashboard.</p>
    </GxpAdminShell>
  );
}

export function GxpAnnouncementsAdminPage() {
  return (
    <GxpAdminShell title="Announcements" description="Hotel announcements shown on guest home dashboard">
      <p className="text-sm text-muted-foreground">Manage announcements from the GXP admin API.</p>
    </GxpAdminShell>
  );
}

export function GxpReportsAdminPage() {
  return (
    <GxpAdminShell title="GXP Reports" description="Room service, laundry, guest requests, feedback, engagement">
      <p className="text-sm text-muted-foreground">Reports aggregate guest portal activity across all departments.</p>
    </GxpAdminShell>
  );
}
