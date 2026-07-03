'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Smartphone, Sparkles } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CrmShell } from '@/features/crm/components/crm-shell';
import { CRM_API, CRM_ROUTES } from '@/features/crm/constants/crm-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type {
  CrmAnalyticsData,
  CrmAutomationItem,
  CrmCampaignItem,
  CrmCommunicationLogItem,
  CrmCorporateItem,
  CrmCouponItem,
  CrmFeedbackItem,
  CrmGiftCardItem,
  CrmGuestItem,
  CrmLeadItem,
  CrmLoyaltyMemberItem,
  CrmLoyaltyTransactionItem,
  CrmOwnerDashboardStats,
  CrmReferralItem,
  CrmReviewItem,
  CrmSegmentItem,
  CrmTravelAgentItem,
} from '@tungaos/shared';
import { CRM_ARCHITECTURE_MERMAID, REFERRAL_WORKFLOW_MERMAID } from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <CrmShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </CrmShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const pending = ['PENDING', 'DRAFT', 'NEW', 'QUEUED', 'OPEN'].some((x) => status.includes(x));
  const done = ['WON', 'SENT', 'ACTIVE', 'REWARDED', 'APPROVED', 'COMPLETED'].some((x) => status.includes(x));
  return <Badge variant={pending ? 'secondary' : done ? 'default' : 'outline'}>{status.replace(/_/g, ' ')}</Badge>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50"><tr>{headers.map((h) => <th key={h} className="px-4 py-2 text-left">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="px-4 py-2">{cell}</td>)}</tr>)}</tbody>
      </table>
      {rows.length === 0 && <p className="p-4 text-sm text-muted-foreground">No records yet.</p>}
    </div>
  );
}

export function CrmGuestsPage() {
  const [rows, setRows] = useState<CrmGuestItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback((q?: string) => {
    apiClient.get<{ data: CrmGuestItem[] }>(CRM_API.guests, { params: q ? { search: q } : {} })
      .then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <Loading title="Guest 360 Profiles" description="Complete guest database with preferences, loyalty, and journey history" />;
  return (
    <CrmShell title="Guest Master" description="360° guest profiles integrated with PMS, booking, restaurant, and loyalty">
      <div className="mb-4"><Input placeholder="Search guests…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(search)} className="max-w-sm" /></div>
      <DataTable
        headers={['Code', 'Name', 'Email', 'City', 'Tier', 'Stays', 'VIP', 'Profile']}
        rows={rows.map((g) => [
          g.guestCode, `${g.firstName} ${g.lastName}`, g.email ?? '—', g.city ?? '—',
          g.membershipTier ?? '—', g.stayCount,
          g.vipStatus ? <Badge key="v" variant="vip">VIP</Badge> : '—',
          <Button key="p" asChild size="sm" variant="outline"><Link href={asRoute(CRM_ROUTES.guestProfile(g.id))}>View</Link></Button>,
        ])}
      />
    </CrmShell>
  );
}

export function CrmSegmentsPage() {
  const [rows, setRows] = useState<CrmSegmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmSegmentItem[] }>(CRM_API.segments).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Guest Segmentation" description="Automatic segments for targeted marketing" />;
  return (
    <CrmShell title="Guest Segments" description="New, returning, VIP, corporate, high-spending, OTA, direct, inactive">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((s) => (
          <Card key={s.id}><CardContent className="p-4">
            <div className="font-medium">{s.name}</div>
            <div className="text-sm text-muted-foreground">{s.description}</div>
            <div className="mt-2 text-2xl font-bold tabular-nums">{s.guestCount}</div>
          </CardContent></Card>
        ))}
      </div>
    </CrmShell>
  );
}

export function CrmLeadsPage() {
  const [rows, setRows] = useState<CrmLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmLeadItem[] }>(CRM_API.leads).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Lead Management" description="Capture leads from website, walk-in, corporate, events, WhatsApp" />;
  return (
    <CrmShell title="Leads" description="Lead assignment, scoring, and pipeline tracking">
      <DataTable headers={['Name', 'Email', 'Company', 'Source', 'Status', 'Value', 'Created']} rows={rows.map((r) => [
        r.name, r.email ?? '—', r.company ?? '—', r.source ?? '—', <StatusBadge key="s" status={r.status} />,
        r.estimatedValue ? `₹${r.estimatedValue.toLocaleString('en-IN')}` : '—', r.createdAt,
      ])} />
    </CrmShell>
  );
}

