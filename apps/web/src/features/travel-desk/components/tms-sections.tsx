'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, MapPin, Smartphone } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TravelDeskShell } from '@/features/travel-desk/components/travel-desk-shell';
import { TMS_API, TMS_ROUTES } from '@/features/travel-desk/constants/travel-desk-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type {
  TmsAnalyticsData,
  TmsDispatchStats,
  TmsDriverItem,
  TmsFuelLogItem,
  TmsGpsItem,
  TmsMaintenanceItem,
  TmsOwnerDashboardStats,
  TmsPaymentItem,
  TmsRequestItem,
  TmsShuttleRouteItem,
  TmsTripItem,
  TmsVehicleItem,
  TmsVendorItem,
} from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <TravelDeskShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </TravelDeskShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const urgent = ['REQUESTED', 'PENDING', 'EMERGENCY', 'DELAYED'].some((x) => status.includes(x));
  const done = ['COMPLETED', 'PAID', 'AVAILABLE'].some((x) => status.includes(x));
  const variant = urgent ? 'danger' : done ? 'default' : 'secondary';
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
}

function TripTable({ rows, empty }: { rows: TmsTripItem[]; empty: string }) {
  return (
    <div className="space-y-2">
      {rows.map((t) => (
        <Card key={t.id}>
          <CardContent className="py-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-medium flex items-center gap-2">
                {t.tripNumber} — {t.guestName}
                {t.isVip && <Badge variant="outline">VIP</Badge>}
                {t.isEmergency && <Badge variant="danger">Emergency</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">
                {t.pickupLocation} → {t.dropLocation}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.tripType.replace(/_/g, ' ')} · {t.vehicleName ?? 'Unassigned'} · {t.driverName ?? 'No driver'}
                {t.flightNumber && ` · ${t.flightNumber}`}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">₹{t.fare.toLocaleString('en-IN')}</span>
              <StatusBadge status={t.status} />
            </div>
          </CardContent>
        </Card>
      ))}
      {rows.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead><tr className="border-b bg-muted/50">{headers.map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i} className="border-b">{row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function TmsRequestsPage() {
  const [rows, setRows] = useState<TmsRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsRequestItem[] }>(TMS_API.requests).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Travel Desk" description="Airport, corporate, VIP, shuttle, taxi, and emergency requests from all channels" />;
  return (
    <TravelDeskShell title="Travel Desk" description="Requests from Website, PMS, Guest Portal, Reception, Corporate Portal, Phone, WhatsApp">
      <DataTable
        headers={['Type', 'From', 'To', 'Scheduled', 'Amount', 'Status', 'Created']}
        rows={rows.map((r) => [
          r.requestType.replace(/_/g, ' '),
          r.fromLocation ?? '—',
          r.toLocation ?? '—',
          r.scheduledAt ? new Date(r.scheduledAt).toLocaleString() : '—',
          `₹${r.amount.toLocaleString('en-IN')}`,
          <StatusBadge key="s" status={r.status} />,
          new Date(r.createdAt).toLocaleDateString(),
        ])}
      />
    </TravelDeskShell>
  );
}

export function TmsDispatchPage() {
  const [stats, setStats] = useState<TmsDispatchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    apiClient.get<{ data: TmsDispatchStats }>(TMS_API.dispatch).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <Loading title="Dispatch Center" description="Real-time dispatch board — pending trips, available resources, live operations" />;
  const s = stats ?? ({} as TmsDispatchStats);
  return (
    <TravelDeskShell title="Dispatch Center" description="Pending trips, available drivers & vehicles, live & emergency trips">
      <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ['Pending', s.pendingTrips], ['Available Drivers', s.availableDrivers], ['Available Vehicles', s.availableVehicles],
          ['Live Trips', s.liveTrips], ['Emergency', s.emergencyTrips], ['Delayed', s.delayedTrips],
        ].map(([label, val]) => (
          <Card key={label as string}><CardContent className="pt-4"><div className="text-2xl font-bold">{val ?? 0}</div><div className="text-xs text-muted-foreground">{label}</div></CardContent></Card>
        ))}
      </div>
      <TripTable rows={s.trips ?? []} empty="No active dispatch items" />
    </TravelDeskShell>
  );
}

export function TmsTripsPage() {
  const [rows, setRows] = useState<TmsTripItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsTripItem[] }>(TMS_API.trips).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Trip Management" description="Complete trip lifecycle from request to billing" />;
  return (
    <TravelDeskShell title="Trip Management" description="Requested → Approved → Assigned → En Route → Completed → Billed">
      <TripTable rows={rows} empty="No trips yet. Create from Travel Desk or initialize fleet." />
    </TravelDeskShell>
  );
}

