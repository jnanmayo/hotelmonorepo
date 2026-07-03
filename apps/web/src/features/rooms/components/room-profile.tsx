'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROOMS_API, ROOMS_ROUTES } from '@/features/rooms/constants/room-navigation';
import { RoomsShell } from '@/features/rooms/components/rooms-shell';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type { RoomProfile, RoomTimelineEvent } from '@tungaos/shared';

const EVENT_COLORS: Record<string, string> = {
  STATUS: 'bg-blue-100 text-blue-800',
  BLOCK: 'bg-slate-100 text-slate-800',
  MAINTENANCE: 'bg-orange-100 text-orange-800',
  HOUSEKEEPING: 'bg-yellow-100 text-yellow-800',
  RESERVATION: 'bg-indigo-100 text-indigo-800',
};

export function RoomProfilePage({ roomId }: { roomId: string }) {
  const [profile, setProfile] = useState<RoomProfile | null>(null);
  const [timeline, setTimeline] = useState<RoomTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    Promise.all([
      apiClient.get<{ data: RoomProfile }>(ROOMS_API.profile(roomId)),
      apiClient.get<{ data: RoomTimelineEvent[] }>(ROOMS_API.timeline(roomId)),
    ])
      .then(([p, t]) => {
        setProfile(p.data.data);
        setTimeline(t.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [roomId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <RoomsShell title="Room Profile" description="Loading...">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </RoomsShell>
    );
  }

  if (!profile) {
    return (
      <RoomsShell title="Room Not Found" description="">
        <Button asChild variant="outline">
          <Link href={asRoute(ROOMS_ROUTES.board)}><ArrowLeft className="mr-2 h-4 w-4" /> Back to board</Link>
        </Button>
      </RoomsShell>
    );
  }

  return (
    <RoomsShell title={`Room ${profile.roomNumber}`} description={`${profile.building.name} · Floor ${profile.floor.floorNumber} · ${profile.roomType.name}`}>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={asRoute(ROOMS_ROUTES.board)}><ArrowLeft className="mr-2 h-4 w-4" /> Status Board</Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Room Details</CardTitle>
              <Badge>{profile.status.replace(/_/g, ' ')}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
            <div><span className="text-muted-foreground">Category</span><div className="font-medium">{profile.category}</div></div>
            <div><span className="text-muted-foreground">Bed Type</span><div className="font-medium">{profile.roomType.bedType ?? '—'}</div></div>
            <div><span className="text-muted-foreground">View</span><div className="font-medium">{profile.roomType.viewType ?? '—'}</div></div>
            <div><span className="text-muted-foreground">Max Occupancy</span><div className="font-medium">{profile.roomType.maxOccupancy}</div></div>
            <div><span className="text-muted-foreground">Size</span><div className="font-medium">{profile.roomType.sizeSqm ? `${profile.roomType.sizeSqm} sqm` : '—'}</div></div>
            <div><span className="text-muted-foreground">Base Rate</span><div className="font-medium">₹{profile.roomType.baseRate.toLocaleString()}</div></div>
            <div><span className="text-muted-foreground">Smoking</span><div className="font-medium">{profile.isSmoking ? 'Yes' : 'No'}</div></div>
            <div><span className="text-muted-foreground">Accessible</span><div className="font-medium">{profile.isAccessible ? 'Yes' : 'No'}</div></div>
            {profile.currentGuest && (
              <div className="sm:col-span-2"><span className="text-muted-foreground">Current Guest</span><div className="font-medium">{profile.currentGuest}</div></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Amenities</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.amenities.length === 0 ? (
                <span className="text-sm text-muted-foreground">No amenities linked</span>
              ) : (
                profile.amenities.map((a) => (
                  <Badge key={a.id} variant="secondary">{a.name}</Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" /> Room Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">No timeline events yet.</p>
          ) : (
            <div className="relative space-y-4 border-l-2 border-muted pl-6">
              {timeline.map((event) => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={EVENT_COLORS[event.type] ?? ''}>{event.type}</Badge>
                    <span className="font-medium">{event.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {event.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RoomsShell>
  );
}
