'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HK_API, HK_ROUTES } from '@/features/housekeeping/constants/housekeeping-navigation';
import { HousekeepingShell } from '@/features/housekeeping/components/housekeeping-shell';
import { useHousekeepingRealtime } from '@/features/housekeeping/hooks/use-housekeeping-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { HkTaskItem } from '@tungaos/shared';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-slate-100',
  ASSIGNED: 'bg-blue-100',
  ACCEPTED: 'bg-indigo-100',
  IN_PROGRESS: 'bg-yellow-100',
  PAUSED: 'bg-orange-100',
  COMPLETED: 'bg-teal-100',
  INSPECTED: 'bg-cyan-100',
  APPROVED: 'bg-emerald-100',
  REJECTED: 'bg-red-100',
  REOPENED: 'bg-amber-100',
};

export function HkTasksBoard() {
  const [tasks, setTasks] = useState<HkTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: HkTaskItem[] }>(HK_API.tasks)
      .then((r) => setTasks(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useHousekeepingRealtime(hotelId, () => load());

  const updateStatus = async (id: string, status: string) => {
    await apiClient.patch(HK_API.taskStatus(id), { status });
    load();
  };

  const autoAssign = async (id: string) => {
    await apiClient.post(HK_API.autoAssign(id), {});
    load();
  };

  if (loading) {
    return (
      <HousekeepingShell title="Cleaning Tasks" description="Intelligent task management">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </HousekeepingShell>
    );
  }

  return (
    <HousekeepingShell title="Cleaning Tasks" description="Auto-created on checkout — assign, track, inspect, approve">
      <div className="space-y-3">
        {tasks.map((t) => (
          <Card key={t.id} className={STATUS_COLOR[t.status] ?? ''}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <Link href={asRoute(HK_ROUTES.task(t.id))} className="font-medium hover:underline">
                  Room {t.roomNumber}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {t.buildingName} · F{t.floorNumber} · {t.taskType.replace(/_/g, ' ')}
                </div>
                {t.assignedStaffName && (
                  <div className="text-xs">Assigned: {t.assignedStaffName}</div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{t.status.replace(/_/g, ' ')}</Badge>
                <Badge variant="outline">{t.priority}</Badge>
                {t.status === 'PENDING' && (
                  <Button size="sm" variant="outline" onClick={() => autoAssign(t.id)}>Auto Assign</Button>
                )}
                {t.status === 'ASSIGNED' && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(t.id, 'ACCEPTED')}>Accept</Button>
                )}
                {['ACCEPTED', 'ASSIGNED'].includes(t.status) && (
                  <Button size="sm" onClick={() => updateStatus(t.id, 'IN_PROGRESS')}>Start</Button>
                )}
                {t.status === 'IN_PROGRESS' && (
                  <Button size="sm" onClick={() => updateStatus(t.id, 'COMPLETED')}>Complete</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && <p className="text-sm text-muted-foreground">No cleaning tasks. Tasks are auto-created on guest checkout.</p>}
      </div>
    </HousekeepingShell>
  );
}
