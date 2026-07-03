'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Smartphone } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProcurementShell } from '@/features/procurement/components/procurement-shell';
import { PROC_API } from '@/features/procurement/constants/procurement-navigation';
import { apiClient } from '@/services/api-client';

import type {
  ProcAnalyticsData,
  ProcBudgetItem,
  ProcContractItem,
  ProcDashboardStats,
  ProcGrnItem,
  ProcInvoiceItem,
  ProcPurchaseOrderItem,
  ProcPurchaseRequestItem,
  ProcQuotationComparison,
  ProcQuotationItem,
  ProcReturnItem,
  ProcRfqItem,
  ProcVendorItem,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <ProcurementShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </ProcurementShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant = status.includes('PENDING') || status === 'SUBMITTED' ? 'danger' : status.includes('APPROVED') || status === 'SENT' || status === 'POSTED' ? 'default' : 'secondary';
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
}

export function ProcVendorsPage() {
  const [vendors, setVendors] = useState<ProcVendorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: ProcVendorItem[] }>(PROC_API.vendors).then((r) => setVendors(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Vendor Management" description="Complete vendor master with GST, PAN, payment terms, ratings" />;

  return (
    <ProcurementShell title="Vendor Management" description="Food, laundry, cleaning, electrical, IT, spa, and general suppliers">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <Card key={v.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between">
                {v.name}
                {v.isBlacklisted && <Badge variant="danger">Blacklisted</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-muted-foreground">{v.code} · {v.categoryName ?? 'General'}</div>
              {v.gstNumber && <div>GST: {v.gstNumber}</div>}
              <div className="flex justify-between">
                <span>Rating: {v.rating}/5</span>
                <span>{v.leadTimeDays}d lead</span>
              </div>
              <Badge variant="outline">{v.paymentTerms.replace(/_/g, ' ')}</Badge>
            </CardContent>
          </Card>
        ))}
        {vendors.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No vendors yet. Initialize from Dashboard or add via API.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcPurchaseRequestsPage() {
  const [rows, setRows] = useState<ProcPurchaseRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: ProcPurchaseRequestItem[] }>(PROC_API.purchaseRequests).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string, level: 'dept' | 'pm') => {
    await apiClient.patch(PROC_API.prApprove(id, level));
    load();
  };

  if (loading) return <Loading title="Purchase Requests" description="Department PRs from Kitchen, HK, Laundry, Maintenance, Spa, Banquet" />;

  return (
    <ProcurementShell title="Purchase Requests" description="Draft → Submitted → Approved → RFQ / PO">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{r.requestNumber}</div>
              <div className="text-xs text-muted-foreground">{r.department.replace(/_/g, ' ')} · {r.itemCount} items · {r.priority}</div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={r.status} />
              {r.status === 'SUBMITTED' && <Button size="sm" variant="outline" onClick={() => approve(r.id, 'dept')}>Dept Approve</Button>}
              {r.status === 'DEPT_APPROVED' && <Button size="sm" onClick={() => approve(r.id, 'pm')}>PM Approve</Button>}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No purchase requests.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcRfqsPage() {
  const [rows, setRows] = useState<ProcRfqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: ProcRfqItem[] }>(PROC_API.rfqs).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="RFQ Management" description="Request for Quotation — single or multiple vendors" />;

  return (
    <ProcurementShell title="RFQ Management" description="Send RFQs via email, PDF, or vendor portal">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{r.rfqNumber}</div>
              <div className="text-xs text-muted-foreground">{r.vendorCount} vendors · {r.quotationCount} quotations</div>
            </div>
            <StatusBadge status={r.status} />
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No RFQs yet.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcQuotationsPage() {
  const [rows, setRows] = useState<ProcQuotationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: ProcQuotationItem[] }>(PROC_API.quotations).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const select = async (id: string) => {
    await apiClient.patch(PROC_API.quotationSelect(id));
    load();
  };

  if (loading) return <Loading title="Quotation Management" description="Vendor quotations with pricing, GST, delivery, warranty" />;

  return (
    <ProcurementShell title="Vendor Quotations" description="Submitted quotes from vendors">
      <div className="space-y-2">
        {rows.map((q) => (
          <div key={q.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{q.quotationNumber} — {q.vendorName}</div>
              <div className="text-xs text-muted-foreground">RFQ {q.rfqNumber} · ₹{q.totalAmount.toLocaleString('en-IN')} · {q.leadTimeDays}d</div>
            </div>
            <div className="flex gap-2">
              {q.isRecommended && <Badge>Recommended</Badge>}
              <StatusBadge status={q.status} />
              {q.status === 'SUBMITTED' && <Button size="sm" onClick={() => select(q.id)}>Select</Button>}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No quotations received.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcComparisonPage() {
  const [rfqId, setRfqId] = useState('');
  const [data, setData] = useState<ProcQuotationComparison | null>(null);
  const [loading, setLoading] = useState(false);

  const compare = async () => {
    if (!rfqId) return;
    setLoading(true);
    try {
      const r = await apiClient.get<{ data: ProcQuotationComparison }>(PROC_API.quotationCompare(rfqId));
      setData(r.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProcurementShell title="Quotation Comparison" description="Compare price, GST, delivery, warranty, vendor rating — auto-recommend best vendor">
      <div className="mb-4 flex gap-2 max-w-md">
        <Input placeholder="RFQ ID (UUID)…" value={rfqId} onChange={(e) => setRfqId(e.target.value)} />
        <Button onClick={compare} disabled={!rfqId || loading}>Compare</Button>
      </div>
      {loading && <Loader2 className="h-6 w-6 animate-spin" />}
      {data && (
        <div className="space-y-2">
          <p className="text-sm font-medium">RFQ {data.rfqNumber} — Recommended: {data.recommendedId ? 'Yes' : 'N/A'}</p>
          {data.quotations.map((q) => (
            <div key={q.id} className="rounded-lg border px-4 py-3 flex justify-between">
              <div>
                <div className="font-medium">{q.vendorName} {q.isRecommended && '★'}</div>
                <div className="text-xs text-muted-foreground">Score: {q.score} · Rating: {q.vendorRating} · {q.leadTimeDays}d · ₹{q.totalAmount.toLocaleString('en-IN')}</div>
              </div>
              <Badge variant="outline">#{Math.round(q.score)}</Badge>
            </div>
          ))}
        </div>
      )}
    </ProcurementShell>
  );
}

export function ProcPurchaseOrdersPage() {
  const [rows, setRows] = useState<ProcPurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: ProcPurchaseOrderItem[] }>(PROC_API.purchaseOrders).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => { await apiClient.patch(PROC_API.poApprove(id)); load(); };
  const send = async (id: string) => { await apiClient.patch(PROC_API.poSend(id)); load(); };

  if (loading) return <Loading title="Purchase Orders" description="PO with vendor, items, GST, delivery, payment terms" />;

  return (
    <ProcurementShell title="Purchase Orders" description="Draft → Approved → Sent → Received → Closed">
      <div className="space-y-2">
        {rows.map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{o.poNumber} — {o.vendorName}</div>
              <div className="text-xs text-muted-foreground">{o.itemCount} items · ₹{o.totalAmount.toLocaleString('en-IN')}</div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={o.status} />
              {o.status === 'PENDING_APPROVAL' && <Button size="sm" onClick={() => approve(o.id)}>Approve</Button>}
              {o.status === 'APPROVED' && <Button size="sm" variant="outline" onClick={() => send(o.id)}>Send</Button>}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No purchase orders.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcGrnsPage() {
  const [rows, setRows] = useState<ProcGrnItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: ProcGrnItem[] }>(PROC_API.grns).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const post = async (id: string) => { await apiClient.patch(PROC_API.grnPost(id)); load(); };

  if (loading) return <Loading title="Goods Receipt Note" description="GRN with batch, expiry, inspection — auto-updates inventory" />;

  return (
    <ProcurementShell title="Goods Receipt Notes" description="Receive goods against PO — inventory updates on post">
      <div className="space-y-2">
        {rows.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <div className="font-medium">{g.grnNumber} — {g.vendorName}</div>
              <div className="text-xs text-muted-foreground">PO: {g.poNumber ?? '—'} · {g.itemCount} items · Inspection: {g.inspectionStatus}</div>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={g.status} />
              {g.status === 'ACCEPTED' && <Button size="sm" onClick={() => post(g.id)}>Post to Inventory</Button>}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No GRNs yet.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcInspectionPage() {
  const [rows, setRows] = useState<ProcGrnItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: ProcGrnItem[] }>(PROC_API.grns).then((r) => setRows(r.data.data.filter((g) => g.inspectionStatus === 'PENDING' || g.status === 'RECEIVED'))).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const inspect = async (id: string, approved: boolean) => {
    await apiClient.patch(PROC_API.grnInspect(id), { approved });
    load();
  };

  if (loading) return <Loading title="Quality Inspection" description="Quantity, quality, expiry, damage, packaging checks" />;

  return (
    <ProcurementShell title="Quality Inspection" description="Approve or reject received goods">
      <div className="space-y-2">
        {rows.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div><div className="font-medium">{g.grnNumber}</div><div className="text-xs text-muted-foreground">{g.vendorName}</div></div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => inspect(g.id, true)}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => inspect(g.id, false)}>Reject</Button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No items pending inspection.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcReturnsPage() {
  const [rows, setRows] = useState<ProcReturnItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: ProcReturnItem[] }>(PROC_API.returns).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Purchase Returns" description="Damaged, expired, wrong quantity, quality issues" />;

  return (
    <ProcurementShell title="Purchase Returns" description="Return notes for rejected goods">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div><div className="font-medium">{r.returnNumber}</div><div className="text-xs text-muted-foreground">{r.vendorName} · {r.reason.replace(/_/g, ' ')}</div></div>
            <StatusBadge status={r.status} />
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No returns.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcContractsPage() {
  const [rows, setRows] = useState<ProcContractItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: ProcContractItem[] }>(PROC_API.contracts).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Contract Management" description="Vendor contracts with renewal reminders" />;

  return (
    <ProcurementShell title="Vendor Contracts" description="Start/end dates, pricing, terms, auto-renewal">
      <div className="space-y-2">
        {rows.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div><div className="font-medium">{c.contractNumber} — {c.title}</div><div className="text-xs text-muted-foreground">{c.vendorName} · until {new Date(c.endDate).toLocaleDateString()}</div></div>
            <StatusBadge status={c.status} />
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No contracts.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcBudgetsPage() {
  const [rows, setBudgets] = useState<ProcBudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: ProcBudgetItem[] }>(PROC_API.budgets).then((r) => setBudgets(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Budget Management" description="Department budgets with over-budget alerts" />;

  return (
    <ProcurementShell title="Budget Management" description="Track spending vs budget by department">
      <div className="space-y-2">
        {rows.map((b) => (
          <div key={b.id} className="rounded-lg border px-4 py-3">
            <div className="flex justify-between font-medium">{b.department.replace(/_/g, ' ')}<span>{b.utilizationPercent}%</span></div>
            <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${Math.min(b.utilizationPercent, 100)}%` }} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">₹{b.spentAmount.toLocaleString('en-IN')} / ₹{b.budgetAmount.toLocaleString('en-IN')}</div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">Initialize budgets from Dashboard.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcInvoicesPage() {
  const [rows, setRows] = useState<ProcInvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: ProcInvoiceItem[] }>(PROC_API.invoices).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Invoice Matching" description="Invoice verification against PO/GRN — not finance payment module" />;

  return (
    <ProcurementShell title="Vendor Invoices" description="Invoice matching and verification workflow">
      <div className="space-y-2">
        {rows.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div><div className="font-medium">{i.invoiceNumber}</div><div className="text-xs text-muted-foreground">{i.vendorName} · PO {i.poNumber ?? '—'} · ₹{i.totalAmount.toLocaleString('en-IN')}</div></div>
            <StatusBadge status={i.status} />
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No vendor invoices submitted.</p>}
      </div>
    </ProcurementShell>
  );
}

export function ProcApprovalsPage() {
  const [stats, setStats] = useState<ProcDashboardStats | null>(null);

  useEffect(() => {
    apiClient.get<{ data: ProcDashboardStats }>(PROC_API.dashboard).then((r) => setStats(r.data.data));
  }, []);

  const s = stats ?? ({} as ProcDashboardStats);

  return (
    <ProcurementShell title="Approval Workflow" description="Employee → Dept Head → Purchase Manager → Finance → GM → Owner">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending PRs</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.pendingPurchaseRequests ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending POs</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.pendingPurchaseOrders ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending Invoices</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.pendingInvoices ?? 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending Payments</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.pendingPayments ?? 0}</div></CardContent></Card>
      </div>
    </ProcurementShell>
  );
}

export function ProcReportsPage() {
  const [reportType, setReportType] = useState('register');
  const [count, setCount] = useState(0);

  useEffect(() => {
    apiClient.get<{ data: unknown[] }>(PROC_API.report(reportType)).then((r) => setCount(r.data.data?.length ?? 0));
  }, [reportType]);

  const reports = [
    { id: 'register', label: 'Purchase Register' },
    { id: 'grn', label: 'GRN Report' },
    { id: 'quotations', label: 'Quotation Report' },
    { id: 'vendors', label: 'Vendor Ledger' },
    { id: 'budget', label: 'Budget Report' },
  ];

  return (
    <ProcurementShell title="Procurement Reports" description="Purchase register, vendor ledger, GRN, quotations, budget">
      <div className="mb-4 flex flex-wrap gap-2">
        {reports.map((r) => (
          <Button key={r.id} size="sm" variant={reportType === r.id ? 'default' : 'outline'} onClick={() => setReportType(r.id)}>{r.label}</Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{count} records in {reportType} report</p>
    </ProcurementShell>
  );
}

export function ProcAnalyticsPage() {
  const [data, setData] = useState<ProcAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: ProcAnalyticsData }>(PROC_API.analytics).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Procurement Analytics" description="Trends, vendor performance, forecasts, cost savings" />;

  const d = data ?? ({} as ProcAnalyticsData);

  return (
    <ProcurementShell title="Procurement Analytics" description="Owner dashboard — monthly purchase, vendor ratings, budget usage">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cycle Time</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{d.purchaseCycleDays ?? 0} days</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cost Savings</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{(d.costSavings ?? 0).toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Price Variance</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{d.priceVariance ?? 0}%</div></CardContent></Card>
      </div>
      {d.monthlyPurchases && d.monthlyPurchases.length > 0 && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Monthly Purchases</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.monthlyPurchases}>
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      {d.vendorPerformance && d.vendorPerformance.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Vendor Performance</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.vendorPerformance}>
                <XAxis dataKey="name" /><YAxis /><Tooltip />
                <Bar dataKey="rating" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </ProcurementShell>
  );
}

export function ProcMobilePage() {
  return (
    <ProcurementShell title="Procurement Mobile" description="Purchase manager, approval, GRN scanner apps">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <Smartphone className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Mobile apps for purchase managers, approvers, and GRN barcode scanning.</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border p-3">Purchase Manager</div>
            <div className="rounded-lg border p-3">Approval App</div>
            <div className="rounded-lg border p-3">GRN Scanner</div>
            <div className="rounded-lg border p-3">Vendor App</div>
          </div>
        </CardContent>
      </Card>
    </ProcurementShell>
  );
}
