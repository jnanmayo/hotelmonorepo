'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HK_API, HK_ROUTES } from '@/features/housekeeping/constants/housekeeping-navigation';
import { HousekeepingShell } from '@/features/housekeeping/components/housekeeping-shell';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type { HkChecklistItem, HkTaskItem } from '@tungaos/shared';

interface TaskDetail extends HkTaskItem {
  checklist: HkChecklistItem[];
}

export function HkTaskDetailPage({ taskId }: { taskId: string }) {
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient
      .get<{ data: TaskDetail }>(HK_API.task(taskId))
      .then((r) => setTask(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (status: string) => {
    await apiClient.patch(HK_API.taskStatus(taskId), { status });
    load();
  };

  if (loading) {
    return (
      <HousekeepingShell title="Task Detail">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>
      </HousekeepingShell>
    );
  }

  if (!task) {
    return (
      <HousekeepingShell title="Task Not Found">
        <Button asChild variant="outline"><Link href={asRoute(HK_ROUTES.tasks)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>
      </HousekeepingShell>
    );
  }

  const completed = task.checklist?.filter((c) => c.isCompleted).length ?? 0;
  const total = task.checklist?.length ?? 0;

  return (
    <HousekeepingShell title={`Room ${task.roomNumber}`} description={`${task.taskType.replace(/_/g, ' ')} · ${task.status.replace(/_/g, ' ')}`}>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={asRoute(HK_ROUTES.tasks)}><ArrowLeft className="mr-2 h-4 w-4" /> Tasks</Link>
      </Button>

      <div className="mb-4 flex flex-wrap gap-2">
        {task.status === 'ASSIGNED' && <Button size="sm" onClick={() => updateStatus('ACCEPTED')}>Accept Task</Button>}
        {['ASSIGNED', 'ACCEPTED'].includes(task.status) && <Button size="sm" onClick={() => updateStatus('IN_PROGRESS')}>Start Cleaning</Button>}
        {task.status === 'IN_PROGRESS' && <Button size="sm" onClick={() => updateStatus('COMPLETED')}>Mark Complete</Button>}
        <Badge variant="outline">{task.estimatedMinutes ?? 30} min est.</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cleaning Checklist ({completed}/{total})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(task.checklist ?? []).map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <Check className={`h-4 w-4 ${item.isCompleted ? 'text-emerald-600' : 'text-muted-foreground'}`} />
              <span className={item.isCompleted ? 'line-through opacity-60' : ''}>{item.itemName}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </HousekeepingShell>
  );
}
