'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, ScanLine, Smartphone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InventoryShell } from '@/features/inventory/components/inventory-shell';
import { INV_API } from '@/features/inventory/constants/inventory-navigation';
import { apiClient } from '@/services/api-client';

import type {
  InvAdjustmentItem,
  InvAnalyticsData,
  InvAuditItem,
  InvBatchItem,
  InvConsumptionItem,
  InvIssueItem,
  InvItemMaster,
  InvMovementItem,
  InvPurchaseRequestItem,
  InvStockBalance,
  InvStoreItem,
  InvTransferItem,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <InventoryShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </InventoryShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant = status.includes('PENDING') || status === 'SUBMITTED' ? 'danger' : status.includes('APPROVED') || status === 'RECEIVED' || status === 'ISSUED' ? 'default' : 'secondary';
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
}

export function InvStoresPage() {
  const [stores, setStores] = useState<InvStoreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: InvStoreItem[] }>(INV_API.stores).then((r) => setStores(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Store Management" description="Multi-store inventory across all hotel departments" />;

  return (
    <InventoryShell title="Store Management" description="Main Store, Kitchen, Restaurant, Bar, Housekeeping, Laundry, and more">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <Card key={s.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                {s.name}
                <Badge variant="outline">{s.storeType.replace(/_/g, ' ')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-muted-foreground">Code: {s.code}</div>
              {s.location && <div className="text-muted-foreground">Location: {s.location}</div>}
              {s.managerName && <div>Manager: {s.managerName}</div>}
              <div>{s.itemCount} items in stock</div>
            </CardContent>
          </Card>
        ))}
        {stores.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No stores configured. Initialize from the Dashboard.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvItemsPage() {
  const [items, setItems] = useState<InvItemMaster[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback((q?: string) => {
    apiClient.get<{ data: InvItemMaster[] }>(INV_API.items, { params: q ? { search: q } : {} })
      .then((r) => setItems(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loading title="Item Master" description="Complete item catalog with barcode, SKU, categories, and pricing" />;

  return (
    <InventoryShell title="Item Master" description="Every physical item in the hotel — food, linen, toiletries, equipment">
      <div className="mb-4">
        <Input placeholder="Search by name or SKU…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(search)} className="max-w-sm" />
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-right">Stock</th>
              <th className="px-4 py-2 text-right">Cost</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="px-4 py-2 font-mono text-xs">{i.sku}</td>
                <td className="px-4 py-2">{i.name}</td>
                <td className="px-4 py-2 text-muted-foreground">{i.categoryName}</td>
                <td className="px-4 py-2 text-right tabular-nums">{i.currentStock} {i.unitSymbol}</td>
                <td className="px-4 py-2 text-right tabular-nums">₹{i.costPrice}</td>
                <td className="px-4 py-2"><Badge variant="outline">{i.itemStatus}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="p-4 text-sm text-muted-foreground">No items yet. Add items via API or seed defaults from Dashboard.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvStockPage() {
  const [balances, setBalances] = useState<InvStockBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: InvStockBalance[] }>(INV_API.stock).then((r) => setBalances(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Stock Levels" description="Real-time stock balances across all stores" />;

  return (
    <InventoryShell title="Stock Levels" description="Available, reserved, and valued stock by store">
      <div className="space-y-2">
        {balances.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{b.itemName}</div>
              <div className="text-xs text-muted-foreground">{b.storeName} · {b.sku}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="tabular-nums font-medium">{b.quantity}</span>
              <Badge variant={b.status === 'out' ? 'danger' : b.status === 'low' ? 'secondary' : 'outline'}>
                {b.status === 'ok' ? 'In Stock' : b.status === 'low' ? 'Low Stock' : 'Out of Stock'}
              </Badge>
            </div>
          </div>
        ))}
        {balances.length === 0 && <p className="text-sm text-muted-foreground">No stock balances recorded.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvMovementsPage() {
  const [movements, setMovements] = useState<InvMovementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: InvMovementItem[] }>(INV_API.movements).then((r) => setMovements(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Stock Movements" description="Complete audit trail of every inventory transaction" />;

  return (
    <InventoryShell title="Stock Movements" description="Purchase, issue, transfer, consumption, adjustment, return, waste">
      <div className="space-y-2">
        {movements.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{m.itemName}</div>
              <div className="text-xs text-muted-foreground">{m.storeName ?? '—'} · {new Date(m.movementDate).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{m.type}</Badge>
              <span className={`tabular-nums font-medium ${Number(m.quantity) < 0 ? 'text-destructive' : 'text-green-600'}`}>
                {Number(m.quantity) > 0 ? '+' : ''}{m.quantity}
              </span>
            </div>
          </div>
        ))}
        {movements.length === 0 && <p className="text-sm text-muted-foreground">No movements recorded yet.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvTransfersPage() {
  const [transfers, setTransfers] = useState<InvTransferItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: InvTransferItem[] }>(INV_API.transfers).then((r) => setTransfers(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    await apiClient.patch(INV_API.transferApprove(id));
    load();
  };

  if (loading) return <Loading title="Stock Transfers" description="Transfer stock between stores with approval workflow" />;

  return (
    <InventoryShell title="Stock Transfers" description="Main Store → Kitchen → Restaurant → Bar → Housekeeping">
      <div className="space-y-2">
        {transfers.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{t.transferNumber}</div>
              <div className="text-xs text-muted-foreground">{t.fromStoreName} → {t.toStoreName} · {t.itemCount} items</div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={t.status} />
              {t.status === 'PENDING_APPROVAL' && (
                <Button size="sm" onClick={() => approve(t.id)}>Approve</Button>
              )}
            </div>
          </div>
        ))}
        {transfers.length === 0 && <p className="text-sm text-muted-foreground">No transfers yet.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvIssuesPage() {
  const [issues, setIssues] = useState<InvIssueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: InvIssueItem[] }>(INV_API.issues).then((r) => setIssues(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    await apiClient.patch(INV_API.issueApprove(id));
    load();
  };

  if (loading) return <Loading title="Stock Issue" description="Issue inventory to Restaurant, Kitchen, Housekeeping, Laundry, Spa, Banquet" />;

  return (
    <InventoryShell title="Stock Issue" description="Department stock issues with approval hierarchy">
      <div className="space-y-2">
        {issues.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{i.issueNumber}</div>
              <div className="text-xs text-muted-foreground">{i.storeName} → {i.department.replace(/_/g, ' ')} · {i.itemCount} items</div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={i.status} />
              {i.status === 'PENDING_APPROVAL' && (
                <Button size="sm" onClick={() => approve(i.id)}>Approve & Issue</Button>
              )}
            </div>
          </div>
        ))}
        {issues.length === 0 && <p className="text-sm text-muted-foreground">No stock issues yet.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvConsumptionPage() {
  const [rows, setRows] = useState<InvConsumptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: InvConsumptionItem[] }>(INV_API.consumptions).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Consumption" description="Automatic stock deduction from Restaurant, Housekeeping, Laundry operations" />;

  return (
    <InventoryShell title="Inventory Consumption" description="Real-time consumption tracking integrated with POS, HK, and Laundry">
      <div className="space-y-2">
        {rows.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{c.itemName}</div>
              <div className="text-xs text-muted-foreground">{c.department.replace(/_/g, ' ')} · {c.storeName} · {c.sourceModule ?? 'manual'}</div>
            </div>
            <div className="text-right">
              <div className="tabular-nums font-medium">-{c.quantity}</div>
              <div className="text-xs text-muted-foreground">₹{c.totalCost.toFixed(2)}</div>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No consumption recorded yet.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvBatchesPage() {
  const [batches, setBatches] = useState<InvBatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: InvBatchItem[] }>(INV_API.batches).then((r) => setBatches(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Batch Management" description="Batch numbers, manufacturing date, expiry, FIFO/FEFO/LIFO" />;

  return (
    <InventoryShell title="Batch Management" description="Track batches with manufacturing and expiry dates">
      <div className="space-y-2">
        {batches.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{b.itemName} — Batch {b.batchNumber}</div>
              <div className="text-xs text-muted-foreground">{b.storeName} · Exp: {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div className="flex gap-2">
              <span className="tabular-nums">{b.remainingQty}</span>
              <StatusBadge status={b.status} />
            </div>
          </div>
        ))}
        {batches.length === 0 && <p className="text-sm text-muted-foreground">No batches tracked yet. Enable batch tracking on items that require it.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvExpiryPage() {
  const [expired, setExpired] = useState<InvBatchItem[]>([]);
  const [nearExpiry, setNearExpiry] = useState<InvBatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: { expired: InvBatchItem[]; nearExpiry: InvBatchItem[] } }>(INV_API.expiry)
      .then((r) => { setExpired(r.data.data?.expired ?? []); setNearExpiry(r.data.data?.nearExpiry ?? []); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Expiry Management" description="Expired items, near expiry alerts, auto blocking" />;

  return (
    <InventoryShell title="Expiry Management" description="Track expired and near-expiry inventory with alerts">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base text-destructive">Expired ({expired.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {expired.map((b) => (
              <div key={b.id} className="text-sm border-b pb-2">{b.itemName} — Batch {b.batchNumber} · {b.remainingQty} units</div>
            ))}
            {expired.length === 0 && <p className="text-sm text-muted-foreground">No expired items.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Near Expiry ({nearExpiry.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {nearExpiry.map((b) => (
              <div key={b.id} className="text-sm border-b pb-2">{b.itemName} — Exp: {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : 'N/A'}</div>
            ))}
            {nearExpiry.length === 0 && <p className="text-sm text-muted-foreground">No items nearing expiry.</p>}
          </CardContent>
        </Card>
      </div>
    </InventoryShell>
  );
}

export function InvAdjustmentsPage() {
  const [rows, setAdjustments] = useState<InvAdjustmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: InvAdjustmentItem[] }>(INV_API.adjustments).then((r) => setAdjustments(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    await apiClient.patch(INV_API.adjustmentApprove(id));
    load();
  };

  if (loading) return <Loading title="Stock Adjustments" description="Damage, lost, theft, breakage, manual correction" />;

  return (
    <InventoryShell title="Stock Adjustments" description="Adjust stock with approval workflow">
      <div className="space-y-2">
        {rows.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{a.adjustNumber} — {a.itemName}</div>
              <div className="text-xs text-muted-foreground">{a.type.replace(/_/g, ' ')} · {a.storeName}</div>
            </div>
            <div className="flex gap-2">
              <span className="tabular-nums">{a.quantity > 0 ? '+' : ''}{a.quantity}</span>
              <StatusBadge status={a.status} />
              {a.status === 'PENDING_APPROVAL' && <Button size="sm" onClick={() => approve(a.id)}>Approve</Button>}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No adjustments yet.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvAuditsPage() {
  const [audits, setAudits] = useState<InvAuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: InvAuditItem[] }>(INV_API.audits).then((r) => setAudits(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Stock Audit" description="Cycle count, physical count, variance reports" />;

  return (
    <InventoryShell title="Stock Audit" description="Physical inventory counts with variance tracking">
      <div className="space-y-2">
        {audits.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{a.auditNumber}</div>
              <div className="text-xs text-muted-foreground">{a.storeName} · {a.auditType} · {a.itemCount} items</div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">Variance: {a.varianceTotal}</Badge>
              <StatusBadge status={a.status} />
            </div>
          </div>
        ))}
        {audits.length === 0 && <p className="text-sm text-muted-foreground">No audits scheduled.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvPurchaseRequestsPage() {
  const [requests, setRequests] = useState<InvPurchaseRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: InvPurchaseRequestItem[] }>(INV_API.purchaseRequests).then((r) => setRequests(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string, level: 'dept' | 'store') => {
    await apiClient.patch(INV_API.purchaseRequestApprove(id, level));
    load();
  };

  const autoReorder = async () => {
    await apiClient.post(INV_API.autoReorder);
    load();
  };

  if (loading) return <Loading title="Purchase Requests" description="Department requests with approval hierarchy — not a purchase module" />;

  return (
    <InventoryShell title="Purchase Requests" description="Kitchen → Store Manager → Approval → Purchase Department workflow">
      <div className="mb-4">
        <Button size="sm" variant="outline" onClick={autoReorder}>Run Auto-Reorder Check</Button>
      </div>
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{r.requestNumber}</div>
              <div className="text-xs text-muted-foreground">{r.department.replace(/_/g, ' ')} · {r.itemCount} items</div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={r.status} />
              {r.status === 'SUBMITTED' && <Button size="sm" variant="outline" onClick={() => approve(r.id, 'dept')}>Dept Approve</Button>}
              {r.status === 'DEPT_APPROVED' && <Button size="sm" onClick={() => approve(r.id, 'store')}>Store Approve</Button>}
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="text-sm text-muted-foreground">No purchase requests.</p>}
      </div>
    </InventoryShell>
  );
}

export function InvScannerPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ sku: string; barcode: string; qrPayload: string } | null>(null);
  const [error, setError] = useState('');

  const scan = async () => {
    setError('');
    setResult(null);
    try {
      const r = await apiClient.get<{ data: { sku: string; barcode: string; qrPayload: string } }>(INV_API.barcode(code));
      setResult(r.data.data);
    } catch {
      setError('Item not found');
    }
  };

  return (
    <InventoryShell title="Barcode & QR Scanner" description="Scan barcodes and QR codes for instant item lookup">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><ScanLine className="h-5 w-5" /> Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Enter barcode, SKU, or scan…" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && scan()} />
          <Button onClick={scan} disabled={!code}>Lookup Item</Button>
          {result && (
            <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
              <div><strong>SKU:</strong> {result.sku}</div>
              <div><strong>Barcode:</strong> {result.barcode}</div>
              <div><strong>QR Payload:</strong> {result.qrPayload}</div>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </InventoryShell>
  );
}

export function InvMobilePage() {
  return (
    <InventoryShell title="Store Manager Mobile" description="Barcode scanner, stock count, goods receipt, transfer approval">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <Smartphone className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Mobile scanner mode optimized for warehouse operations. Use the Scanner page on mobile devices for barcode/QR scanning.</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border p-3">Barcode Scan</div>
            <div className="rounded-lg border p-3">QR Scan</div>
            <div className="rounded-lg border p-3">Stock Count</div>
            <div className="rounded-lg border p-3">Transfer Approval</div>
          </div>
        </CardContent>
      </Card>
    </InventoryShell>
  );
}

export function InvReportsPage() {
  const [reportType, setReportType] = useState('stock');
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient.get<{ data: unknown[] }>(INV_API.report(reportType)).then((r) => setData(r.data.data ?? [])).finally(() => setLoading(false));
  }, [reportType]);

  const reports = [
    { id: 'stock', label: 'Stock Report' },
    { id: 'consumption', label: 'Consumption Report' },
    { id: 'low-stock', label: 'Low Stock Report' },
    { id: 'department', label: 'Department Report' },
  ];

  return (
    <InventoryShell title="Inventory Reports" description="Stock, consumption, expiry, valuation, and department reports">
      <div className="mb-4 flex flex-wrap gap-2">
        {reports.map((r) => (
          <Button key={r.id} size="sm" variant={reportType === r.id ? 'default' : 'outline'} onClick={() => setReportType(r.id)}>{r.label}</Button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <p className="text-sm text-muted-foreground">{data.length} records in {reportType} report</p>
      )}
    </InventoryShell>
  );
}

export function InvAnalyticsPage() {
  const [data, setData] = useState<InvAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: InvAnalyticsData }>(INV_API.analytics).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Analytics" description="ABC analysis, fast/slow moving, dead stock, forecasts" />;

  const d = data ?? ({} as InvAnalyticsData);

  return (
    <InventoryShell title="Inventory Analytics" description="Owner dashboard — turnover, food cost %, department usage, forecasts">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Inventory Value</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{(d.inventoryValue ?? 0).toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Turnover</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{d.inventoryTurnover ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Food Cost %</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{d.foodCostPercent ?? 0}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Expired Value</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{d.expiredValue ?? 0}</div></CardContent></Card>
      </div>

      {d.monthlyConsumption && d.monthlyConsumption.length > 0 && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Monthly Consumption</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.monthlyConsumption}>
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {d.departmentCosts && d.departmentCosts.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Department Usage</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.departmentCosts}>
                <XAxis dataKey="department" /><YAxis /><Tooltip />
                <Bar dataKey="cost" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </InventoryShell>
  );
}
