'use client';

import { Bell, CheckCheck, Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet } from '@/components/shell/sheet';
import { useShellStore } from '@/stores/shell.store';

const MOCK_NOTIFICATIONS = [
  { id: '1', category: 'reservations', title: 'New booking #1042', time: '2m ago', read: false },
  { id: '2', category: 'housekeeping', title: 'Room 304 marked dirty', time: '15m ago', read: false },
  { id: '3', category: 'finance', title: 'Payment received ₹12,500', time: '1h ago', read: true },
  { id: '4', category: 'system', title: 'Nightly backup completed', time: '3h ago', read: true },
];

export function NotificationPanel() {
  const open = useShellStore((s) => s.notificationPanelOpen);
  const setOpen = useShellStore((s) => s.setNotificationPanelOpen);
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={setOpen} title="Notifications" side="right">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="secondary">{unread} unread</Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
            <TabsTrigger value="archive" className="flex-1">Archive</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-2">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={`rounded-lg border p-3 transition-colors hover:bg-muted/50 ${!n.read ? 'border-secondary/30 bg-secondary/5' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-caption capitalize">{n.category} · {n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="unread">
            <p className="py-8 text-center text-sm text-muted-foreground">Unread notifications only</p>
          </TabsContent>
          <TabsContent value="archive">
            <p className="py-8 text-center text-sm text-muted-foreground">Archived notifications</p>
          </TabsContent>
        </Tabs>
      </div>
    </Sheet>
  );
}
