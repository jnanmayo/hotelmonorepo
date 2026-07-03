'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterShell } from '@/features/command-center/components/command-center-shell';
import { CC_API, CC_ROUTES } from '@/features/command-center/constants/command-center-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type {
  AiCommandCenterStats,
  CommandCenterStats,
  InvestorDashboardStats,
  WarRoomStats,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <CommandCenterShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </CommandCenterShell>
  );
}

function ModuleLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={asRoute(href)}>{label}</Link>
    </Button>
  );
}

export function CcAnalyticsHomePage() {
  return (
    <CommandCenterShell title="Business Intelligence" description="Cross-module analytics — reads live data from every TungaOS module">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { slug: 'revenue', title: 'Revenue Analytics', desc: 'Department, channel, trend analysis' },
          { slug: 'financial', title: 'Financial Analytics', desc: 'P&L, cash flow, receivables, GST' },
          { slug: 'rooms', title: 'Room Analytics', desc: 'Occupancy heatmap, RevPAR, utilization' },
          { slug: 'booking', title: 'Booking Analytics', desc: 'Direct, OTA, corporate, conversion funnel' },
          { slug: 'crm', title: 'CRM Analytics', desc: 'LTV, loyalty, campaigns, satisfaction' },
          { slug: 'restaurant', title: 'Restaurant Analytics', desc: 'Sales, food cost, peak hours' },
          { slug: 'banquet', title: 'Banquet Analytics', desc: 'Wedding, conference, hall utilization' },
          { slug: 'inventory', title: 'Inventory Analytics', desc: 'Stock value, consumption, waste' },
          { slug: 'hr', title: 'HR Analytics', desc: 'Attendance, payroll, attrition' },
          { slug: 'corporate', title: 'Corporate Sales', desc: 'Contract value, lead conversion' },
          { slug: 'travel-desk', title: 'Travel Desk', desc: 'Trips, fleet, fuel, utilization' },
          { slug: 'war-room', title: 'Digital War Room', desc: 'All modules on one live screen' },
        ].map((item) => (
          <Card key={item.slug}>
            <CardContent className="p-4">
              <div className="font-medium">{item.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              <Button asChild size="sm" className="mt-3">
                <Link href={asRoute(`/app/analytics/${item.slug}`)}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </CommandCenterShell>
  );
}

export function CcRevenueAnalyticsPage() {
  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: CommandCenterStats }>(CC_API.dashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Revenue Analytics" description="Today's, weekly, monthly revenue by department and channel" />;
  const s = stats!;
  return (
    <CommandCenterShell title="Revenue Analytics" description="Integrated from PMS, F&B, Events, Travel Desk & Finance">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">₹{s.todayRevenue.toLocaleString('en-IN')}</div><div className="text-sm text-muted-foreground">Today</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{s.directBookings}</div><div className="text-sm text-muted-foreground">Direct Bookings</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{s.otaBookings}</div><div className="text-sm text-muted-foreground">OTA Bookings</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{s.corporateBookings}</div><div className="text-sm text-muted-foreground">Corporate</div></CardContent></Card>
      </div>
      <div className="space-y-2">
        {s.departmentRevenue.map((d) => (
          <div key={d.department} className="flex justify-between rounded-lg border px-4 py-3">
            <span>{d.department}</span>
            <span className="font-semibold">₹{d.amount.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    </CommandCenterShell>
  );
}

export function CcFinancialAnalyticsPage() {
  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: CommandCenterStats }>(CC_API.dashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Financial Analytics" description="Profit, cash, receivables, payables — from Finance module" />;
  const s = stats!;
  return (
    <CommandCenterShell title="Financial Analytics" description="Integrated with Finance — not a duplicate ledger">
      <div className="mb-4 flex gap-2"><ModuleLink href="/app/finance" label="Open Finance Module" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Today Profit', `₹${s.todayProfit.toLocaleString('en-IN')}`],
          ['Today Expenses', `₹${s.todayExpenses.toLocaleString('en-IN')}`],
          ['Net Profit', `₹${s.netProfit.toLocaleString('en-IN')}`],
          ['EBITDA', `₹${s.ebitda.toLocaleString('en-IN')}`],
          ['Cash Position', `₹${s.cashPosition.toLocaleString('en-IN')}`],
          ['Receivables', `₹${s.outstandingReceivables.toLocaleString('en-IN')}`],
        ].map(([label, val]) => (
          <Card key={label}><CardContent className="pt-4"><div className="text-2xl font-bold">{val}</div><div className="text-sm text-muted-foreground">{label}</div></CardContent></Card>
        ))}
      </div>
    </CommandCenterShell>
  );
}

export function CcGenericModulePage({ title, description, moduleHref, moduleLabel }: { title: string; description: string; moduleHref: string; moduleLabel: string }) {
  return (
    <CommandCenterShell title={title} description={description}>
      <ModuleLink href={moduleHref} label={moduleLabel} />
      <p className="mt-4 text-sm text-muted-foreground">Detailed analytics are available in the source module. Command Center aggregates KPIs for executive overview.</p>
    </CommandCenterShell>
  );
}

export function CcWarRoomPage() {
  const [stats, setStats] = useState<WarRoomStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: WarRoomStats }>(CC_API.warRoom).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Digital War Room" description="Live monitoring — bookings, revenue, operations, all modules" />;
  const s = stats!;
  return (
    <CommandCenterShell title="Digital War Room" description="Real-time enterprise monitoring screen">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Bookings</CardTitle></CardHeader><CardContent className="space-y-2">{s.bookings.map((b) => (
          <div key={b.label} className="flex justify-between text-sm"><span>{b.label}</span><span className="font-bold">{b.value}</span></div>
        ))}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Revenue</CardTitle></CardHeader><CardContent className="space-y-2">{s.revenue.map((b) => (
          <div key={b.label} className="flex justify-between text-sm"><span>{b.label}</span><span className="font-bold">₹{b.value.toLocaleString('en-IN')}</span></div>
        ))}</CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Module Status</CardTitle></CardHeader><CardContent className="grid gap-2 sm:grid-cols-3">{s.modules.map((m) => (
          <div key={m.module} className="rounded-lg border p-3"><div className="font-medium">{m.module}</div><div className="text-sm text-muted-foreground">{m.metric}</div><Badge className="mt-2" variant="secondary">{m.status}</Badge></div>
        ))}</CardContent></Card>
      </div>
    </CommandCenterShell>
  );
}

export function CcAlertsPage() {
  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: CommandCenterStats }>(CC_API.dashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Alert Center" description="Low occupancy, inventory, VIP arrivals, maintenance emergencies" />;
  return (
    <CommandCenterShell title="Alert Center" description="Proactive alerts across all hotel operations">
      <div className="space-y-2">
        {(stats?.alerts ?? []).map((a) => (
          <Card key={a.id}><CardContent className="py-3 flex justify-between"><div><div className="font-medium">{a.category}</div><div className="text-sm text-muted-foreground">{a.message}</div></div>
            <Badge variant={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'secondary'}>{a.severity}</Badge>
          </CardContent></Card>
        ))}
        {(stats?.alerts ?? []).length === 0 && <p className="text-sm text-muted-foreground">No active alerts — all systems nominal.</p>}
      </div>
    </CommandCenterShell>
  );
}

export function CcInvestorPage() {
  const [stats, setStats] = useState<InvestorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: InvestorDashboardStats }>(CC_API.investor).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Investor Dashboard" description="ROI, growth, forecast, hotel valuation" />;
  const s = stats!;
  return (
    <CommandCenterShell title="Investor Dashboard" description="Executive view for owners and investors">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Monthly Revenue', `₹${s.revenue.toLocaleString('en-IN')}`],
          ['Profit', `₹${s.profit.toLocaleString('en-IN')}`],
          ['ROI', `${s.roi}%`],
          ['Growth', `${s.growthPct}%`],
          ['Occupancy', `${s.occupancy}%`],
          ['Forecast', `₹${s.forecastRevenue.toLocaleString('en-IN')}`],
          ['Capital Util.', `${s.capitalUtilization}%`],
          ['Valuation', `₹${s.hotelValuation.toLocaleString('en-IN')}`],
        ].map(([label, val]) => (
          <Card key={label}><CardContent className="pt-4"><div className="text-2xl font-bold">{val}</div><div className="text-sm text-muted-foreground">{label}</div></CardContent></Card>
        ))}
      </div>
    </CommandCenterShell>
  );
}