export function TmsAirportPage() {
  const [rows, setRows] = useState<TmsTripItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsTripItem[] }>(TMS_API.airport).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Airport Transfers" description="Arrival pickup, departure drop, flight tracking, meet & greet" />;
  return (
    <TravelDeskShell title="Airport Transfers" description="Integrated with PMS arrivals/departures and Guest Portal">
      <TripTable rows={rows} empty="No airport transfers scheduled" />
    </TravelDeskShell>
  );
}

export function TmsCorporatePage() {
  const [rows, setRows] = useState<TmsTripItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsTripItem[] }>(TMS_API.corporate).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Corporate Transport" description="Employee pickup, conference shuttle, VIP executive, recurring trips" />;
  return (
    <TravelDeskShell title="Corporate Transport" description="Integrated with Corporate Sales portal and monthly billing">
      <TripTable rows={rows} empty="No corporate transport trips" />
    </TravelDeskShell>
  );
}

export function TmsShuttlePage() {
  const [rows, setRows] = useState<TmsShuttleRouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsShuttleRouteItem[] }>(TMS_API.shuttle).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Hotel Shuttle" description="Routes, schedules, stops, capacity, passenger lists" />;
  return (
    <TravelDeskShell title="Hotel Shuttle" description="Manage shuttle routes and schedules">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{r.name}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {r.description ?? 'Hotel shuttle route'}
              <div className="mt-2">{r.stopCount} stops · {r.scheduleCount} schedules</div>
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No shuttle routes configured</p>}
      </div>
    </TravelDeskShell>
  );
}

export function TmsVehiclesPage() {
  const [rows, setRows] = useState<TmsVehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsVehicleItem[] }>(TMS_API.vehicles).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Vehicle Master" description="Complete fleet register with documents, GPS, QR codes" />;
  return (
    <TravelDeskShell title="Vehicle Register" description="Sedan, SUV, Luxury, Tempo, Bus, EV, Hotel Buggy">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((v) => (
          <Card key={v.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between gap-2">
                <span>{v.name}</span>
                <StatusBadge status={v.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-muted-foreground">{v.vehicleNumber} · {v.vehicleType}</div>
              {v.registrationNumber && <div>Reg: {v.registrationNumber}</div>}
              <div>Capacity: {v.capacity} · {v.fuelType ?? '—'}</div>
              {v.gpsDeviceId && <div className="text-xs">GPS: {v.gpsDeviceId}</div>}
              {v.vendorName && <div className="text-xs">Vendor: {v.vendorName}</div>}
            </CardContent>
          </Card>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No vehicles. Initialize from Dashboard.</p>}
      </div>
    </TravelDeskShell>
  );
}

export function TmsDriversPage() {
  const [rows, setRows] = useState<TmsDriverItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsDriverItem[] }>(TMS_API.drivers).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Driver Management" description="License, badge, shift, performance, training" />;
  return (
    <TravelDeskShell title="Driver Management" description="Integrated with HRMS for employee records">
      <DataTable
        headers={['Code', 'Name', 'Phone', 'License', 'Shift', 'Score', 'Duty', 'Current Trip']}
        rows={rows.map((d) => [
          d.driverCode,
          `${d.firstName} ${d.lastName}`,
          d.phone,
          d.licenseNumber,
          d.shift ?? '—',
          d.performanceScore.toFixed(1),
          d.isOnDuty ? <Badge key="d">On Duty</Badge> : 'Off',
          d.currentTrip ?? '—',
        ])}
      />
    </TravelDeskShell>
  );
}

export function TmsVendorsPage() {
  const [rows, setRows] = useState<TmsVendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsVendorItem[] }>(TMS_API.vendors).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Travel Vendors" description="Taxi, car rental, bus, luxury vehicle vendors" />;
  return (
    <TravelDeskShell title="Travel Vendors" description="Rates, contracts, payments, performance tracking">
      <DataTable
        headers={['Name', 'Type', 'Contact', 'Phone', 'Rate', 'Rating']}
        rows={rows.map((v) => [
          v.name, v.vendorType, v.contactName ?? '—', v.phone ?? '—',
          v.contractRate ? `₹${v.contractRate.toLocaleString('en-IN')}` : '—',
          v.rating.toFixed(1),
        ])}
      />
    </TravelDeskShell>
  );
}

