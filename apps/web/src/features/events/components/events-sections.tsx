'use client';

import { useEffect, useState } from 'react';
import { Loader2, Smartphone, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventsShell } from '@/features/events/components/events-shell';
import { EVENTS_API } from '@/features/events/constants/events-navigation';
import { apiClient } from '@/services/api-client';

import type {
  EventsBookingItem,
  EventsCalendarDay,
  EventsChecklistItem,
  EventsClientItem,
  EventsContractItem,
  EventsHallItem,
  EventsLeadItem,
  EventsMenuItem,
  EventsOperationsStats,
  EventsOwnerDashboardStats,
  EventsPackageItem,
  EventsPaymentItem,
  EventsQuotationItem,
  EventsResourceItem,
  EventsRoomBlockItem,
  EventsSeatingPlanItem,
  EventsTaskItem,
  EventsTimelineItem,
  EventsVendorItem,
} from '@tungaos/shared';
import { EVENTS_ARCHITECTURE_MERMAID, EVENT_SALES_WORKFLOW_MERMAID } from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <EventsShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </EventsShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const pending = ['PENDING', 'DRAFT', 'NEW', 'TENTATIVE', 'INQUIRY'].some((x) => status.includes(x));
  const done = ['CONFIRMED', 'COMPLETED', 'APPROVED', 'PAID'].some((x) => status.includes(x));
  return <Badge variant={pending ? 'secondary' : done ? 'default' : 'outline'}>{status.replace(/_/g, ' ')}</Badge>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50"><tr>{headers.map((h) => <th key={h} className="px-4 py-2 text-left">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="px-4 py-2">{cell}</td>)}</tr>)}</tbody>
      </table>
      {rows.length === 0 && <p className="p-4 text-sm text-muted-foreground">No records yet. Initialize the platform from the dashboard.</p>}
    </div>
  );
}

export function EventsLeadsPage() {
  const [rows, setRows] = useState<EventsLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsLeadItem[] }>(EVENTS_API.leads).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Event Lead Management" description="Capture leads from website, phone, walk-in, WhatsApp, and referrals" />;
  return (
    <EventsShell title="Event Leads" description="Sales pipeline from inquiry to booking confirmation">
      <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{EVENT_SALES_WORKFLOW_MERMAID}</pre>
      <DataTable
        headers={['Code', 'Client', 'Type', 'Source', 'Status', 'Expected Date', 'Guests', 'Revenue', 'Probability']}
        rows={rows.map((r) => [
          r.leadCode, r.clientName, r.eventType, r.source,
          <StatusBadge key="s" status={r.status} />,
          r.expectedDate ?? '—', r.expectedGuests ?? '—',
          r.expectedRevenue ? `₹${r.expectedRevenue.toLocaleString('en-IN')}` : '—',
          `${r.probability}%`,
        ])}
      />
    </EventsShell>
  );
}

export function EventsClientsPage() {
  const [rows, setRows] = useState<EventsClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsClientItem[] }>(EVENTS_API.clients).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Event Client Profiles" description="Client master with GST, contracts, and event history" />;
  return (
    <EventsShell title="Event Clients" description="Integrated with PMS guest profiles and CRM follow-up">
      <DataTable
        headers={['Code', 'Name', 'Company', 'GST', 'Phone', 'Events', 'Total Spend']}
        rows={rows.map((r) => [
          r.clientCode, r.name, r.company ?? '—', r.gstNumber ?? '—', r.phone ?? '—',
          r.eventCount, `₹${r.totalSpend.toLocaleString('en-IN')}`,
        ])}
      />
    </EventsShell>
  );
}

