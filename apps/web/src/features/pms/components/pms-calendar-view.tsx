'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { apiClient } from '@/services/api-client';

import type { PmsCalendarDay } from '@tungaos/shared';

function monthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start: start.toISOString().split('T')[0]!,
    end: end.toISOString().split('T')[0]!,
  };
}

export function PmsCalendarView() {
  const [cursor, setCursor] = useState(new Date());
  const [days, setDays] = useState<PmsCalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  useEffect(() => {
    const { start, end } = monthRange(cursor);
    setLoading(true);
    apiClient
      .get<{ data: PmsCalendarDay[] }>(PMS_API.calendar, { params: { start, end, view } })
      .then((r) => setDays(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cursor, view]);

  const monthLabel = cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2">Room Calendar</h2>
          <p className="mt-1 text-sm text-muted-foreground">Availability, occupancy & maintenance views</p>
        </div>
        <div className="flex items-center gap-2">
          {(['monthly', 'weekly', 'daily'] as const).map((v) => (
            <Button key={v} variant={view === v ? 'default' : 'outline'} size="sm" onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setCursor(new Date(cursor.setMonth(cursor.getMonth() - 1)))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">{monthLabel}</h3>
        <Button variant="outline" size="icon" onClick={() => setCursor(new Date(cursor.setMonth(cursor.getMonth() + 1)))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => (
            <Card key={day.date} className={day.occupancyPct >= 90 ? 'border-amber-200' : undefined}>
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm">{day.date.slice(8)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-3 pt-0 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occ.</span>
                  <Badge variant={day.occupancyPct >= 80 ? 'danger' : 'secondary'}>{day.occupancyPct}%</Badge>
                </div>
                <p>Avail: {day.available}</p>
                <p>Res: {day.reservations.length}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