export function TmsFuelPage() {
  const [rows, setRows] = useState<TmsFuelLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsFuelLogItem[] }>(TMS_API.fuel).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Fuel Management" description="Fuel purchase, consumption, mileage, efficiency" />;
  return (
    <TravelDeskShell title="Fuel Management" description="Track fuel costs and vehicle mileage">
      <DataTable
        headers={['Vehicle', 'Date', 'Liters', 'Cost', 'Odometer', 'Mileage', 'Station']}
        rows={rows.map((f) => [
          f.vehicleName,
          new Date(f.fillDate).toLocaleDateString(),
          f.liters.toFixed(1),
          `₹${f.cost.toLocaleString('en-IN')}`,
          f.odometer ?? '—',
          f.mileage?.toFixed(1) ?? '—',
          f.stationName ?? '—',
        ])}
      />
    </TravelDeskShell>
  );
}

export function TmsMaintenancePage() {
  const [rows, setRows] = useState<TmsMaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsMaintenanceItem[] }>(TMS_API.maintenance).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Vehicle Maintenance" description="Service, oil, tyres, insurance, fitness — integrated with EAM" />;
  return (
    <TravelDeskShell title="Vehicle Maintenance" description="Links to Maintenance module for work orders">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href={asRoute('/app/maintenance')}>Open EAM / CMMS Module</Link>
        </Button>
      </div>
      <DataTable
        headers={['Vehicle', 'Type', 'Scheduled', 'Completed', 'Cost', 'Status']}
        rows={rows.map((m) => [
          m.vehicleName, m.maintenanceType,
          new Date(m.scheduledDate).toLocaleDateString(),
          m.completedDate ? new Date(m.completedDate).toLocaleDateString() : '—',
          `₹${m.cost.toLocaleString('en-IN')}`,
          <StatusBadge key="s" status={m.status} />,
        ])}
      />
    </TravelDeskShell>
  );
}

export function TmsGpsPage() {
  const [rows, setRows] = useState<TmsGpsItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsGpsItem[] }>(TMS_API.gps).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="GPS Tracking" description="Future-ready realtime vehicle location, route replay, geo-fence" />;
  return (
    <TravelDeskShell title="GPS Tracking" description="Realtime vehicle location — Socket.io ready architecture">
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" /> GPS device integration point for Samsara, Motive, Fleet Complete
      </div>
      <DataTable
        headers={['Vehicle', 'Driver', 'Trip', 'Latitude', 'Longitude', 'Speed', 'Recorded']}
        rows={rows.map((g) => [
          g.vehicleName ?? '—', g.driverName ?? '—', g.tripNumber ?? '—',
          g.latitude.toFixed(5), g.longitude.toFixed(5),
          g.speed != null ? `${g.speed} km/h` : '—',
          new Date(g.recordedAt).toLocaleString(),
        ])}
      />
    </TravelDeskShell>
  );
}

export function TmsBillingPage() {
  const [rows, setRows] = useState<TmsPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsPaymentItem[] }>(TMS_API.billing).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Trip Billing" description="Cash, card, UPI, room charge, corporate credit, GST invoice" />;
  return (
    <TravelDeskShell title="Trip Billing" description="Integrated with Finance for GST invoices — not a separate finance module">
      <DataTable
        headers={['Trip', 'Guest', 'Amount', 'Method', 'Status', 'Paid At']}
        rows={rows.map((p) => [
          p.tripNumber, p.guestName,
          `₹${p.amount.toLocaleString('en-IN')}`,
          p.paymentMethod.replace(/_/g, ' '),
          <StatusBadge key="s" status={p.paymentStatus} />,
          p.paidAt ? new Date(p.paidAt).toLocaleString() : '—',
        ])}
      />
    </TravelDeskShell>
  );
}