export function EventsHallsPage() {
  const [rows, setRows] = useState<EventsHallItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsHallItem[] }>(EVENTS_API.halls).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Banquet Hall Master" description="Capacity, layouts, amenities, floor plans, and 360 tours" />;
  return (
    <EventsShell title="Banquet Halls" description="Hall master with theatre, classroom, round table, U-shape, and boardroom layouts">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
        {rows.map((h) => (
          <Card key={h.id}><CardContent className="p-4">
            <div className="font-medium">{h.name}</div>
            <div className="text-sm text-muted-foreground">{h.hallCode} · {h.minGuests}–{h.maxGuests} guests</div>
            <div className="mt-2 text-sm">Base rate: ₹{h.baseRate.toLocaleString('en-IN')}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {h.amenities.slice(0, 4).map((a) => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Occupancy: {h.occupancyPct}%</div>
          </CardContent></Card>
        ))}
      </div>
      <DataTable
        headers={['Code', 'Name', 'Capacity', 'Min', 'Max', 'Base Rate', 'Status']}
        rows={rows.map((r) => [
          r.hallCode, r.name, r.capacity, r.minGuests, r.maxGuests,
          `₹${r.baseRate.toLocaleString('en-IN')}`,
          r.isActive ? <Badge key="a">Active</Badge> : <Badge key="i" variant="secondary">Inactive</Badge>,
        ])}
      />
    </EventsShell>
  );
}

export function EventsCalendarPage() {
  const [days, setDays] = useState<EventsCalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsCalendarDay[] }>(EVENTS_API.calendar).then((r) => setDays(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Venue Calendar" description="Daily, weekly, monthly availability and booking calendar" />;
  return (
    <EventsShell title="Venue Calendar" description="Availability, bookings, blocked dates, and maintenance">
      <div className="space-y-4">
        {days.map((day) => (
          <Card key={day.date}><CardHeader className="pb-2"><CardTitle className="text-base">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</CardTitle></CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {day.halls.map((h) => (
                <div key={h.hallId} className="rounded-lg border p-3 text-sm">
                  <div className="font-medium">{h.hallName}</div>
                  {h.blocks.length === 0 ? <div className="text-muted-foreground mt-1">Available</div> : h.blocks.map((b) => (
                    <div key={b.id} className="mt-1 flex items-center gap-2">
                      <Badge variant={b.blockType === 'BOOKING' ? 'default' : 'secondary'}>{b.blockType}</Badge>
                      <span>{b.eventName ?? b.title ?? 'Blocked'}</span>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </EventsShell>
  );
}

export function EventsBookingsPage() {
  const [rows, setRows] = useState<EventsBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsBookingItem[] }>(EVENTS_API.bookings).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Event Bookings" description="Confirmed weddings, conferences, and celebrations" />;
  return (
    <EventsShell title="Event Bookings" description="Wedding, conference, birthday, and custom event bookings">
      <DataTable
        headers={['Code', 'Event', 'Type', 'Status', 'Hall', 'Start', 'Guests', 'Amount', 'Client']}
        rows={rows.map((r) => [
          r.eventCode, r.name, r.eventType, <StatusBadge key="s" status={r.status} />,
          r.hallName ?? '—', new Date(r.startDate).toLocaleDateString(),
          r.expectedGuests ?? '—', `₹${r.totalAmount.toLocaleString('en-IN')}`, r.clientName ?? '—',
        ])}
      />
    </EventsShell>
  );
}

export function EventsQuotationsPage() {
  const [rows, setRows] = useState<EventsQuotationItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsQuotationItem[] }>(EVENTS_API.quotations).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Quotation Builder" description="Hall, decoration, food, beverages, AV, taxes, and PDF export" />;
  return (
    <EventsShell title="Quotations" description="Build proposals with hall charges, catering, decoration, and taxes">
      <DataTable
        headers={['Quote #', 'Client', 'Type', 'Status', 'Event Date', 'Guests', 'Total', 'Valid Until']}
        rows={rows.map((r) => [
          r.quoteNumber, r.clientName ?? '—', r.eventType ?? '—',
          <StatusBadge key="s" status={r.status} />,
          r.eventDate ?? '—', r.guestCount, `₹${r.totalAmount.toLocaleString('en-IN')}`, r.validUntil ?? '—',
        ])}
      />
    </EventsShell>
  );
}

export function EventsPackagesPage() {
  const [rows, setRows] = useState<EventsPackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsPackageItem[] }>(EVENTS_API.packages).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Event Packages" description="Wedding, conference, birthday, corporate, premium, and custom packages" />;
  return (
    <EventsShell title="Package Management" description="Pre-configured packages with inclusions and pricing">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((p) => (
          <Card key={p.id}><CardContent className="p-4">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-muted-foreground">{p.code} · {p.eventType}</div>
            <div className="mt-2 text-lg font-bold">₹{p.basePrice.toLocaleString('en-IN')}</div>
            <ul className="mt-2 text-xs text-muted-foreground list-disc pl-4">
              {p.inclusions.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </CardContent></Card>
        ))}
      </div>
    </EventsShell>
  );
}

export function EventsMenusPage() {
  const [rows, setRows] = useState<EventsMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsMenuItem[] }>(EVENTS_API.menus).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Banquet Menu Planner" description="Breakfast, lunch, high tea, dinner, buffet, live counter — POS integrated" />;
  return (
    <EventsShell title="Menu Planning" description="Banquet menus integrated with Restaurant POS and Kitchen Display">
      <DataTable
        headers={['Menu', 'Meal', 'Style', 'Guests', 'Total', 'Event', 'POS Sync']}
        rows={rows.map((r) => [
          r.name, r.mealType, r.style, r.guestCount, `₹${r.totalAmount.toLocaleString('en-IN')}`,
          r.eventName ?? 'Template', r.posSynced ? <Badge key="p">Synced</Badge> : '—',
        ])}
      />
    </EventsShell>
  );
}

export function EventsSeatingPage() {
  const [rows, setRows] = useState<EventsSeatingPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsSeatingPlanItem[] }>(EVENTS_API.seating).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Seating Planner" description="Visual drag-and-drop layout with round tables, VIP, stage, and dance floor" />;
  return (
    <EventsShell title="Seating Planner" description="Round tables, rows, VIP seating, stage, buffet, and emergency exits">
      {rows.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">
          Visual seating planner with drag-and-drop layout editor. Create an event booking to design seating arrangements.
        </CardContent></Card>
      ) : (
        <DataTable headers={['Event', 'Layout', 'Guests', 'Updated']} rows={rows.map((r) => [r.eventName, r.name, r.guestCount, r.updatedAt])} />
      )}
    </EventsShell>
  );
}

export function EventsTasksPage() {
  const [rows, setRows] = useState<EventsTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsTaskItem[] }>(EVENTS_API.tasks).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Event Task Management" description="Decoration, kitchen, housekeeping, AV, security task engine" />;
  return (
    <EventsShell title="Event Tasks" description="Assign owners, deadlines, priority, and track completion">
      <DataTable
        headers={['Event', 'Category', 'Task', 'Owner', 'Deadline', 'Priority', 'Status']}
        rows={rows.map((r) => [
          r.eventName, r.category, r.title, r.ownerName ?? '—',
          r.deadline ? new Date(r.deadline).toLocaleString() : '—',
          r.priority, <StatusBadge key="s" status={r.status} />,
        ])}
      />
    </EventsShell>
  );
}

export function EventsResourcesPage() {
  const [rows, setRows] = useState<EventsResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsResourceItem[] }>(EVENTS_API.resources).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Resource Management" description="Tables, chairs, stage, AV equipment, and staff allocation" />;
  return (
    <EventsShell title="Event Resources" description="Track inventory, allocation, and availability">
      <DataTable
        headers={['Code', 'Resource', 'Category', 'Total', 'Available', 'Allocated']}
        rows={rows.map((r) => [r.code, r.name, r.category, r.totalQty, r.availableQty, r.allocatedQty])}
      />
    </EventsShell>
  );
}

export function EventsRoomBlocksPage() {
  const [rows, setRows] = useState<EventsRoomBlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsRoomBlockItem[] }>(EVENTS_API.roomBlocks).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Room Blocking" description="Auto-reserve hotel rooms for wedding guests, VIPs, and speakers via PMS" />;
  return (
    <EventsShell title="Room Blocks" description="PMS-integrated room reservations for event guests">
      <DataTable
        headers={['Event', 'Category', 'Guest', 'Rooms', 'Check-in', 'Check-out', 'PMS']}
        rows={rows.map((r) => [
          r.eventName, r.guestCategory, r.guestName ?? '—', r.roomCount,
          r.checkInDate, r.checkOutDate, r.pmsSynced ? <Badge key="p">Synced</Badge> : 'Pending',
        ])}
      />
    </EventsShell>
  );
}

export function EventsPaymentsPage() {
  const [rows, setRows] = useState<EventsPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsPaymentItem[] }>(EVENTS_API.payments).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Payment Management" description="Advance, stage payments, security deposit, final settlement, GST invoice" />;
  return (
    <EventsShell title="Event Payments" description="Integrated with Finance for GST invoices and credit notes">
      <DataTable
        headers={['Event', 'Client', 'Type', 'Amount', 'GST', 'Paid At']}
        rows={rows.map((r) => [
          r.eventName, r.clientName ?? '—', r.paymentType.replace(/_/g, ' '),
          `₹${r.amount.toLocaleString('en-IN')}`, `₹${r.gstAmount.toLocaleString('en-IN')}`,
          new Date(r.paidAt).toLocaleString(),
        ])}
      />
    </EventsShell>
  );
}

export function EventsContractsPage() {
  const [rows, setRows] = useState<EventsContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsContractItem[] }>(EVENTS_API.contracts).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Contract Management" description="Agreements, terms, cancellation policy, digital signature" />;
  return (
    <EventsShell title="Event Contracts" description="Version history, force majeure, and encrypted contract storage">
      <DataTable
        headers={['Contract #', 'Event', 'Client', 'Version', 'Signed', 'Created']}
        rows={rows.map((r) => [
          r.contractNumber, r.eventName, r.clientName ?? '—', r.version,
          r.signedAt ? new Date(r.signedAt).toLocaleDateString() : 'Pending', r.createdAt,
        ])}
      />
    </EventsShell>
  );
}