export function CrmPipelinePage() {
  const [stages, setStages] = useState<{ stage: string; count: number; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: typeof stages }>(CRM_API.pipeline).then((r) => setStages(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Sales Pipeline" description="New Lead → Contacted → Qualified → Proposal → Negotiation → Won/Lost" />;
  return (
    <CrmShell title="Sales Pipeline" description="Visual pipeline with stage values">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {stages.map((s) => (
          <Card key={s.stage}><CardHeader className="pb-2"><CardTitle className="text-sm">{s.stage.replace(/_/g, ' ')}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.count}</div><div className="text-xs text-muted-foreground">₹{s.value.toLocaleString('en-IN')}</div></CardContent></Card>
        ))}
      </div>
    </CrmShell>
  );
}

export function CrmLoyaltyPage() {
  const [rows, setRows] = useState<CrmLoyaltyMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmLoyaltyMemberItem[] }>(CRM_API.loyaltyMembers).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Loyalty Program" description="Silver, Gold, Platinum, Diamond tiers with membership benefits" />;
  return (
    <CrmShell title="Loyalty Members" description="Enterprise rewards program — Marriott Bonvoy / Hilton Honors style">
      <DataTable headers={['Guest', 'Code', 'Tier', 'Balance', 'Lifetime Points']} rows={rows.map((r) => [
        r.guestName, r.guestCode, <Badge key="t" variant="vip">{r.tier}</Badge>, r.balance, r.lifetimePoints,
      ])} />
    </CrmShell>
  );
}

export function CrmPointsPage() {
  const [rows, setRows] = useState<CrmLoyaltyTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmLoyaltyTransactionItem[] }>(CRM_API.loyaltyTransactions).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Points Engine" description="Earn from bookings, restaurant, spa, referrals — redeem for upgrades and discounts" />;
  return (
    <CrmShell title="Reward Points Transactions" description="Earn, redeem, expire, bonus points with full audit trail">
      <DataTable headers={['Guest', 'Type', 'Points', 'Balance After', 'Description', 'Date']} rows={rows.map((r) => [
        r.guestName, <StatusBadge key="t" status={r.type} />, r.points, r.balanceAfter, r.description ?? '—', new Date(r.createdAt).toLocaleString(),
      ])} />
    </CrmShell>
  );
}

export function CrmCorporatePage() {
  const [rows, setRows] = useState<CrmCorporateItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmCorporateItem[] }>(CRM_API.corporate).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Corporate CRM" description="Companies, contracts, credit limits, employees, billing" />;
  return (
    <CrmShell title="Corporate Accounts" description="B2B relationship management with contract rates and performance">
      <DataTable headers={['Company', 'Code', 'Industry', 'Credit Limit', 'Employees', 'Contracts']} rows={rows.map((r) => [
        r.name, r.code, r.industry ?? '—', `₹${r.creditLimit.toLocaleString('en-IN')}`, r.employeeCount, r.contractCount,
      ])} />
    </CrmShell>
  );
}

export function CrmTravelAgentsPage() {
  const [rows, setRows] = useState<CrmTravelAgentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmTravelAgentItem[] }>(CRM_API.travelAgents).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Travel Agent CRM" description="Agency contracts, commission, bookings, payments" />;
  return (
    <CrmShell title="Travel Agents" description="Agency performance and commission tracking">
      <DataTable headers={['Agency', 'Code', 'Email', 'Commission', 'Bookings']} rows={rows.map((r) => [
        r.name, r.code, r.email ?? '—', `${r.commissionPct}%`, r.bookingCount,
      ])} />
    </CrmShell>
  );
}

export function CrmCampaignsPage() {
  const [rows, setRows] = useState<CrmCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmCampaignItem[] }>(CRM_API.campaigns).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Marketing Campaigns" description="Multi-channel campaigns with segmentation and scheduling" />;
  return (
    <CrmShell title="Campaigns" description="Email, WhatsApp, SMS campaigns with budget tracking">
      <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{CRM_ARCHITECTURE_MERMAID}</pre>
      <DataTable headers={['Name', 'Code', 'Channel', 'Status', 'Budget', 'Period']} rows={rows.map((r) => [
        r.name, r.code, r.channel ?? '—', <StatusBadge key="s" status={r.status} />,
        r.budget ? `₹${r.budget.toLocaleString('en-IN')}` : '—',
        r.startsAt ? `${r.startsAt} – ${r.endsAt ?? 'ongoing'}` : '—',
      ])} />
    </CrmShell>
  );
}

function CommPage({ title, description, api, channel }: { title: string; description: string; api: string; channel: string }) {
  const [rows, setRows] = useState<CrmCommunicationLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmCommunicationLogItem[] }>(api).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, [api]);
  if (loading) return <Loading title={title} description={description} />;
  return (
    <CrmShell title={title} description={description}>
      <DataTable headers={['Recipient', 'Subject', 'Status', 'Sent']} rows={rows.map((r) => [
        r.recipient, r.subject ?? channel, <StatusBadge key="s" status={r.status} />, r.sentAt ? new Date(r.sentAt).toLocaleString() : '—',
      ])} />
    </CrmShell>
  );
}

