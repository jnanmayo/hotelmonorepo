'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Smartphone } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinanceShell } from '@/features/finance/components/finance-shell';
import { FIN_API, FIN_ROUTES } from '@/features/finance/constants/finance-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type {
  FinAccountItem,
  FinAnalyticsData,
  FinApprovalItem,
  FinBankAccountItem,
  FinBudgetItem,
  FinCostCenterItem,
  FinExpenseItem,
  FinGstSummary,
  FinIncomeItem,
  FinJournalEntryItem,
  FinOwnerDashboardStats,
  FinPayableItem,
  FinReceivableItem,
  FinTrialBalanceRow,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <FinanceShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </FinanceShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const urgent = ['OPEN', 'PENDING', 'DRAFT', 'SUBMITTED'].some((x) => status.includes(x));
  const done = ['POSTED', 'APPROVED', 'PAID', 'CLOSED'].some((x) => status.includes(x));
  return <Badge variant={urgent ? 'danger' : done ? 'default' : 'secondary'}>{status.replace(/_/g, ' ')}</Badge>;
}

export function FinChartOfAccountsPage() {
  const [rows, setRows] = useState<FinAccountItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinAccountItem[] }>(FIN_API.accounts).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Chart of Accounts" description="Assets, Liabilities, Equity, Revenue, Expenses — unlimited hierarchy" />;

  return (
    <FinanceShell title="Chart of Accounts" description="Enterprise COA — Room, Restaurant, Bar, Spa, Laundry, Maintenance accounts">
      <div className="space-y-1">
        {rows.map((a) => (
          <div key={a.id} className="flex items-center gap-2 py-1.5 border-b text-sm" style={{ paddingLeft: `${a.level * 16}px` }}>
            <span className="font-mono text-muted-foreground w-16">{a.code}</span>
            <span className="flex-1">{a.name}</span>
            <Badge variant="outline">{a.type}</Badge>
            <span className="tabular-nums w-28 text-right">₹{a.balance.toLocaleString('en-IN')}</span>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">Initialize from Finance Dashboard.</p>}
      </div>
    </FinanceShell>
  );
}

export function FinGeneralLedgerPage() {
  const [rows, setRows] = useState<{ entryNumber: string; entryDate: string; accountCode: string; accountName: string; debit: number; credit: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: typeof rows }>(FIN_API.generalLedger).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="General Ledger" description="Posted journal lines with audit trail" />;

  return (
    <FinanceShell title="General Ledger" description="All posted transactions by account">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">Date</th><th>Entry</th><th>Account</th><th className="text-right">Debit</th><th className="text-right">Credit</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{new Date(r.entryDate).toLocaleDateString()}</td>
                <td>{r.entryNumber}</td>
                <td>{r.accountCode} — {r.accountName}</td>
                <td className="text-right tabular-nums">{r.debit ? `₹${r.debit.toLocaleString('en-IN')}` : '—'}</td>
                <td className="text-right tabular-nums">{r.credit ? `₹${r.credit.toLocaleString('en-IN')}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FinanceShell>
  );
}

export function FinJournalEntriesPage() {
  const [rows, setRows] = useState<FinJournalEntryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: FinJournalEntryItem[] }>(FIN_API.journalEntries).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const post = async (id: string) => {
    await apiClient.patch(FIN_API.postJournal(id));
    load();
  };

  if (loading) return <Loading title="Journal Entries" description="Manual, automatic, recurring, reversing entries" />;

  return (
    <FinanceShell title="Journal Entries" description="Create → Approve → Post to General Ledger">
      <div className="space-y-2">
        {rows.map((j) => (
          <Card key={j.id}>
            <CardContent className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{j.entryNumber} — {j.voucherType.replace(/_/g, ' ')}</div>
                <div className="text-sm text-muted-foreground">{j.description ?? '—'} · Dr ₹{j.totalDebit.toLocaleString('en-IN')} / Cr ₹{j.totalCredit.toLocaleString('en-IN')}</div>
              </div>
              <div className="flex items-center gap-2">
                {j.isAutoPosted && <Badge variant="outline">Auto</Badge>}
                <StatusBadge status={j.status} />
                {j.status === 'DRAFT' && <Button size="sm" variant="outline" onClick={() => post(j.id)}>Post</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinReceivablesPage() {
  const [rows, setRows] = useState<FinReceivableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinReceivableItem[] }>(FIN_API.receivables).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Accounts Receivable" description="Guest, corporate, travel agent, OTA outstanding" />;

  return (
    <FinanceShell title="Accounts Receivable" description="Synced from PMS folios, guest invoices, corporate accounts">
      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardContent className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{r.partyName}</div>
                <div className="text-sm text-muted-foreground">{r.type.replace(/_/g, ' ')} {r.sourceModule && `· ${r.sourceModule}`}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">₹{r.balance.toLocaleString('en-IN')}</div>
                <StatusBadge status={r.status} />
              </div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">Run Sync from Modules on Dashboard.</p>}
      </div>
    </FinanceShell>
  );
}

export function FinPayablesPage() {
  const [rows, setRows] = useState<FinPayableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinPayableItem[] }>(FIN_API.payables).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Accounts Payable" description="Vendor bills from Procurement — payment terms, due dates" />;

  return (
    <FinanceShell title="Accounts Payable" description="Vendor invoices, purchase bills, partial payments">
      <div className="space-y-2">
        {rows.map((p) => (
          <Card key={p.id}>
            <CardContent className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{p.partyName}</div>
                <div className="text-sm text-muted-foreground">{p.dueDate ? `Due ${new Date(p.dueDate).toLocaleDateString()}` : 'No due date'}</div>
              </div>
              <div className="font-medium">₹{p.balance.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinRevenuePage() {
  const [rows, setRows] = useState<FinIncomeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinIncomeItem[] }>(FIN_API.revenue).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Revenue Management" description="Rooms, Restaurant, Bar, Spa, Laundry, Banquet, OTA" />;

  return (
    <FinanceShell title="Revenue" description="Auto-posted from PMS, POS, and manual entries">
      <div className="space-y-2">
        {rows.map((i) => (
          <Card key={i.id}>
            <CardContent className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{i.incomeNumber}</div>
                <div className="text-sm text-muted-foreground">{i.type.replace(/_/g, ' ')} — {i.description ?? '—'}</div>
              </div>
              <div className="font-medium">₹{i.amount.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinExpensesPage() {
  const [rows, setRows] = useState<FinExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinExpenseItem[] }>(FIN_API.expenses).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Expense Management" description="Purchase, maintenance, utilities, marketing, payroll" />;

  return (
    <FinanceShell title="Expenses" description="Department expenses with GST/TDS and approval workflow">
      <div className="space-y-2">
        {rows.map((e) => (
          <Card key={e.id}>
            <CardContent className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{e.expenseNumber} — {e.categoryName}</div>
                <div className="text-sm text-muted-foreground">{e.vendorName ?? e.department ?? '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">₹{e.amount.toLocaleString('en-IN')}</span>
                <StatusBadge status={e.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinBankPage() {
  const [rows, setRows] = useState<FinBankAccountItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinBankAccountItem[] }>(FIN_API.bankAccounts).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Bank Management" description="Multiple accounts, UPI, cheque, online transfer" />;

  return (
    <FinanceShell title="Bank Accounts" description="Current, savings, cash, petty cash — linked to GL">
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((b) => (
          <Card key={b.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{b.name}</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              {b.bankName && <div>{b.bankName} · {b.accountNumber}</div>}
              <Badge variant="outline">{b.type.replace(/_/g, ' ')}</Badge>
              <div className="text-lg font-bold">₹{b.currentBalance.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinCashPage() {
  const [rows, setRows] = useState<{ id: string; type: string; amount: { toString(): string }; description: string | null; transactionDate: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: typeof rows }>(FIN_API.cash).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Cash Management" description="Cash drawer, daily collection, deposits, reconciliation" />;

  return (
    <FinanceShell title="Cash Management" description="Collections synced from Front Desk payments">
      <div className="space-y-2">
        {rows.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-3 flex justify-between">
              <div>
                <Badge variant="outline">{c.type.replace(/_/g, ' ')}</Badge>
                <div className="text-sm text-muted-foreground mt-1">{c.description ?? '—'}</div>
              </div>
              <div className="font-medium">₹{Number(c.amount).toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinGstPage() {
  const [stats, setStats] = useState<FinGstSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinGstSummary }>(FIN_API.gst).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="GST Management" description="CGST, SGST, IGST, returns, HSN codes" />;

  const s = stats ?? { cgstOutput: 0, sgstOutput: 0, igstOutput: 0, cgstInput: 0, sgstInput: 0, igstInput: 0, netLiability: 0, periodMonth: 0, periodYear: 0 };

  return (
    <FinanceShell title="GST" description={`Period ${s.periodMonth}/${s.periodYear} — output vs input tax`}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">CGST Output</div><div className="text-xl font-bold">₹{s.cgstOutput.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">SGST Output</div><div className="text-xl font-bold">₹{s.sgstOutput.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">IGST Output</div><div className="text-xl font-bold">₹{s.igstOutput.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Net Liability</div><div className="text-xl font-bold">₹{s.netLiability.toLocaleString('en-IN')}</div></CardContent></Card>
      </div>
    </FinanceShell>
  );
}

export function FinTaxPage() {
  return (
    <FinanceShell title="Tax Management" description="TDS, professional tax, service tax — future tax rules ready">
      <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">
        TDS withholding tracked on expenses. Professional tax and service tax rules configurable per hotel jurisdiction.
      </CardContent></Card>
    </FinanceShell>
  );
}

export function FinBudgetPage() {
  const [rows, setRows] = useState<FinBudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinBudgetItem[] }>(FIN_API.budgets).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Budget Management" description="Annual, department, project budgets with variance" />;

  return (
    <FinanceShell title="Budgets" description="Department budget vs actual — approval workflow">
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((b) => (
          <Card key={b.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{b.name}</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <div className="flex justify-between"><span>Budget</span><span>₹{b.budgetAmount.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span>Spent</span><span>₹{b.spentAmount.toLocaleString('en-IN')}</span></div>
              <Badge className="mt-2">{b.utilizationPct}% utilized</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinCostCentersPage() {
  const [rows, setRows] = useState<FinCostCenterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinCostCenterItem[] }>(FIN_API.costCenters).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Cost Centers" description="Rooms, Restaurant, Kitchen, Bar, Spa, Maintenance, IT" />;

  return (
    <FinanceShell title="Cost Centers" description="Department-level P&L tracking">
      <div className="grid gap-2 sm:grid-cols-3">
        {rows.map((c) => (
          <Card key={c.id}><CardContent className="py-3"><div className="font-medium">{c.name}</div><div className="text-sm text-muted-foreground">{c.code}</div></CardContent></Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinInvoicesPage() {
  return (
    <FinanceShell title="Invoice Management" description="GST invoices, credit/debit notes, receipts, vouchers">
      <p className="text-sm text-muted-foreground mb-4">
        Guest GST invoices are managed via Restaurant POS and Front Desk. Vendor invoices sync from{' '}
        <Link href={asRoute('/app/procurement/invoices')} className="underline">Procurement</Link>.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {['GST Invoice', 'Credit Note', 'Debit Note', 'Receipt', 'Payment Voucher', 'Journal Voucher'].map((t) => (
          <Card key={t}><CardContent className="py-4">{t}</CardContent></Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinReconciliationPage() {
  return (
    <FinanceShell title="Bank Reconciliation" description="Import statements, auto-match, difference report">
      <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">
        Connect bank accounts, import CSV statements, and reconcile against posted journal entries.
      </CardContent></Card>
    </FinanceShell>
  );
}

export function FinDepartmentsPage() {
  return (
    <FinanceShell title="Department Accounting" description="P&L by Rooms, Restaurant, Bar, HK, Laundry, Spa, Banquet">
      <p className="text-sm text-muted-foreground">Use Cost Centers + Revenue/Expense filters for department-wise financial reports.</p>
    </FinanceShell>
  );
}

export function FinFixedAssetsPage() {
  return (
    <FinanceShell title="Fixed Assets" description="Integrated with EAM — purchase cost, depreciation, book value">
      <Button asChild><Link href={asRoute('/app/maintenance/assets')}>View Asset Register →</Link></Button>
    </FinanceShell>
  );
}

export function FinReportsPage() {
  const reports = ['trial-balance', 'profit-loss', 'balance-sheet', 'cash-flow', 'gst', 'ageing-receivables', 'ageing-payables', 'vendor-ledger', 'customer-ledger'];

  return (
    <FinanceShell title="Financial Reports" description="Trial balance, P&L, balance sheet, cash flow, GST">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((type) => (
          <Card key={type} className="cursor-pointer hover:bg-muted/50">
            <CardContent className="py-4 capitalize">{type.replace(/-/g, ' ')}</CardContent>
          </Card>
        ))}
      </div>
    </FinanceShell>
  );
}

export function FinAnalyticsPage() {
  const [data, setData] = useState<FinAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinAnalyticsData }>(FIN_API.analytics).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Financial Analytics" description="RevPAR, ADR, food cost %, revenue trends" />;

  const d = data ?? { revPar: 0, adr: 0, occupancyPct: 0, foodCostPct: 0, payrollPct: 0, avgDailyRevenue: 0, revenueBySource: [], expenseByCategory: [], cashFlowForecast: [] };

  return (
    <FinanceShell title="Financial Analytics" description="Hotel KPIs integrated with Night Audit">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">RevPAR</div><div className="text-2xl font-bold">₹{d.revPar.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">ADR</div><div className="text-2xl font-bold">₹{d.adr.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Occupancy</div><div className="text-2xl font-bold">{d.occupancyPct}%</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Food Cost %</div><div className="text-2xl font-bold">{d.foodCostPct}%</div></CardContent></Card>
      </div>
      {d.revenueBySource.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Source</CardTitle></CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.revenueBySource}>
                <XAxis dataKey="source" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </FinanceShell>
  );
}

export function FinOwnerPage() {
  const [stats, setStats] = useState<FinOwnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinOwnerDashboardStats }>(FIN_API.ownerDashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Owner Dashboard" description="Revenue, profit, EBITDA, cash flow, GST liability" />;

  const s = stats ?? {} as FinOwnerDashboardStats;

  return (
    <FinanceShell title="Owner Dashboard" description="Executive financial view — margins, trends, outstanding">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Revenue</div><div className="text-2xl font-bold">₹{(s.revenue ?? 0).toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Profit</div><div className="text-2xl font-bold">₹{(s.profit ?? 0).toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Net Margin</div><div className="text-2xl font-bold">{s.netProfitMargin ?? 0}%</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">GST Liability</div><div className="text-2xl font-bold">₹{(s.gstLiability ?? 0).toLocaleString('en-IN')}</div></CardContent></Card>
      </div>
    </FinanceShell>
  );
}

export function FinApprovalsPage() {
  const [rows, setRows] = useState<FinApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient.get<{ data: FinApprovalItem[] }>(FIN_API.approvals).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (type: string, id: string) => {
    await apiClient.patch(FIN_API.approve(type, id));
    load();
  };

  if (loading) return <Loading title="Approvals" description="Expense, journal, payment, refund approvals" />;

  return (
    <FinanceShell title="Financial Approvals" description="Multi-level approval workflow">
      <div className="space-y-2">
        {rows.map((a) => (
          <Card key={a.id}>
            <CardContent className="py-3 flex justify-between">
              <div>{a.entityType} · Level {a.level}</div>
              <Button size="sm" onClick={() => approve(a.entityType, a.entityId)}>Approve</Button>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No pending approvals.</p>}
      </div>
    </FinanceShell>
  );
}

export function FinMobilePage() {
  return (
    <FinanceShell title="Finance Mobile" description="Manager app, owner app, expense approval, cash collection">
      <Card><CardContent className="py-12 flex flex-col items-center gap-4 text-center">
        <Smartphone className="h-16 w-16 text-muted-foreground" />
        <p className="text-sm text-muted-foreground max-w-md">Mobile PWA for finance managers — approve expenses, view cash position, owner analytics.</p>
      </CardContent></Card>
    </FinanceShell>
  );
}

export function FinTrialBalancePage() {
  const [rows, setRows] = useState<FinTrialBalanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: FinTrialBalanceRow[] }>(FIN_API.trialBalance).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Trial Balance" description="Debit and credit totals by account" />;

  return (
    <FinanceShell title="Trial Balance" description="Verify books balance before P&L and balance sheet">
      <table className="w-full text-sm">
        <thead><tr className="border-b"><th className="py-2 text-left">Code</th><th className="text-left">Account</th><th className="text-right">Debit</th><th className="text-right">Credit</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.accountCode} className="border-b">
              <td className="py-2 font-mono">{r.accountCode}</td>
              <td>{r.accountName}</td>
              <td className="text-right tabular-nums">{r.debit ? `₹${r.debit.toLocaleString('en-IN')}` : '—'}</td>
              <td className="text-right tabular-nums">{r.credit ? `₹${r.credit.toLocaleString('en-IN')}` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FinanceShell>
  );
}
