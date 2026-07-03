'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROOMS_API, ROOMS_ROUTES } from '@/features/rooms/constants/room-navigation';
import { RoomsShell } from '@/features/rooms/components/rooms-shell';
import { useRoomsRealtime } from '@/features/rooms/hooks/use-rooms-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

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

const STATUS_OPTIONS = [
  'VACANT_CLEAN', 'VACANT_DIRTY', 'INSPECTED', 'CLEANING', 'DIRTY',
  'OUT_OF_ORDER', 'UNDER_MAINTENANCE', 'BLOCKED',
] as const;

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

export function RoomBoard() {
  const [rooms, setRooms] = useState<PmsRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
    apiClient
      .get<{ data: PmsRoom[] }>(`${ROOMS_API.list}${params}`)
      .then((r) => setRooms(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useRoomsRealtime(hotelId, (e) => {
    if (e.type === 'room:status') load();
  });

  const updateStatus = async (roomId: string, status: string) => {
    await apiClient.patch(ROOMS_API.status(roomId), { status });
    load();
  };

  const byFloor = rooms.reduce<Record<string, PmsRoom[]>>((acc, room) => {
    const key = `${room.building.code} · Floor ${room.floor.floorNumber}`;
    (acc[key] ??= []).push(room);
    return acc;
  }, {});

  return (
    <RoomsShell title="Room Status Board" description="Real-time room inventory — click a room for profile">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{rooms.length} rooms</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        Object.entries(byFloor).map(([floor, floorRooms]) => (
          <Card key={floor} className="mb-4">
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
                      'group rounded-lg border p-3 text-center transition-shadow hover:shadow-md',
                      STATUS_COLORS[room.status] ?? 'bg-muted',
                    )}
                  >
                    <Link href={asRoute(ROOMS_ROUTES.profile(room.id))} className="block">
                      <div className="text-lg font-bold group-hover:underline">{room.roomNumber}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-wide opacity-80">
                        {statusLabel(room.status)}
                      </div>
                      <div className="mt-1 truncate text-xs opacity-70">{room.roomType.name}</div>
                      {room.currentGuest && (
                        <div className="mt-1 truncate text-[10px] font-medium">{room.currentGuest}</div>
                      )}
                    </Link>
                    {room.isAccessible && (
                      <Badge variant="outline" className="mt-1 text-[9px]">Accessible</Badge>
                    )}
                    <div className="mt-2 flex flex-wrap justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {room.status !== 'VACANT_CLEAN' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1 text-[9px]"
                          onClick={() => updateStatus(room.id, 'VACANT_CLEAN')}
                        >
                          Clean
                        </Button>
                      )}
                      {room.status !== 'OUT_OF_ORDER' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1 text-[9px]"
                          onClick={() => updateStatus(room.id, 'OUT_OF_ORDER')}
                        >
                          OOO
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </RoomsShell>
  );
}