export function CrmEmailPage() {
  return <CommPage title="Email Campaigns" description="Templates, scheduling, open/click/bounce tracking, A/B testing" api={CRM_API.email} channel="Email" />;
}

export function CrmWhatsAppPage() {
  return <CommPage title="WhatsApp Campaigns" description="Promotional, booking reminders, offers — delivery and read status" api={CRM_API.whatsapp} channel="WhatsApp" />;
}

export function CrmSmsPage() {
  return <CommPage title="SMS Campaigns" description="Promotions, OTP, booking and checkout reminders" api={CRM_API.sms} channel="SMS" />;
}

export function CrmAutomationPage() {
  const [rows, setRows] = useState<CrmAutomationItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmAutomationItem[] }>(CRM_API.automation).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Marketing Automation" description="Welcome email, pre-arrival, birthday, review request, come-back offers" />;
  return (
    <CrmShell title="Automation Rules" description="Trigger-based workflows across email, WhatsApp, and SMS">
      <DataTable headers={['Rule', 'Trigger', 'Channel', 'Delay', 'Active']} rows={rows.map((r) => [
        r.name, r.trigger.replace(/_/g, ' '), r.channel, `${r.delayHours}h`, r.isActive ? 'Yes' : 'No',
      ])} />
    </CrmShell>
  );
}

export function CrmCouponsPage() {
  const [rows, setRows] = useState<CrmCouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmCouponItem[] }>(CRM_API.coupons).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Coupon Engine" description="Promo codes, percentage/flat discounts, BOGO, room upgrades" />;
  return (
    <CrmShell title="Coupons & Promo Codes" description="Discount engine integrated with booking and restaurant">
      <DataTable headers={['Code', 'Name', 'Type', 'Value', 'Used', 'Max', 'Expires']} rows={rows.map((r) => [
        r.code, r.name, r.type, r.value, r.usedCount, r.maxUses ?? '∞', r.endsAt ?? '—',
      ])} />
    </CrmShell>
  );
}

export function CrmGiftCardsPage() {
  const [rows, setRows] = useState<CrmGiftCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmGiftCardItem[] }>(CRM_API.giftCards).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Gift Card Management" description="Digital and physical vouchers with balance tracking" />;
  return (
    <CrmShell title="Gift Cards & Vouchers" description="Issue, redeem, and track gift card balances">
      <DataTable headers={['Code', 'Guest', 'Initial', 'Balance', 'Status', 'Expires']} rows={rows.map((r) => [
        r.code, r.guestName ?? '—', `₹${r.initialValue}`, `₹${r.balance}`, <StatusBadge key="s" status={r.status} />, r.expiresAt ?? '—',
      ])} />
    </CrmShell>
  );
}

export function CrmReferralsPage() {
  const [rows, setRows] = useState<CrmReferralItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmReferralItem[] }>(CRM_API.referrals).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Referral Program" description="Invite friends, track bookings, reward both guests" />;
  return (
    <CrmShell title="Referrals" description="Guest → Invite → Friend Books → Reward Both">
      <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{REFERRAL_WORKFLOW_MERMAID}</pre>
      <DataTable headers={['Referrer', 'Referred Email', 'Code', 'Status', 'Points', 'Date']} rows={rows.map((r) => [
        r.referrerName, r.referredEmail, r.referralCode, <StatusBadge key="s" status={r.status} />, r.rewardPoints, r.createdAt,
      ])} />
    </CrmShell>
  );
}

export function CrmFeedbackPage() {
  const [rows, setRows] = useState<CrmFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmFeedbackItem[] }>(CRM_API.feedback).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Feedback Management" description="Room, restaurant, spa, staff — NPS with auto complaint tickets" />;
  return (
    <CrmShell title="Guest Feedback" description="Collect and act on guest satisfaction scores">
      <DataTable headers={['Guest', 'Type', 'Rating', 'Comment', 'Date']} rows={rows.map((r) => [
        r.guestName ?? 'Anonymous', r.type, r.rating ?? '—', r.comment?.slice(0, 80) ?? '—', new Date(r.createdAt).toLocaleString(),
      ])} />
    </CrmShell>
  );
}

