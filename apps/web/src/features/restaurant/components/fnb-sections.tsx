'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, QrCode, Smartphone, Wine } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FNB_API, FNB_ROUTES } from '@/features/restaurant/constants/restaurant-navigation';
import { RestaurantShell } from '@/features/restaurant/components/restaurant-shell';
import { useRestaurantRealtime } from '@/features/restaurant/hooks/use-restaurant-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type {
  BillSummary,
  MenuItemSummary,
  OutletSummary,
  TableSummary,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <RestaurantShell title={title} description={description}>
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </RestaurantShell>
  );
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  OCCUPIED: 'bg-red-100 text-red-800',
  RESERVED: 'bg-yellow-100 text-yellow-800',
  CLEANING: 'bg-blue-100 text-blue-800',
};

export function FnbTablesPage() {
  const [tables, setTables] = useState<TableSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: TableSummary[] }>(FNB_API.tables)
      .then((r) => setTables(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRestaurantRealtime(hotelId, () => load());

  if (loading) return <Loading title="Table Management" description="Visual table map with live status" />;

  return (
    <RestaurantShell title="Table Map" description="Restaurant layout — available, occupied, reserved, cleaning">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => (
          <Card
            key={t.id}
            className={t.isVip ? 'border-amber-400 ring-1 ring-amber-200' : undefined}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">T{t.tableNumber}</CardTitle>
                {t.isVip && <Badge variant="outline">VIP</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{t.restaurantName} · {t.zone ?? 'Main'} · {t.capacity} seats</p>
            </CardHeader>
            <CardContent>
              <Badge className={STATUS_COLORS[t.tableStatus] ?? ''}>{t.tableStatus}</Badge>
              {t.openBillId && (
                <Button asChild size="sm" variant="link" className="mt-2 h-auto p-0">
                  <Link href={asRoute(FNB_ROUTES.pos)}>Open order →</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {tables.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tables configured.{' '}
          <Link href={asRoute(FNB_ROUTES.outlets)} className="text-primary underline">Initialize outlets</Link>
        </p>
      )}
    </RestaurantShell>
  );
}

export function FnbMenuPage() {
  const [items, setItems] = useState<MenuItemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: MenuItemSummary[] }>(FNB_API.menu)
      .then((r) => setItems(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Menu Builder" description="Categories, items, pricing, GST, allergens" />;

  const grouped = items.reduce<Record<string, MenuItemSummary[]>>((acc, item) => {
    (acc[item.categoryName] ??= []).push(item);
    return acc;
  }, {});

  return (
    <RestaurantShell title="Menu Builder" description="Food, beverages, combos — per outlet pricing and GST">
      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category} className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">{category}</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {catItems.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.itemType} · {i.prepTimeMins ?? '—'} min</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{i.price}</div>
                  <Badge variant={i.isAvailable ? 'default' : 'secondary'}>{i.isAvailable ? 'Available' : 'Unavailable'}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-muted-foreground">No menu items. Seed outlets to create sample menus.</p>}
    </RestaurantShell>
  );
}

export function FnbBillingPage() {
  const [bills, setBills] = useState<BillSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: BillSummary[] }>(FNB_API.bills)
      .then((r) => setBills(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRestaurantRealtime(hotelId, () => load());

  if (loading) return <Loading title="Billing" description="GST, split bill, room charge, tips, discounts" />;

  return (
    <RestaurantShell title="Billing" description="Open and closed bills — GST compliant invoicing">
      <div className="space-y-2">
        {bills.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{b.billNumber}</div>
              <div className="text-xs text-muted-foreground">
                {b.orderType.replace(/_/g, ' ')}
                {b.tableNumber ? ` · Table ${b.tableNumber}` : ''}
                {b.roomNumber ? ` · Room ${b.roomNumber}` : ''}
                {b.guestName ? ` · ${b.guestName}` : ''}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{b.itemCount} items</span>
              <span className="font-semibold">₹{b.totalAmount.toLocaleString('en-IN')}</span>
              <Badge variant={b.status === 'OPEN' ? 'default' : 'secondary'}>{b.status}</Badge>
            </div>
          </div>
        ))}
        {bills.length === 0 && <p className="text-sm text-muted-foreground">No bills yet. Create orders from POS.</p>}
      </div>
    </RestaurantShell>
  );
}

export function FnbOutletsPage() {
  const [outlets, setOutlets] = useState<OutletSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(() => {
    apiClient
      .get<{ data: OutletSummary[] }>(FNB_API.outlets)
      .then((r) => setOutlets(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const seed = () => {
    setSeeding(true);
    apiClient
      .post(FNB_API.outletsSeed, {})
      .then(() => load())
      .finally(() => setSeeding(false));
  };

  if (loading) return <Loading title="Outlets" description="Restaurant, cafe, bar — each with own menu, kitchen, tables" />;

  return (
    <RestaurantShell title="Outlets" description="Multi-outlet F&B — independent menus, pricing, and GST">
      {outlets.length === 0 && (
        <Button size="sm" className="mb-4" onClick={seed} disabled={seeding}>
          {seeding ? 'Initializing…' : 'Initialize Default Outlets'}
        </Button>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {outlets.map((o) => (
          <Card key={o.id}>
            <CardHeader>
              <CardTitle className="text-base">{o.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{o.outletType} · {o.code}</p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <div>Tables: <strong>{o.tableCount}</strong></div>
              <div>Menu Items: <strong>{o.menuItemCount}</strong></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RestaurantShell>
  );
}

export function FnbPosPage() {
  const [tables, setTables] = useState<TableSummary[]>([]);
  const [menu, setMenu] = useState<MenuItemSummary[]>([]);
  const [outlets, setOutlets] = useState<OutletSummary[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeBillId, setActiveBillId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    Promise.all([
      apiClient.get<{ data: TableSummary[] }>(FNB_API.tables),
      apiClient.get<{ data: MenuItemSummary[] }>(FNB_API.menu),
      apiClient.get<{ data: OutletSummary[] }>(FNB_API.outlets),
    ])
      .then(([t, m, o]) => {
        setTables(t.data.data);
        setMenu(m.data.data);
        setOutlets(o.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRestaurantRealtime(hotelId, () => load());

  const startOrder = async (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    if (table.openBillId) {
      setSelectedTable(tableId);
      setActiveBillId(table.openBillId);
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiClient.post<{ data: { id: string } }>(FNB_API.bills, {
        restaurantId: table.restaurantId,
        tableId,
        orderType: 'DINE_IN',
      });
      setSelectedTable(tableId);
      setActiveBillId(res.data.data.id);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = async (menuItemId: string) => {
    if (!activeBillId) return;
    setSubmitting(true);
    try {
      await apiClient.post(FNB_API.billItems(activeBillId), { menuItemId, quantity: 1 });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const closeBill = async () => {
    if (!activeBillId) return;
    setSubmitting(true);
    try {
      await apiClient.post(FNB_API.billClose(activeBillId), { paymentMethod: 'CASH' });
      setActiveBillId(null);
      setSelectedTable(null);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading title="Point of Sale" description="Table → Menu → Kitchen → Billing workflow" />;

  return (
    <RestaurantShell title="Point of Sale" description="Select table, add items, send to kitchen, close bill">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">1. Select Table</h3>
          <div className="grid grid-cols-3 gap-2">
            {tables.map((t) => (
              <Button
                key={t.id}
                variant={selectedTable === t.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => startOrder(t.id)}
                disabled={submitting}
              >
                T{t.tableNumber}
              </Button>
            ))}
          </div>
          {outlets.length === 0 && (
            <Button asChild size="sm" className="mt-3" variant="secondary">
              <Link href={asRoute(FNB_ROUTES.outlets)}>Setup outlets first</Link>
            </Button>
          )}
        </div>

        <div>
          <h3 className="mb-2 font-semibold">2. Add Menu Items</h3>
          {!activeBillId ? (
            <p className="text-sm text-muted-foreground">Select a table to start an order.</p>
          ) : (
            <>
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {menu.map((i) => (
                  <div key={i.id} className="flex items-center justify-between rounded border px-3 py-2">
                    <span className="text-sm">{i.name}</span>
                    <Button size="sm" variant="ghost" onClick={() => addItem(i.id)} disabled={submitting || !i.isAvailable}>
                      + ₹{i.price}
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={closeBill} disabled={submitting}>
                Close Bill & Pay
              </Button>
            </>
          )}
        </div>
      </div>
    </RestaurantShell>
  );
}

export function FnbRoomServicePage() {
  const [roomNumber, setRoomNumber] = useState('');
  const [menu, setMenu] = useState<MenuItemSummary[]>([]);
  const [outlets, setOutlets] = useState<OutletSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      apiClient.get<{ data: MenuItemSummary[] }>(FNB_API.menu),
      apiClient.get<{ data: OutletSummary[] }>(FNB_API.outlets),
    ])
      .then(([m, o]) => {
        setMenu(m.data.data);
        setOutlets(o.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (menuItemId: string) => {
    if (!roomNumber.trim()) {
      setMessage('Enter room number');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      await apiClient.post(FNB_API.roomService, {
        restaurantId: outlets[0]?.id,
        roomId: roomNumber,
        items: [{ menuItemId, quantity: 1 }],
      });
      setMessage(`Order sent to kitchen for room ${roomNumber}`);
    } catch {
      setMessage('Failed — verify room and outlet setup');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading title="Room Service" description="Guest order → kitchen → deliver → charge to room → PMS" />;

  return (
    <RestaurantShell title="Room Service" description="In-room dining orders charged to guest folio">
      <div className="mb-4 flex max-w-sm gap-2">
        <Input placeholder="Room number" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
      </div>
      {message && <p className="mb-4 text-sm text-muted-foreground">{message}</p>}
      <div className="grid gap-2 md:grid-cols-2">
        {menu.slice(0, 12).map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <span>{i.name}</span>
            <Button size="sm" onClick={() => submit(i.id)} disabled={submitting}>Order</Button>
          </div>
        ))}
      </div>
    </RestaurantShell>
  );
}

export function FnbBarPage() {
  const [items, setItems] = useState<MenuItemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: MenuItemSummary[] }>(FNB_API.menu)
      .then((r) => setItems(r.data.data.filter((i) => i.itemType === 'BEVERAGE' || i.categoryName.toLowerCase().includes('beverage'))))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Bar Management" description="Alcohol, cocktails, beer, wine — consumption tracking" />;

  return (
    <RestaurantShell title="Bar Management" description="Beverage menu, age verification, bottle tracking">
      <div className="mb-4 flex items-center gap-2 text-muted-foreground">
        <Wine className="h-5 w-5" />
        <span className="text-sm">Bar outlet items and consumption</span>
      </div>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <span className="font-medium">{i.name}</span>
            <Badge>₹{i.price}</Badge>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No bar items — add beverages in menu builder.</p>}
      </div>
    </RestaurantShell>
  );
}

export function FnbQrMenuPage() {
  return (
    <RestaurantShell title="QR Menu" description="Guest scans QR — digital menu, order tracking, charge to room">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <QrCode className="h-24 w-24 text-muted-foreground" />
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Generate QR codes per table or room. Guests browse the digital menu without an app,
            customize orders, track status, and pay online or charge to room.
          </p>
          <Button variant="outline" disabled>Generate QR (coming soon)</Button>
        </CardContent>
      </Card>
    </RestaurantShell>
  );
}

export function FnbWaiterPage() {
  return (
    <RestaurantShell title="Waiter Mobile" description="Assign tables, pickup ready orders, tips, shift performance">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <Smartphone className="h-16 w-16 text-muted-foreground" />
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Mobile-optimized view for waiters — table assignments, order pickup alerts,
            and performance metrics. Use POS on tablet for full order flow.
          </p>
          <Button asChild>
            <Link href={asRoute(FNB_ROUTES.pos)}>Open POS</Link>
          </Button>
        </CardContent>
      </Card>
    </RestaurantShell>
  );
}

export function FnbReportsPage() {
  const [report, setReport] = useState<{ type: string; data: unknown[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = (type: string) => {
    setLoading(true);
    apiClient
      .get<{ data: { type: string; data: unknown[] } }>(FNB_API.report(type))
      .then((r) => setReport(r.data.data))
      .finally(() => setLoading(false));
  };

  return (
    <RestaurantShell title="Reports" description="Daily sales, GST, kitchen, waiter, room service, bar">
      <div className="mb-4 flex flex-wrap gap-2">
        {['sales', 'kitchen', 'room-service'].map((t) => (
          <Button key={t} size="sm" variant="outline" onClick={() => load(t)} disabled={loading}>
            {t.replace(/-/g, ' ')}
          </Button>
        ))}
      </div>
      {loading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base capitalize">{report.type} Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{report.data.length} records today</p>
          </CardContent>
        </Card>
      )}
    </RestaurantShell>
  );
}