export function EventsVendorsPage() {
  const [rows, setRows] = useState<EventsVendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsVendorItem[] }>(EVENTS_API.vendors).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Vendor Management" description="Decorator, photographer, DJ, florist, sound, lighting, security" />;
  return (
    <EventsShell title="Event Vendors" description="Track rates, performance, and payments">
      <DataTable
        headers={['Vendor', 'Category', 'Contact', 'Phone', 'Rating', 'Preferred']}
        rows={rows.map((r) => [
          r.name, r.category.replace(/_/g, ' '), r.contactName ?? '—', r.phone ?? '—',
          `${r.rating}/5`, r.isPreferred ? <Badge key="p">Preferred</Badge> : '—',
        ])}
      />
    </EventsShell>
  );
}

export function EventsChecklistsPage() {
  const [rows, setRows] = useState<EventsChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsChecklistItem[] }>(EVENTS_API.checklists).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Checklist Management" description="Reusable wedding, conference, and birthday checklists" />;
  return (
    <EventsShell title="Event Checklists" description="Template and event-specific operational checklists">
      <DataTable
        headers={['Checklist', 'Event Type', 'Template', 'Items', 'Completed']}
        rows={rows.map((r) => [
          r.name, r.eventType ?? 'All', r.isTemplate ? 'Yes' : 'No',
          r.totalItems, `${r.completedItems}/${r.totalItems}`,
        ])}
      />
    </EventsShell>
  );
}

