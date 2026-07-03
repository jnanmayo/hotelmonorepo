'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ClipboardList,
  DollarSign,
  Loader2,
  PartyPopper,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventsShell } from '@/features/events/components/events-shell';
import { EVENTS_API, EVENTS_ROUTES } from '@/features/events/constants/events-navigation';
import { useEventsRealtime } from '@/features/events/hooks/use-events-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { EventsDashboardStats } from '@tungaos/shared';
import { EVENT_SALES_WORKFLOW_MERMAID, EVENT_TIMELINE_MERMAID } from '@tungaos/shared';

function Kpi({
  title,
  value,
  icon: Icon,
  suffix,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  suffix?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {value}
          {suffix ?? ''}
        </div>
      </CardContent>
    </Card>
  );
}

export function EventsDashboard() {
  const [stats, setStats] = useState<EventsDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: EventsDashboardStats }>(EVENTS_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useEventsRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient
      .post(EVENTS_API.seed)
      .then(() => load())
      .finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <EventsShell
        title="Events"
        description="Enterprise Banquet, Wedding & Event Management — TungaOS"
      >
        <div className="flex justify-center py-16">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </EventsShell>
    );
  }

  const s = stats ?? ({} as EventsDashboardStats);
  const needsSetup = (s.confirmedBookings ?? 0) === 0 && (s.activeLeads ?? 0) === 0;

  return (
    <EventsShell
      title="Event Executive Dashboard"
      description="Sales pipeline, bookings, revenue, and hall occupancy"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm">
          <Link href={asRoute(EVENTS_ROUTES.leads)}>Event Leads</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={asRoute(EVENTS_ROUTES.calendar)}>Venue Calendar</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={asRoute(EVENTS_ROUTES.quotations)}>Quotations</Link>
        </Button>
        {needsSetup && (
          <Button size="sm" variant="secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Initializing…' : 'Initialize Event Platform'}
          </Button>
        )}
        <Badge variant="secondary" className="self-center">
          Live
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Today's Events" value={s.todaysEvents ?? 0} icon={Calendar} />
        <Kpi title="Upcoming Events" value={s.upcomingEvents ?? 0} icon={Calendar} />
        <Kpi title="Active Leads" value={s.activeLeads ?? 0} icon={Users} />
        <Kpi title="Confirmed Bookings" value={s.confirmedBookings ?? 0} icon={ClipboardList} />
        <Kpi title="Pending Quotations" value={s.pendingQuotations ?? 0} icon={ClipboardList} />
        <Kpi title="Pending Payments" value={s.pendingPayments ?? 0} icon={DollarSign} />
        <Kpi
          title="Today's Revenue"
          value={`₹${(s.todaysRevenue ?? 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <Kpi
          title="Monthly Revenue"
          value={`₹${(s.monthlyRevenue ?? 0).toLocaleString('en-IN')}`}
          icon={TrendingUp}
        />
        <Kpi title="Hall Occupancy" value={s.hallOccupancyPct ?? 0} icon={PartyPopper} suffix="%" />
        <Kpi
          title="Wedding Revenue"
          value={`₹${(s.weddingRevenue ?? 0).toLocaleString('en-IN')}`}
          icon={PartyPopper}
        />
        <Kpi
          title="Corporate Revenue"
          value={`₹${(s.corporateRevenue ?? 0).toLocaleString('en-IN')}`}
          icon={TrendingUp}
        />
        <Kpi
          title="Lead Conversion"
          value={s.leadConversionPct ?? 0}
          icon={TrendingUp}
          suffix="%"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event Sales Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
              {EVENT_SALES_WORKFLOW_MERMAID}
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {(s.upcomingList ?? []).length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No upcoming events. Create leads and quotations to begin.
              </p>
            ) : (
              <div className="space-y-2">
                {(s.upcomingList ?? []).map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-muted-foreground">
                        {e.eventType} · {e.hallName ?? 'TBD'}
                      </div>
                    </div>
                    <Badge variant="outline">{e.status.replace(/_/g, ' ')}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Event Lifecycle Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
            {EVENT_TIMELINE_MERMAID}
          </pre>
        </CardContent>
      </Card>
    </EventsShell>
  );
}