export function CrmReviewsPage() {
  const [rows, setRows] = useState<CrmReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmReviewItem[] }>(CRM_API.reviews).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Online Review Management" description="Google, TripAdvisor, Booking.com, Agoda, Expedia" />;
  return (
    <CrmShell title="Online Reviews" description="Track and respond to OTA and platform reviews">
      <DataTable headers={['Guest', 'Source', 'Rating', 'Title', 'Published', 'Date']} rows={rows.map((r) => [
        r.guestName ?? '—', r.source, `${r.rating}/5`, r.title ?? '—', r.isPublished ? 'Yes' : 'No', new Date(r.createdAt).toLocaleDateString(),
      ])} />
    </CrmShell>
  );
}

export function CrmUpsellPage() {
  return (
    <CrmShell title="Upsell & Cross-sell" description="AI-powered recommendations for room upgrades, spa, dining, airport pickup">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {['Room Upgrade', 'Spa Package', 'Restaurant Offer', 'Airport Pickup', 'Late Checkout', 'Birthday Decoration'].map((item) => (
          <Card key={item}><CardContent className="p-4"><div className="font-medium">{item}</div><div className="text-sm text-muted-foreground mt-1">Personalized offers based on guest profile and stay context</div></CardContent></Card>
        ))}
      </div>
    </CrmShell>
  );
}

export function CrmAnalyticsPage() {
  const [data, setData] = useState<CrmAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmAnalyticsData }>(CRM_API.analytics).then((r) => setData(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="CRM Analytics" description="Acquisition, retention, loyalty, campaign ROI, CLV" />;
  const d = data!;
  return (
    <CrmShell title="Analytics" description="Guest acquisition, retention, and campaign performance">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Guest Acquisition</CardTitle></CardHeader>
          <CardContent className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={d.guestAcquisition}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="count" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Retention Trend</CardTitle></CardHeader>
          <CardContent className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={d.retentionTrend}><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="pct" stroke="hsl(var(--primary))" /></LineChart></ResponsiveContainer></CardContent></Card>
      </div>
    </CrmShell>
  );
}

export function CrmOwnerPage() {
  const [stats, setStats] = useState<CrmOwnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: CrmOwnerDashboardStats }>(CRM_API.ownerDashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Owner Dashboard" description="CLV, retention, campaign ROI, top corporate and travel agents" />;
  const s = stats!;
  return (
    <CrmShell title="Owner CRM Dashboard" description="Executive guest relationship and revenue overview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Repeat Booking</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.repeatBookingPct}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Customer LTV</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{s.customerLifetimeValue.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Campaign ROI</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.campaignRoi}x</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Satisfaction</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.guestSatisfaction}%</div></CardContent></Card>
      </div>
    </CrmShell>
  );
}

export function CrmReportsPage() {
  const [report, setReport] = useState<{ type: string; summary: Record<string, number> } | null>(null);
  useEffect(() => { apiClient.get(CRM_API.report('summary')).then((r) => setReport(r.data.data)); }, []);
  return (
    <CrmShell title="CRM Reports" description="Guest master, VIP, loyalty, campaign, corporate, referral, satisfaction">
      <div className="flex flex-wrap gap-2 mb-4">
        {['guests', 'vip', 'loyalty', 'campaigns', 'corporate', 'referral', 'satisfaction'].map((t) => (
          <Button key={t} variant="outline" size="sm" onClick={() => apiClient.get(CRM_API.report(t)).then((r) => setReport(r.data.data))}>{t}</Button>
        ))}
      </div>
      {report && <Card><CardContent className="p-4 text-sm space-y-1">
        <div className="font-medium capitalize">{report.type} Report</div>
        {Object.entries(report.summary).map(([k, v]) => <div key={k} className="flex justify-between"><span className="text-muted-foreground capitalize">{k}</span><span>{v}</span></div>)}
      </CardContent></Card>}
    </CrmShell>
  );
}

export function CrmMobilePage() {
  return (
    <CrmShell title="CRM Mobile Apps" description="Sales Manager, CRM Manager, Owner, and Guest Loyalty apps">
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Smartphone className="h-16 w-16 text-muted-foreground" />
        <p className="max-w-md text-sm text-muted-foreground">Native mobile apps for sales pipeline, guest lookup, loyalty enrollment, and campaign monitoring on the go.</p>
      </div>
    </CrmShell>
  );
}

export function CrmAiPage() {
  return (
    <CrmShell title="AI Personalization" description="Predict repeat booking, churn, CLV, and personalized offers">
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Sparkles className="h-16 w-16 text-muted-foreground" />
        <div className="grid gap-2 text-sm text-muted-foreground max-w-lg">
          <p>• Predict repeat booking and churn</p>
          <p>• Customer lifetime value modeling</p>
          <p>• Personalized room and food recommendations</p>
          <p>• Campaign send-time optimization</p>
          <p>• Sentiment analysis on feedback and reviews</p>
        </div>
      </div>
    </CrmShell>
  );
}
