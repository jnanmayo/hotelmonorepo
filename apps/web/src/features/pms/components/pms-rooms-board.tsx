'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { usePmsRealtime } from '@/features/pms/hooks/use-pms-realtime';
import { apiClient } from '@/services/api-client';
import { cn } from '@/lib/utils';

import type { PmsRoom } from '@tungaos/shared';

const STATUS_COLORS: Record<string, string> = {
  VACANT_CLEAN: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  VACANT: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  INSPECTED: 'bg-teal-100 border-teal-300 text-teal-900',
  OCCUPIED: 'bg-blue-100 border-blue-300 text-blue-900',
  RESERVED: 'bg-indigo-100 border-indigo-300 text-indigo-900',
  VACANT_DIRTY: 'bg-amber-100 border-amber-300 text-amber-900',
  DIRTY: 'bg-amber-100 border-amber-300 text-amber-900',
  CLEANING: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  OUT_OF_ORDER: 'bg-red-100 border-red-300 text-red-900',
  UNDER_MAINTENANCE: 'bg-orange-100 border-orange-300 text-orange-900',
  OUT_OF_SERVICE: 'bg-orange-100 border-orange-300 text-orange-900',
  BLOCKED: 'bg-slate-200 border-slate-400 text-slate-800',
};

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

export function PmsRoomsBoard() {
  const [rooms, setRooms] = useState<PmsRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient
      .get<{ data: PmsRoom[] }>(PMS_API.rooms)
      .then((r) => setRooms(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  usePmsRealtime(null, (e) => {
    if (e.type === 'room:status') load();
  });

  const byFloor = rooms.reduce<Record<string, PmsRoom[]>>((acc, room) => {
    const key = `${room.building.code} · Floor ${room.floor.floorNumber}`;
    (acc[key] ??= []).push(room);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 lg:px-8">
      <div>
        <h2 className="text-h2">Room Status Board</h2>
        <p className="mt-1 text-sm text-muted-foreground">Real-time room inventory and housekeeping status</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        Object.entries(byFloor).map(([floor, floorRooms]) => (
          <Card key={floor}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{floor}</CardTitle>
              <CardDescription>{floorRooms.length} rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {floorRooms.map((room) => (
                  <div
                    key={room.id}
                    className={cn(
                      'rounded-lg border p-3 text-center transition-shadow hover:shadow-md',
                      STATUS_COLORS[room.status] ?? 'bg-muted',
                    )}
                  >
                    <div className="text-lg font-bold">{room.roomNumber}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wide opacity-80">
                      {statusLabel(room.status)}
                    </div>
                    <div className="mt-1 truncate text-xs opacity-70">{room.roomType.name}</div>
                    {room.currentGuest && (
                      <div className="mt-1 truncate text-[10px] font-medium">{room.currentGuest}</div>
                    )}
                    {room.isAccessible && (
                      <Badge variant="outline" className="mt-1 text-[9px]">
                        Accessible
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
