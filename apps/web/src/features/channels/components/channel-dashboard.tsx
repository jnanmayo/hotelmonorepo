'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeftRight,
  Clock,
  DollarSign,
  Globe,
  Percent,
  Plug,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CHANNEL_API } from '@/features/channels/api/endpoints';
import { CHANNEL_BASE, SUPPORTED_OTAS } from '@/features/channels/constants/channel-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

interface ChannelDashboardData {
  connectedChannels: number;
  failedSync: number;
  pendingSync: number;
  todayOtaBookings: number;
  todayDirectBookings: number;
  revenueByChannel: { ota: number; direct: number };
  topOta: string;
  commissionPaid: number;
  commissionOutstanding: number;
  commissionSaved: number;
  directBookingPct: number;
  otaBookingPct: number;
  bookingSourcePct: { label: string; pct: number; count: number }[];
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  alert,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  alert?: boolean;
}) {
  return (
    <Card className={alert ? 'border-amber-200' : undefined}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cnIcon(alert)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function cnIcon(alert?: boolean) {
  return alert ? 'h-4 w-4 text-amber-600' : 'h-4 w-4 text-muted-foreground';
}

export function ChannelDashboard() {
  const [data, setData] = useState<ChannelDashboardData | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    apiClient.get<{ data: ChannelDashboardData }>(CHANNEL_API.dashboard).then((r) => setData(r.data.data)).catch(() => {});
  }, []);

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      await apiClient.post(CHANNEL_API.syncInventory);
      await apiClient.post(CHANNEL_API.syncRates);
      toast.success('Sync queued for all connected channels');
    } catch {
      toast.error('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2">Channel Manager</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sync inventory, rates, and bookings across all OTAs — SiteMinder-grade distribution.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSyncAll} disabled={syncing}>
            <RefreshCw className={cnSpin(syncing)} />
            Sync All Channels
          </Button>
          <Button size="sm" asChild>
            <Link href={asRoute(`${CHANNEL_BASE}/connections`)}>
              <Plug className="mr-2 h-4 w-4" />
              Connect Channel
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Connected Channels" value={data?.connectedChannels ?? 0} icon={Plug} sub={`of ${SUPPORTED_OTAS.length} supported`} />
        <StatCard title="Failed Sync" value={data?.failedSync ?? 0} icon={AlertTriangle} alert={(data?.failedSync ?? 0) > 0} />
        <StatCard title="Pending Sync" value={data?.pendingSync ?? 0} icon={Clock} />
        <StatCard title="Top OTA Today" value={data?.topOta ?? '—'} icon={TrendingUp} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's OTA Bookings" value={data?.todayOtaBookings ?? 0} icon={ArrowLeftRight} sub={`${data?.otaBookingPct ?? 0}% of today`} />
        <StatCard title="Today's Direct Bookings" value={data?.todayDirectBookings ?? 0} icon={Globe} sub={`${data?.directBookingPct ?? 0}% of today`} />
        <StatCard title="Commission Saved" value={`₹${(data?.commissionSaved ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} sub="vs OTA commission" />
        <StatCard title="Commission Outstanding" value={`₹${(data?.commissionOutstanding ?? 0).toLocaleString('en-IN')}`} icon={Percent} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Channel</CardTitle>
            <CardDescription>OTA vs direct website revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RevenueBar label="Direct Website" amount={data?.revenueByChannel.direct ?? 0} total={(data?.revenueByChannel.ota ?? 0) + (data?.revenueByChannel.direct ?? 0)} color="bg-emerald-500" />
              <RevenueBar label="OTA Channels" amount={data?.revenueByChannel.ota ?? 0} total={(data?.revenueByChannel.ota ?? 0) + (data?.revenueByChannel.direct ?? 0)} color="bg-tunga-navy" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border p-4">
              <div>
                <p className="text-xs text-muted-foreground">Commission Paid</p>
                <p className="text-lg font-bold">₹{(data?.commissionPaid ?? 0).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Direct Revenue</p>
                <p className="text-lg font-bold text-emerald-700">₹{(data?.revenueByChannel.direct ?? 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Connect OTA', href: `${CHANNEL_BASE}/connections` },
              { label: 'Map Rooms', href: `${CHANNEL_BASE}/room-mapping` },
              { label: 'Map Rate Plans', href: `${CHANNEL_BASE}/rate-mapping` },
              { label: 'View Sync Logs', href: `${CHANNEL_BASE}/sync-logs` },
              { label: 'OTA Bookings', href: `${CHANNEL_BASE}/ota-bookings` },
              { label: 'Commission Report', href: `${CHANNEL_BASE}/commission` },
            ].map((link) => (
              <Button key={link.href} variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={asRoute(link.href)}>{link.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supported Channels</CardTitle>
          <CardDescription>Extensible architecture — connect any OTA via API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {SUPPORTED_OTAS.map((ota) => (
              <div key={ota.id} className="flex items-center gap-3 rounded-lg border p-3">
                <span className="text-xl">{ota.logo}</span>
                <div>
                  <p className="text-sm font-medium">{ota.name}</p>
                  <Badge variant="outline" className="mt-1 text-[10px]">{ota.id}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {data?.bookingSourcePct && data.bookingSourcePct.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking Source Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.bookingSourcePct.map((s) => (
                <div key={s.label} className="rounded-lg border px-4 py-2">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.pct}% · {s.count} bookings</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RevenueBar({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const pct = total ? Math.round((amount / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">₹{amount.toLocaleString('en-IN')} ({pct}%)</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={cnBar(color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function cnBar(color: string) {
  return `h-full rounded-full transition-all ${color}`;
}

function cnSpin(syncing: boolean) {
  return syncing ? 'mr-2 h-4 w-4 animate-spin' : 'mr-2 h-4 w-4';
}
