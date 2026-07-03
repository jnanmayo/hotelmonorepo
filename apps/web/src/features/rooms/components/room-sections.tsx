'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROOMS_API } from '@/features/rooms/constants/room-navigation';
import { RoomsShell } from '@/features/rooms/components/rooms-shell';
import { apiClient } from '@/services/api-client';

import type {
  AmenityItem,
  RoomAllocationSuggestion,
  RoomBlockItem,
  RoomDamageItem,
  RoomInspectionItem,
  RoomPricingPlan,
  RoomRevenueStats,
  RoomSearchResult,
} from '@tungaos/shared';

function LoadingShell({ title, description }: { title: string; description: string }) {
  return (
    <RoomsShell title={title} description={description}>
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </RoomsShell>
  );
}

export function RoomCalendarPage() {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = new Date().toISOString().split('T')[0]!;
    const to = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]!;
    apiClient
      .get<{ data: unknown[] }>(`${ROOMS_API.calendar}?from=${from}&to=${to}`)
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Calendar" description="Occupancy, availability, maintenance & cleaning views" />;

  return (
    <RoomsShell title="Room Calendar" description="Weekly availability and occupancy calendar">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(data as { roomTypeId: string; name: string; availableRooms: number; totalRooms: number }[]).map((rt) => (
          <Card key={rt.roomTypeId ?? rt.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{rt.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rt.availableRooms ?? 0} / {rt.totalRooms ?? 0}</div>
              <p className="text-xs text-muted-foreground">available rooms (next 7 days)</p>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && <p className="text-sm text-muted-foreground">No calendar data available.</p>}
      </div>
    </RoomsShell>
  );
}

export function RoomAllocationPage() {
  const [reservationId, setReservationId] = useState('');
  const [suggestions, setSuggestions] = useState<RoomAllocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const suggest = () => {
    if (!reservationId) return;
    setLoading(true);
    apiClient
      .post<{ data: RoomAllocationSuggestion[] }>(ROOMS_API.allocationSuggest, { reservationId })
      .then((r) => setSuggestions(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const autoAssign = () => {
    if (!reservationId) return;
    apiClient.post(ROOMS_API.allocationAuto, { reservationId }).then(() => suggest());
  };

  return (
    <RoomsShell title="Room Allocation Engine" description="Intelligent room suggestions based on guest preference, VIP, availability, and status">
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          placeholder="Reservation ID"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={suggest} disabled={loading}>Get Suggestions</Button>
        <Button variant="outline" onClick={autoAssign}>Auto Assign Best</Button>
      </div>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <div className="font-medium">Room {s.roomNumber} — {s.roomTypeName}</div>
                  <div className="text-sm text-muted-foreground">{s.buildingName} · Floor {s.floorNumber}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {s.reasons.map((r) => <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>)}
                  </div>
                </div>
                <Badge className="text-lg">{s.score}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </RoomsShell>
  );
}

export function RoomPricingPage() {
  const [plans, setPlans] = useState<RoomPricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: RoomPricingPlan[] }>(ROOMS_API.pricingPlans)
      .then((r) => setPlans(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Pricing" description="Base, weekend, corporate, seasonal, and dynamic pricing" />;

  return (
    <RoomsShell title="Room Pricing" description="Rate plans per room type — corporate, member, weekend, festival, long stay">
      <div className="space-y-2">
        {plans.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.roomTypeName} · {p.planType.replace(/_/g, ' ')}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">₹{p.baseRate.toLocaleString()}</div>
              {p.corporateOnly && <Badge variant="outline" className="text-xs">Corporate</Badge>}
              {p.memberOnly && <Badge variant="outline" className="text-xs">Member</Badge>}
            </div>
          </div>
        ))}
        {plans.length === 0 && <p className="text-sm text-muted-foreground">No rate plans configured.</p>}
      </div>
    </RoomsShell>
  );
}

export function RoomRevenuePage() {
  const [stats, setStats] = useState<RoomRevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: RoomRevenueStats }>(ROOMS_API.revenue)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Revenue" description="ADR, RevPAR, occupancy, and channel revenue" />;

  const s = stats ?? ({} as RoomRevenueStats);

  return (
    <RoomsShell title="Room Revenue Dashboard" description="Revenue per room, ADR, RevPAR, and channel breakdown">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Monthly Revenue', `₹${(s.monthlyRevenue ?? 0).toLocaleString()}`],
          ['Yearly Revenue', `₹${(s.yearlyRevenue ?? 0).toLocaleString()}`],
          ['ADR', `₹${(s.adr ?? 0).toLocaleString()}`],
          ['RevPAR', `₹${(s.revPar ?? 0).toLocaleString()}`],
          ['Occupancy', `${s.occupancyPct ?? 0}%`],
          ['Avg Stay', `${(s.averageStay ?? 0).toFixed(1)} nights`],
          ['Corporate', `₹${(s.corporateRevenue ?? 0).toLocaleString()}`],
          ['Direct', `₹${(s.directRevenue ?? 0).toLocaleString()}`],
          ['OTA', `₹${(s.otaRevenue ?? 0).toLocaleString()}`],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold">{value}</div></CardContent>
          </Card>
        ))}
      </div>
    </RoomsShell>
  );
}