export function CcAiPage() {
  const [stats, setStats] = useState<AiCommandCenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  useEffect(() => {
    apiClient.get<{ data: AiCommandCenterStats }>(CC_API.ai).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="AI Command Center" description="Predictive analytics and executive copilot" />;
  const s = stats!;
  return (
    <CommandCenterShell title="AI Command Center & Copilot" description="Ask why revenue is down, forecast demand, predict churn — future-ready architecture">
      <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4" /> AI Hotel Assistant</CardTitle></CardHeader>
        <CardContent>
          <textarea
            className="w-full rounded-lg border bg-background p-3 text-sm min-h-[80px]"
            placeholder="Ask: Why is occupancy low? Forecast next month revenue. Which department has highest cost?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-2">Copilot uses aggregated Command Center data from all modules.</p>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {s.predictions.map((p) => (
          <Card key={p.label}><CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">{p.label}</div>
            <div className="text-xl font-bold mt-1">{p.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{p.confidence}% confidence · {p.trend}</div>
          </CardContent></Card>
        ))}
      </div>
      <Card><CardHeader><CardTitle className="text-base">Automatic Executive Insights</CardTitle></CardHeader><CardContent className="space-y-2">
        {s.insights.map((insight, i) => <p key={i} className="text-sm border-l-2 border-primary pl-3">{insight}</p>)}
      </CardContent></Card>
    </CommandCenterShell>
  );
}

export function CcMobilePage() {
  return (
    <CommandCenterShell title="Owner Mobile App" description="Live KPIs, approvals, notifications, AI assistant, voice commands">
      <div className="grid gap-3 sm:grid-cols-2">
        {['Live KPIs', 'Revenue Pulse', 'Approvals', 'Push Alerts', 'AI Assistant', 'Voice Commands'].map((f) => (
          <Card key={f}><CardContent className="p-4"><div className="font-medium">{f}</div><Badge className="mt-2" variant="outline">PWA Ready</Badge></CardContent></Card>
        ))}
      </div>
    </CommandCenterShell>
  );
}

export function CcMapsPage() {
  return (
    <CommandCenterShell title="Map Dashboard" description="Guest origin, corporate locations, travel routes, city-wise revenue">
      <p className="text-sm text-muted-foreground">Geographic analytics integrate CRM guest profiles and Travel Desk GPS-ready architecture.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ModuleLink href="/app/crm/analytics" label="CRM Geography" />
        <ModuleLink href="/app/travel-desk/gps" label="Travel Routes" />
      </div>
    </CommandCenterShell>
  );
}

export function CcReportsBuilderPage() {
  return (
    <CommandCenterShell title="Report Builder" description="Charts, pivot reports, scheduled exports — Excel, PDF, CSV">
      <div className="grid gap-3 sm:grid-cols-3">
        {['Trip Register', 'Revenue Report', 'Occupancy Report', 'Food Cost', 'Payroll', 'Corporate Usage'].map((r) => (
          <Card key={r}><CardContent className="p-4"><div className="font-medium">{r}</div><Button size="sm" variant="outline" className="mt-2">Export CSV</Button></CardContent></Card>
        ))}
      </div>
    </CommandCenterShell>
  );
}
