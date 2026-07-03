'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FRONT_DESK_API } from '@/features/front-desk/api/endpoints';
import { FrontDeskShell } from '@/features/front-desk/components/front-desk-shell';
import { apiClient } from '@/services/api-client';

import type { FrontDeskPerformanceStats } from '@tungaos/shared';

const COMPLAINT_CATEGORIES = ['HOUSEKEEPING', 'RESTAURANT', 'MAINTENANCE', 'ROOM', 'NOISE', 'STAFF', 'BILLING', 'OTHER'] as const;

export function ComplaintsDesk() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<(typeof COMPLAINT_CATEGORIES)[number]>('ROOM');

  useEffect(() => {
    apiClient.get<{ data: typeof items }>(FRONT_DESK_API.complaints).then((r) => setItems(r.data.data)).catch(() => {});
  }, []);

  async function create() {
    await apiClient.post(FRONT_DESK_API.complaints, { title, category });
    setTitle('');
  }

  return (
    <FrontDeskShell title="Complaint Desk" description="Track and resolve guest complaints">
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {COMPLAINT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end"><Button onClick={create}>Log Complaint</Button></div>
      </div>
      <div className="space-y-3">
        {items.map((c) => (
          <Card key={c.id as string}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{c.title as string}</CardTitle></CardHeader>
            <CardContent className="flex gap-2 text-sm">
              <Badge variant="outline">{c.category as string}</Badge>
              <Badge>{c.status as string}</Badge>
              <Badge variant="secondary">{c.priority as string}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </FrontDeskShell>
  );
}

export function CommunicationsCenter() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [form, setForm] = useState({ guestId: '', channel: 'EMAIL', recipient: '', body: '', messageType: 'WELCOME' });

  useEffect(() => {
    apiClient.get<{ data: typeof items }>(FRONT_DESK_API.communications).then((r) => setItems(r.data.data)).catch(() => {});
  }, []);

  async function send() {
    await apiClient.post(FRONT_DESK_API.communications, form);
  }

  return (
    <FrontDeskShell title="Guest Communication" description="WhatsApp, Email, SMS — confirmations & reminders">
      <Card className="mb-6 max-w-xl">
        <CardContent className="space-y-3 pt-6">
          <Input placeholder="Guest ID" value={form.guestId} onChange={(e) => setForm({ ...form, guestId: e.target.value })} />
          <Input placeholder="Recipient" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} />
          <Textarea placeholder="Message" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Button onClick={send}>Send Message</Button>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {items.map((m) => (
          <Card key={m.id as string}><CardContent className="py-3 text-sm">{m.channel as string}: {m.body as string}</CardContent></Card>
        ))}
      </div>
    </FrontDeskShell>
  );
}

export function GenericListPage({ title, endpoint, description }: { title: string; endpoint: string; description: string }) {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    apiClient.get<{ data: typeof items }>(endpoint).then((r) => setItems(r.data.data)).catch(() => {});
  }, [endpoint]);

  return (
    <FrontDeskShell title={title} description={description}>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No records yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card key={(item.id as string) ?? JSON.stringify(item)}>
              <CardContent className="py-3 text-sm"><pre className="whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre></CardContent>
            </Card>
          ))}
        </div>
      )}
    </FrontDeskShell>
  );
}

export function FrontDeskSearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Array<{ title: string; subtitle: string; href: string }>>([]);

  async function search() {
    const r = await apiClient.get<{ data: typeof results }>(FRONT_DESK_API.search, { params: { q } });
    setResults(r.data.data);
  }

  return (
    <FrontDeskShell title="Enterprise Search" description="Guest, booking, room, passport, invoice">
      <div className="mb-4 flex gap-2">
        <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md" />
        <Button onClick={search}>Search</Button>
      </div>
      <div className="space-y-2">
        {results.map((r, i) => (
          <Card key={i}><CardContent className="py-3"><a href={r.href}>{r.title} — {r.subtitle}</a></CardContent></Card>
        ))}
      </div>
    </FrontDeskShell>
  );
}

export function PerformanceDashboard() {
  const [stats, setStats] = useState<FrontDeskPerformanceStats | null>(null);

  useEffect(() => {
    apiClient.get<{ data: FrontDeskPerformanceStats }>(FRONT_DESK_API.performance).then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  if (!stats) return <FrontDeskShell title="Performance"><p>Loading...</p></FrontDeskShell>;

  return (
    <FrontDeskShell title="Front Desk Performance" description="Manager dashboard — check-in/out times & satisfaction">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Avg Check-in</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.avgCheckInMinutes} min</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Avg Checkout</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.avgCheckoutMinutes} min</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Guest Satisfaction</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.guestSatisfaction}/5</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Open Complaints</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.openComplaints}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Upgrade Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">₹{stats.upgradeRevenue.toLocaleString('en-IN')}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Late Checkout Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">₹{stats.lateCheckoutRevenue.toLocaleString('en-IN')}</p></CardContent></Card>
      </div>
    </FrontDeskShell>
  );
}
