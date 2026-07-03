'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FRONT_DESK_API } from '@/features/front-desk/api/endpoints';
import { FrontDeskShell } from '@/features/front-desk/components/front-desk-shell';
import { apiClient } from '@/services/api-client';

export function WalkInForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    roomTypeId: '',
    roomId: '',
    checkInDate: new Date().toISOString().split('T')[0]!,
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]!,
    adults: 1,
    roomRate: 5000,
    paymentMethod: 'CASH' as const,
    paymentAmount: 5000,
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post(FRONT_DESK_API.walkIn, form);
      toast.success('Walk-in guest checked in');
    } catch {
      toast.error('Walk-in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FrontDeskShell title="Walk-in Guest" description="Instant reservation, room assignment & payment">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Walk-in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div><Label>First Name</Label><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /></div>
            <div><Label>Last Name</Label><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Room Type ID</Label><Input value={form.roomTypeId} onChange={(e) => setForm({ ...form, roomTypeId: e.target.value })} required placeholder="UUID" /></div>
            <div><Label>Room ID (optional)</Label><Input value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} placeholder="UUID" /></div>
            <div><Label>Check-in</Label><Input type="date" value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} /></div>
            <div><Label>Check-out</Label><Input type="date" value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} /></div>
            <div><Label>Room Rate/night</Label><Input type="number" value={form.roomRate} onChange={(e) => setForm({ ...form, roomRate: Number(e.target.value) })} /></div>
            <div><Label>Advance Payment</Label><Input type="number" value={form.paymentAmount} onChange={(e) => setForm({ ...form, paymentAmount: Number(e.target.value) })} /></div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading} className="w-full">Create Walk-in & Check-in</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FrontDeskShell>
  );
}

export function RoomAssignmentPage() {
  const params = useSearchParams();
  const reservationId = params.get('reservation') ?? '';
  const [suggestions, setSuggestions] = useState<Array<{ id: string; roomNumber: string; score: number; status: string }>>([]);
  const [roomId, setRoomId] = useState('');

  async function loadSuggestions() {
    if (!reservationId) return;
    const r = await apiClient.get<{ data: typeof suggestions }>(FRONT_DESK_API.roomSuggestions(reservationId));
    setSuggestions(r.data.data);
  }

  async function assign() {
    if (!reservationId || !roomId) return;
    await apiClient.post(FRONT_DESK_API.assignRoom, { reservationId, roomId });
    toast.success('Room assigned');
  }

  return (
    <FrontDeskShell title="Room Assignment" description="Auto-suggest best available rooms">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex gap-2">
            <Input placeholder="Reservation ID" value={reservationId} readOnly={!!params.get('reservation')} onChange={() => {}} />
            <Button onClick={loadSuggestions}>Load Suggestions</Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setRoomId(s.id)}
                className={`rounded-lg border p-4 text-left ${roomId === s.id ? 'border-primary bg-primary/5' : ''}`}
              >
                <div className="text-lg font-bold">{s.roomNumber}</div>
                <div className="text-xs text-muted-foreground">Score {s.score} · {s.status}</div>
              </button>
            ))}
          </div>
          <Button onClick={assign} disabled={!roomId}>Assign Selected Room</Button>
        </CardContent>
      </Card>
    </FrontDeskShell>
  );
}
