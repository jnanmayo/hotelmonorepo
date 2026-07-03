'use client';

import { Calendar, Clock, Pin, StickyNote } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet } from '@/components/shell/sheet';
import { useShellStore } from '@/stores/shell.store';

const PANEL_TITLES = {
  activity: 'Recent Activity',
  notifications: 'Notifications',
  tasks: 'Tasks',
  calendar: 'Calendar',
  notes: 'Quick Notes',
  pinned: 'Pinned Items',
};

export function RightDrawer() {
  const open = useShellStore((s) => s.rightDrawerOpen);
  const panel = useShellStore((s) => s.rightDrawerPanel);
  const setOpen = useShellStore((s) => s.setRightDrawerOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen} title={PANEL_TITLES[panel]} side="right">
      <div className="p-4">
        <Tabs defaultValue={panel}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="mt-4 space-y-3">
            {['Check-in Room 501', 'Invoice #882 approved', 'Housekeeping task completed'].map((t) => (
              <div key={t} className="flex gap-2 rounded-md border p-3 text-sm">
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                {t}
              </div>
            ))}
          </TabsContent>
          <TabsContent value="tasks" className="mt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Pin className="h-4 w-4" /> No pending tasks
            </p>
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> Calendar widget placeholder
            </p>
          </TabsContent>
        </Tabs>
        <div className="mt-6 rounded-lg border border-dashed p-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <StickyNote className="h-4 w-4" /> Quick notes — module integration pending
          </p>
        </div>
      </div>
    </Sheet>
  );
}