export function RoomAssetsPage() {
  const [assets, setAssets] = useState<{ id: string; name: string; assetType: string; condition: string; room: { roomNumber: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: typeof assets }>(ROOMS_API.assets)
      .then((r) => setAssets(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Assets" description="TV, AC, bed, furniture — warranty, AMC, and condition tracking" />;

  return (
    <RoomsShell title="Room Assets" description="Track every asset in every room">
      <div className="space-y-2">
        {assets.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
            <div><span className="font-medium">{a.name}</span> · {a.assetType}</div>
            <div className="flex gap-2">
              <Badge variant="outline">Room {a.room?.roomNumber}</Badge>
              <Badge>{a.condition}</Badge>
            </div>
          </div>
        ))}
        {assets.length === 0 && <p className="text-sm text-muted-foreground">No room assets registered.</p>}
      </div>
    </RoomsShell>
  );
}

export function RoomMaintenancePage() {
  const [items, setItems] = useState<{ id: string; title: string; status: string; priority: string; room?: { roomNumber: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: typeof items }>(ROOMS_API.maintenance)
      .then((r) => setItems(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Maintenance" description="Maintenance requests linked to rooms" />;

  return (
    <RoomsShell title="Room Maintenance" description="Track maintenance status per room — not housekeeping">
      <div className="space-y-2">
        {items.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{m.title}</div>
              <div className="text-xs text-muted-foreground">Room {m.room?.roomNumber ?? '—'}</div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{m.priority}</Badge>
              <Badge>{m.status}</Badge>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No open maintenance requests.</p>}
      </div>
    </RoomsShell>
  );
}

export function RoomBlocksPage() {
  const [blocks, setBlocks] = useState<RoomBlockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: RoomBlockItem[] }>(ROOMS_API.blocks)
      .then((r) => setBlocks(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Blocks" description="Maintenance, VIP, renovation, and manual blocks" />;

  return (
    <RoomsShell title="Room Blocking" description="Active blocks — maintenance, deep cleaning, VIP, government, events">
      <div className="space-y-2">
        {blocks.map((b) => (
          <div key={b.id} className="rounded-lg border px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Room {b.roomNumber} — {b.title}</span>
              <Badge>{b.reason.replace(/_/g, ' ')}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">{b.startDate} → {b.endDate}</div>
          </div>
        ))}
        {blocks.length === 0 && <p className="text-sm text-muted-foreground">No active room blocks.</p>}
      </div>
    </RoomsShell>
  );
}

export function RoomInspectionPage() {
  const [items, setItems] = useState<RoomInspectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: RoomInspectionItem[] }>(ROOMS_API.inspections)
      .then((r) => setItems(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Inspection" description="Quality scores, checklists, and supervisor approval" />;

  return (
    <RoomsShell title="Room Inspection" description="Inspection checklist, photos, quality score, and approval">
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">Room {i.roomNumber}</div>
              <div className="text-xs text-muted-foreground">{new Date(i.inspectedAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Score: {i.qualityScore}</Badge>
              <Badge>{i.status}</Badge>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No inspections recorded.</p>}
      </div>
    </RoomsShell>
  );
}

export function RoomReportsPage() {
  const [reportType, setReportType] = useState('status');
  const [report, setReport] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(() => {
    setLoading(true);
    apiClient
      .get<{ data: unknown }>(ROOMS_API.report(reportType))
      .then((r) => setReport(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reportType]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <RoomsShell title="Room Reports" description="Status, occupancy, maintenance, damage, and history reports">
      <div className="mb-4 flex flex-wrap gap-2">
        {['status', 'occupancy', 'maintenance', 'damage'].map((t) => (
          <Button key={t} variant={reportType === t ? 'default' : 'outline'} size="sm" onClick={() => setReportType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">{JSON.stringify(report, null, 2)}</pre>
      )}
    </RoomsShell>
  );
}

export function RoomAmenitiesPage() {
  const [items, setItems] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: AmenityItem[] }>(ROOMS_API.amenities)
      .then((r) => setItems(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingShell title="Room Amenities" description="WiFi, mini bar, smart TV, and custom amenities" />;

  return (
    <RoomsShell title="Room Amenities" description="Manage amenities linked to room types">
      <div className="flex flex-wrap gap-2">
        {items.map((a) => (
          <Badge key={a.id} variant="secondary" className="px-3 py-1">{a.name}</Badge>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No amenities configured.</p>}
      </div>
    </RoomsShell>
  );
}

export function RoomSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RoomSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = () => {
    if (!query.trim()) return;
    setLoading(true);
    apiClient
      .get<{ data: RoomSearchResult[] }>(`${ROOMS_API.search}?q=${encodeURIComponent(query)}`)
      .then((r) => setResults(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <RoomsShell title="Enterprise Room Search" description="Search by room number, category, status, floor, building, or guest">
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search rooms..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} />
        </div>
        <Button onClick={search} disabled={loading}>Search</Button>
      </div>
      <div className="space-y-2">
        {results.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
            <div>
              <span className="font-medium">Room {r.roomNumber}</span>
              <span className="ml-2 text-muted-foreground">{r.roomTypeName} · {r.buildingName} F{r.floorNumber}</span>
            </div>
            <Badge>{r.status.replace(/_/g, ' ')}</Badge>
          </div>
        ))}
      </div>
    </RoomsShell>
  );
}

export function RoomDamagesSection() {
  const [items, setItems] = useState<RoomDamageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: RoomDamageItem[] }>(ROOMS_API.damages)
      .then((r) => setItems(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-2">
      {items.map((d) => (
        <div key={d.id} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
          <div>Room {d.roomNumber} — {d.itemName}</div>
          <div className="flex gap-2">
            <span>₹{d.estimatedCost}</span>
            <Badge>{d.repairStatus}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
