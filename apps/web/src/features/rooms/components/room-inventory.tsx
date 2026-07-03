'use client';

import { useCallback, useEffect, useState } from 'react';
import { Building2, ChevronRight, Loader2, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROOMS_API } from '@/features/rooms/constants/room-navigation';
import { RoomsShell } from '@/features/rooms/components/rooms-shell';
import { apiClient } from '@/services/api-client';

import type { RoomInventory } from '@tungaos/shared';

export function RoomInventoryPage() {
  const [inventory, setInventory] = useState<RoomInventory | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    apiClient
      .get<{ data: RoomInventory }>(ROOMS_API.inventory)
      .then((r) => setInventory(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <RoomsShell title="Property Structure" description="Hotel → Building → Floor → Room Type → Room">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </RoomsShell>
    );
  }

  const inv = inventory ?? { buildings: [], roomTypes: [], totalRooms: 0 };

  return (
    <RoomsShell title="Property Structure" description="Digital twin hierarchy — buildings, floors, room types, and rooms">
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="secondary">{inv.totalRooms} total rooms</Badge>
        <Button size="sm" variant="outline" disabled>
          <Plus className="mr-1 h-4 w-4" /> Add Building
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Buildings & Floors
            </CardTitle>
            <CardDescription>Physical property hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inv.buildings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No buildings configured. Add your first building via API or setup wizard.</p>
            ) : (
              inv.buildings.map((b) => (
                <div key={b.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-muted-foreground">Code: {b.code}</div>
                    </div>
                    <Badge>{b.floors.length} floors</Badge>
                  </div>
                  <div className="mt-3 space-y-1">
                    {b.floors.map((f) => (
                      <div key={f.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
                        <span>Floor {f.floorNumber} — {f.name}</span>
                        <span className="text-muted-foreground">{f.roomCount ?? 0} rooms</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Room Types & Categories</CardTitle>
            <CardDescription>Standard, Deluxe, Suite, Villa, and custom types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {inv.roomTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No room types defined.</p>
            ) : (
              inv.roomTypes.map((rt) => (
                <div key={rt.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div>
                    <div className="font-medium">{rt.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {rt.bedType ?? '—'} · {rt.viewType ?? '—'} · Max {rt.maxOccupancy} guests
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{rt.baseRate.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{rt.roomCount ?? 0} rooms</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Hotel</span>
            <ChevronRight className="h-4 w-4" />
            <span>Building</span>
            <ChevronRight className="h-4 w-4" />
            <span>Floor</span>
            <ChevronRight className="h-4 w-4" />
            <span>Room Category</span>
            <ChevronRight className="h-4 w-4" />
            <span>Room Type</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-foreground">Individual Room</span>
          </div>
        </CardContent>
      </Card>
    </RoomsShell>
  );
}
