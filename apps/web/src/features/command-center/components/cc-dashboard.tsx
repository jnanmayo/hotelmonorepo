'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Banknote,
  Building2,
  Car,
  DollarSign,
  Loader2,
  Percent,
  TrendingUp,
  Users,
  Utensils,
} from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommandCenterShell } from '@/features/command-center/components/command-center-shell';
import { CC_API, CC_ROUTES, BI_DATA_WAREHOUSE_MERMAID } from '@/features/command-center/constants/command-center-navigation';
import { useCommandCenterRealtime } from '@/features/command-center/hooks/use-command-center-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { CommandCenterStats } from '@tungaos/shared';

function Metric({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <Card className="border-border/60 bg-gradient-to-br from-card to-muted/20 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</CardTitle>
        <div className={`rounded-full p-2 ${accent ?? 'bg-primary/10 text-primary'}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function CcDashboard() {
  const [stats, setStats] = useState<CommandCenterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: CommandCenterStats }>(CC_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useCommandCenterRealtime(hotelId, () => load());

  if (loading) {
    return (
      <CommandCenterShell title="Owner Command Center" description="Digital brain of your hotel — all modules, one screen">
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </CommandCenterShell>
    );
  }

  const s = stats ?? ({} as CommandCenterStats);
  const live = s.liveHotelStatus ?? {} as CommandCenterStats['liveHotelStatus'];
  const kpi = s.kpiBoard ?? {} as CommandCenterStats['kpiBoard'];

  return (
    <CommandCenterShell title="Owner Command Center" description="Real-time intelligence from PMS, Finance, CRM, F&B, Events, HR, Inventory & Travel Desk">
      <div className="mb-6 flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href={asRoute(CC_ROUTES.warRoom)}>Digital War Room</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(CC_ROUTES.ai)}>AI Copilot</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(CC_ROUTES.alerts)}>Alert Center</Link></Button>
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Metric label="Today's Revenue" value={`₹${(s.todayRevenue ?? 0).toLocaleString('en-IN')}`} icon={DollarSign} accent="bg-emerald-500/10 text-emerald-600" />
        <Metric label="Today's Profit" value={`₹${(s.todayProfit ?? 0).toLocaleString('en-IN')}`} icon={TrendingUp} accent="bg-blue-500/10 text-blue-600" />
        <Metric label="Occupancy" value={`${s.occupancyPct ?? 0}%`} icon={Percent} />
        <Metric label="RevPAR" value={`₹${(s.revPar ?? 0).toLocaleString('en-IN')}`} icon={Activity} />
        <Metric label="ADR" value={`₹${(s.adr ?? 0).toLocaleString('en-IN')}`} icon={Building2} />
        <Metric label="Cash Position" value={`₹${(s.cashPosition ?? 0).toLocaleString('en-IN')}`} icon={Banknote} />
        <Metric label="Bank Balance" value={`₹${(s.bankBalance ?? 0).toLocaleString('en-IN')}`} icon={Banknote} />
        <Metric label="Room Revenue" value={`₹${(s.roomRevenue ?? 0).toLocaleString('en-IN')}`} icon={Building2} />
        <Metric label="Restaurant" value={`₹${(s.restaurantRevenue ?? 0).toLocaleString('en-IN')}`} icon={Utensils} />
        <Metric label="Banquet" value={`₹${(s.banquetRevenue ?? 0).toLocaleString('en-IN')}`} icon={Users} />
        <Metric label="Travel Desk" value={`₹${(s.travelDeskRevenue ?? 0).toLocaleString('en-IN')}`} icon={Car} />
        <Metric label="Guest Satisfaction" value={`${s.customerSatisfaction ?? 0}/5`} icon={Users} accent="bg-amber-500/10 text-amber-600" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.revenueTrend ?? []}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Live Hotel Status</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Total Rooms', live.totalRooms], ['Occupied', live.occupied], ['Vacant', live.vacant],
              ['Dirty', live.dirty], ['Cleaning', live.cleaning], ['Maintenance', live.maintenance],
              ['VIP Guests', live.vipGuests], ['Corporate', live.corporateGuests],
              ['Check-ins', live.checkInsToday], ['Check-outs', live.checkOutsToday],
              ['Walk-ins', live.walkIns], ['No Shows', live.noShows],
            ].map(([label, val]) => (
              <div key={label as string} className="rounded-lg bg-muted/40 px-3 py-2">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="text-lg font-semibold tabular-nums">{val ?? 0}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Department Revenue</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.departmentRevenue ?? []}>
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Executive KPI Board</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            {[
              ['GOP', `₹${(kpi.gop ?? 0).toLocaleString('en-IN')}`],
              ['Food Cost', `${kpi.foodCostPct ?? 0}%`],
              ['Payroll', `${kpi.payrollPct ?? 0}%`],
              ['Direct Booking', `${kpi.directBookingPct ?? 0}%`],
              ['OTA Dependency', `${kpi.otaDependencyPct ?? 0}%`],
              ['Repeat Guests', `${kpi.repeatGuestsPct ?? 0}%`],
              ['Corporate Mix', `${kpi.corporateRevenuePct ?? 0}%`],
              ['Banquet Mix', `${kpi.banquetRevenuePct ?? 0}%`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between rounded-md border px-3 py-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium tabular-nums">{val}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {(s.alerts ?? []).length > 0 && (
        <Card className="mt-6 border-border/60">
          <CardHeader><CardTitle className="text-base">Active Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {s.alerts.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{a.category}</span>
                  <span className="text-muted-foreground ml-2">{a.message}</span>
                </div>
                <Badge variant={a.severity === 'critical' ? 'danger' : a.severity === 'warning' ? 'warning' : 'secondary'}>
                  {a.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 border-border/60">
        <CardHeader><CardTitle className="text-base">Data Warehouse Architecture</CardTitle></CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-xs">{BI_DATA_WAREHOUSE_MERMAID}</pre>
        </CardContent>
      </Card>
    </CommandCenterShell>
  );
}