export function TmsCalendarPage() {
  const [rows, setRows] = useState<{ date: string; trips: number; vehicles: number; drivers: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: typeof rows }>(TMS_API.calendar).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Trip Calendar" description="Daily, weekly, monthly trips — vehicle and driver schedules" />;
  return (
    <TravelDeskShell title="Trip Calendar" description="Vehicle and driver scheduling">
      <DataTable
        headers={['Date', 'Trips', 'Vehicles', 'Drivers']}
        rows={rows.map((d) => [d.date, d.trips, d.vehicles, d.drivers])}
      />
    </TravelDeskShell>
  );
}

export function TmsAnalyticsPage() {
  const [data, setData] = useState<TmsAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsAnalyticsData }>(TMS_API.analytics).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Analytics" description="Trip analysis, revenue, utilization, fuel, airport, corporate" />;
  const d = data ?? ({} as TmsAnalyticsData);
  return (
    <TravelDeskShell title="Transport Analytics" description="Trip heatmap, revenue analysis, driver performance">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Trip Analysis</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.tripAnalysis ?? []}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Vehicle Utilization</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.vehicleUtilization ?? []}>
                <XAxis dataKey="vehicle" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="utilizationPct" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </TravelDeskShell>
  );
}

export function TmsReportsPage() {
  return (
    <TravelDeskShell title="Reports" description="Trip register, vehicle register, driver, fuel, revenue, corporate, airport">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {['trips', 'vehicles', 'drivers', 'fuel', 'revenue'].map((type) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="font-medium capitalize">{type} Report</div>
              <Button asChild size="sm" variant="outline" className="mt-2">
                <Link href={asRoute(TMS_ROUTES.analytics)}>View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </TravelDeskShell>
  );
}

export function TmsOwnerPage() {
  const [stats, setStats] = useState<TmsOwnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: TmsOwnerDashboardStats }>(TMS_API.ownerDashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Owner Dashboard" description="Transport revenue, utilization, costs, corporate revenue" />;
  const s = stats ?? ({} as TmsOwnerDashboardStats);
  return (
    <TravelDeskShell title="Owner Dashboard" description="Executive transport & fleet performance">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">₹{(s.transportRevenue ?? 0).toLocaleString('en-IN')}</div><div className="text-sm text-muted-foreground">Transport Revenue</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{s.tripCount ?? 0}</div><div className="text-sm text-muted-foreground">Trip Count</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{s.vehicleUtilizationPct ?? 0}%</div><div className="text-sm text-muted-foreground">Vehicle Utilization</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">₹{(s.corporateTransportRevenue ?? 0).toLocaleString('en-IN')}</div><div className="text-sm text-muted-foreground">Corporate Revenue</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">₹{(s.fuelCost ?? 0).toLocaleString('en-IN')}</div><div className="text-sm text-muted-foreground">Fuel Cost</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">₹{(s.maintenanceCost ?? 0).toLocaleString('en-IN')}</div><div className="text-sm text-muted-foreground">Maintenance Cost</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{s.driverPerformanceAvg ?? 0}/5</div><div className="text-sm text-muted-foreground">Driver Performance</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{s.mostUsedVehicle?.name ?? '—'}</div><div className="text-sm text-muted-foreground">Most Used Vehicle ({s.mostUsedVehicle?.tripCount ?? 0} trips)</div></CardContent></Card>
      </div>
    </TravelDeskShell>
  );
}

export function TmsMobilePage() {
  return (
    <TravelDeskShell title="Mobile Applications" description="Driver App, Travel Desk App, Dispatch App, Guest Transport App">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { title: 'Driver App', desc: 'Accept trips, navigation, GPS tracking, trip completion, guest communication' },
          { title: 'Travel Desk App', desc: 'Create requests, assign vehicles, manage airport & corporate transfers' },
          { title: 'Dispatch App', desc: 'Real-time dispatch board, emergency trips, driver/vehicle allocation' },
          { title: 'Guest Transport App', desc: 'Book transfer, track driver, ETA, call/chat driver, rate trip' },
        ].map((app) => (
          <Card key={app.title}>
            <CardContent className="p-4 flex gap-3">
              <Smartphone className="h-8 w-8 text-muted-foreground shrink-0" />
              <div>
                <div className="font-medium">{app.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{app.desc}</div>
                <Badge variant="outline" className="mt-2">PWA Ready</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TravelDeskShell>
  );
}