export function EventsTimelinePage() {
  const [rows, setRows] = useState<EventsTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsTimelineItem[] }>(EVENTS_API.timeline).then((r) => setRows(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Event Timeline" description="Lead → Booking → Planning → Execution → Closure → Feedback" />;
  return (
    <EventsShell title="Event Timeline" description="Complete event lifecycle audit trail">
      <DataTable
        headers={['Event', 'Phase', 'Milestone', 'Occurred At']}
        rows={rows.map((r) => [r.eventName, r.phase, r.title, new Date(r.occurredAt).toLocaleString()])}
      />
    </EventsShell>
  );
}

export function EventsOperationsPage() {
  const [stats, setStats] = useState<EventsOperationsStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsOperationsStats }>(EVENTS_API.operationsDashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Operations Dashboard" description="Today's tasks, kitchen, decoration, room readiness" />;
  const s = stats!;
  return (
    <EventsShell title="Operations Dashboard" description="Real-time event execution command center">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Today's Tasks</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.todaysTasks}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Staff Assigned</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.staffAssigned}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Room Readiness</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.roomReadinessPct}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Kitchen Ready</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.kitchenReady}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Decoration Ready</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.decorationReady}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending Deliverables</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.pendingDeliverables}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="text-base">Tasks by Category</CardTitle></CardHeader>
        <CardContent className="h-48"><ResponsiveContainer width="100%" height="100%"><BarChart data={s.tasksByCategory}><XAxis dataKey="category" /><YAxis /><Tooltip /><Bar dataKey="pending" fill="hsl(var(--muted-foreground))" name="Pending" /><Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" /></BarChart></ResponsiveContainer></CardContent></Card>
    </EventsShell>
  );
}

export function EventsOwnerPage() {
  const [stats, setStats] = useState<EventsOwnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiClient.get<{ data: EventsOwnerDashboardStats }>(EVENTS_API.ownerDashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading title="Owner Dashboard" description="Revenue, conversion, hall utilization, profit margin" />;
  const s = stats!;
  return (
    <EventsShell title="Owner Event Dashboard" description="Executive revenue and utilization overview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Monthly Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{s.monthlyEventRevenue.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg Booking Value</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{s.averageBookingValue.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Lead Conversion</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.leadConversionPct}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Hall Utilization</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.hallUtilizationPct}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Wedding Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{s.weddingRevenue.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Corporate Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{s.corporateRevenue.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Profit Margin</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.profitMarginPct}%</div></CardContent></Card>
      </div>
    </EventsShell>
  );
}

export function EventsReportsPage() {
  const [report, setReport] = useState<{ type: string; summary: Record<string, number> } | null>(null);
  useEffect(() => { apiClient.get(EVENTS_API.report('summary')).then((r) => setReport(r.data.data)); }, []);
  return (
    <EventsShell title="Event Reports" description="Event register, revenue, leads, quotations, hall utilization, vendors">
      <div className="flex flex-wrap gap-2 mb-4">
        {['register', 'revenue', 'leads', 'quotations', 'halls', 'vendors', 'tasks'].map((t) => (
          <Button key={t} variant="outline" size="sm" onClick={() => apiClient.get(EVENTS_API.report(t)).then((r) => setReport(r.data.data))}>{t}</Button>
        ))}
      </div>
      {report && <Card><CardContent className="p-4 text-sm space-y-1">
        <div className="font-medium capitalize">{report.type} Report</div>
        {Object.entries(report.summary).map(([k, v]) => <div key={k} className="flex justify-between"><span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, ' $1')}</span><span>{v}</span></div>)}
      </CardContent></Card>}
    </EventsShell>
  );
}

export function EventsMobilePage() {
  return (
    <EventsShell title="Event Mobile Apps" description="Sales App, Event Manager App, Operations App, and Client Portal">
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Smartphone className="h-16 w-16 text-muted-foreground" />
        <p className="max-w-md text-sm text-muted-foreground">Native mobile apps for sales executives, event managers, operations teams, and client self-service portals.</p>
      </div>
    </EventsShell>
  );
}

export function EventsAiPage() {
  return (
    <EventsShell title="AI Event Intelligence" description="Predict conversion, suggest packages, optimize seating, and staff requirements">
      <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{EVENTS_ARCHITECTURE_MERMAID}</pre>
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <Sparkles className="h-16 w-16 text-muted-foreground" />
        <div className="grid gap-2 text-sm text-muted-foreground max-w-lg">
          <p>• Predict lead conversion probability</p>
          <p>• Suggest best package for event type and budget</p>
          <p>• Predict revenue and optimize seating layouts</p>
          <p>• Recommend upselling opportunities</p>
          <p>• Predict staff requirements and generate timelines</p>
        </div>
      </div>
    </EventsShell>
  );
}
