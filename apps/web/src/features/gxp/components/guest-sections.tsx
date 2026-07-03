'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GuestPortalShell } from '@/features/gxp/components/guest-portal-shell';
import { GXP_PUBLIC_API } from '@/features/gxp/constants/gxp-navigation';
import { createGxpClient } from '@/features/gxp/services/gxp-api';

import type {
  GxpChatMessageItem,
  GxpFolioView,
  GxpMenuCategory,
  GxpRequestItem,
  GxpRoomDetails,
  GxpSessionContext,
} from '@tungaos/shared';
import { GXP_CHECKOUT_FLOW_MERMAID, GXP_FOOD_FLOW_MERMAID } from '@tungaos/shared';

function LoadingShell({ sessionToken, session, title }: { sessionToken: string; session: GxpSessionContext; title: string }) {
  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <h1 className="mb-4 text-xl font-semibold">{title}</h1>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-amber-400" /></div>
    </GuestPortalShell>
  );
}

const CONCIERGE_SERVICES = [
  { category: 'ROOM_SERVICE', subType: 'EXTRA_WATER', label: 'Extra Water' },
  { category: 'ROOM_SERVICE', subType: 'EXTRA_PILLOW', label: 'Extra Pillow' },
  { category: 'ROOM_SERVICE', subType: 'EXTRA_BLANKET', label: 'Extra Blanket' },
  { category: 'HOUSEKEEPING', subType: 'CLEAN_ROOM', label: 'Clean Room' },
  { category: 'HOUSEKEEPING', subType: 'FRESH_TOWELS', label: 'Fresh Towels' },
  { category: 'LAUNDRY', subType: 'PICKUP', label: 'Laundry Pickup' },
  { category: 'MAINTENANCE', subType: 'AC_ISSUE', label: 'AC Not Working' },
  { category: 'MAINTENANCE', subType: 'WIFI_ISSUE', label: 'WiFi Problem' },
  { category: 'SPA', subType: 'MASSAGE', label: 'Book Massage' },
  { category: 'TRANSPORT', subType: 'AIRPORT_PICKUP', label: 'Airport Pickup' },
  { category: 'TRANSPORT', subType: 'TAXI', label: 'Book Taxi' },
  { category: 'WAKE_UP', subType: 'WAKE_UP_CALL', label: 'Wake-up Call' },
] as const;

export function GuestRoomPage({ sessionToken, session }: { sessionToken: string; session: GxpSessionContext }) {
  const [room, setRoom] = useState<GxpRoomDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createGxpClient(sessionToken).get<{ data: GxpRoomDetails }>(GXP_PUBLIC_API.room).then((r) => setRoom(r.data.data)).finally(() => setLoading(false));
  }, [sessionToken]);

  if (loading) return <LoadingShell sessionToken={sessionToken} session={session} title="Room Details" />;
  const r = room!;

  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <h1 className="mb-4 text-xl font-semibold">Room {r.roomNumber}</h1>
      <Card className="mb-4 border-white/10 bg-white/5 text-white">
        <CardContent className="space-y-3 pt-4">
          <div><span className="text-white/50">Type</span><p>{r.roomType}</p></div>
          <div><span className="text-white/50">WiFi Password</span><p className="font-mono text-amber-300">{r.wifiPassword}</p></div>
          <div>
            <span className="text-white/50">Amenities</span>
            <div className="mt-1 flex flex-wrap gap-1">{r.amenities.map((a) => <Badge key={a} variant="outline" className="border-white/20">{a}</Badge>)}</div>
          </div>
          <div>
            <span className="text-white/50">Emergency</span>
            {r.emergencyNumbers.map((e) => (
              <div key={e.label} className="flex justify-between text-sm"><span>{e.label}</span><a href={`tel:${e.number}`} className="text-amber-400">{e.number}</a></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </GuestPortalShell>
  );
}

export function GuestDiningPage({ sessionToken, session }: { sessionToken: string; session: GxpSessionContext }) {
  const [menu, setMenu] = useState<GxpMenuCategory[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    createGxpClient(sessionToken).get<{ data: GxpMenuCategory[] }>(GXP_PUBLIC_API.menu).then((r) => setMenu(r.data.data)).finally(() => setLoading(false));
  }, [sessionToken]);

  const placeOrder = async () => {
    const items = Object.entries(cart).filter(([, q]) => q > 0).map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
    if (!items.length) return;
    setSubmitting(true);
    try {
      await createGxpClient(sessionToken).post(GXP_PUBLIC_API.orders, { items });
      setMessage('Order placed! Kitchen is preparing your meal.');
      setCart({});
    } catch {
      setMessage('Could not place order. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingShell sessionToken={sessionToken} session={session} title="Digital Menu" />;

  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <h1 className="mb-2 text-xl font-semibold">Restaurant Menu</h1>
      <p className="mb-4 text-sm text-white/50">Charge to room · Real-time kitchen tracking</p>
      {message && <p className="mb-4 text-sm text-amber-300">{message}</p>}
      {menu.map((cat) => (
        <div key={cat.name} className="mb-6">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-amber-400/80">{cat.name}</h2>
          <div className="space-y-2">
            {cat.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-amber-300">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="border-white/20" onClick={() => setCart((c) => ({ ...c, [item.id]: Math.max(0, (c[item.id] ?? 0) - 1) }))}>−</Button>
                  <span>{cart[item.id] ?? 0}</span>
                  <Button size="sm" className="bg-amber-500 text-slate-950" onClick={() => setCart((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }))}>+</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button className="w-full bg-amber-500 text-slate-950" onClick={placeOrder} disabled={submitting}>Place Order</Button>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-black/30 p-3 text-[10px] text-white/40">{GXP_FOOD_FLOW_MERMAID}</pre>
    </GuestPortalShell>
  );
}

export function GuestConciergePage({ sessionToken, session }: { sessionToken: string; session: GxpSessionContext }) {
  const [requests, setRequests] = useState<GxpRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    createGxpClient(sessionToken).get<{ data: GxpRequestItem[] }>(GXP_PUBLIC_API.requests).then((r) => setRequests(r.data.data)).finally(() => setLoading(false));
  }, [sessionToken]);

  useEffect(() => { load(); }, [load]);

  const submit = async (category: string, subType: string) => {
    await createGxpClient(sessionToken).post(GXP_PUBLIC_API.requests, { category, subType });
    load();
  };

  if (loading) return <LoadingShell sessionToken={sessionToken} session={session} title="Digital Concierge" />;

  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <h1 className="mb-4 text-xl font-semibold">Digital Concierge</h1>
      <div className="mb-6 grid grid-cols-2 gap-2">
        {CONCIERGE_SERVICES.map((s) => (
          <Button key={s.subType} variant="outline" className="h-auto border-white/20 py-3 text-left text-sm text-white" onClick={() => submit(s.category, s.subType)}>
            {s.label}
          </Button>
        ))}
      </div>
      <h2 className="mb-2 text-sm text-white/50">Your Requests</h2>
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-sm">
            <span>{r.subType.replace(/_/g, ' ')}</span>
            <Badge className="bg-amber-500/20 text-amber-200">{r.status}</Badge>
          </div>
        ))}
        {requests.length === 0 && <p className="text-sm text-white/40">No requests yet</p>}
      </div>
    </GuestPortalShell>
  );
}

export function GuestFolioPage({ sessionToken, session }: { sessionToken: string; session: GxpSessionContext }) {
  const [folio, setFolio] = useState<GxpFolioView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createGxpClient(sessionToken).get<{ data: GxpFolioView }>(GXP_PUBLIC_API.folio).then((r) => setFolio(r.data.data)).finally(() => setLoading(false));
  }, [sessionToken]);

  if (loading) return <LoadingShell sessionToken={sessionToken} session={session} title="Your Bill" />;
  const f = folio!;

  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <h1 className="mb-4 text-xl font-semibold">Folio — {f.reservationCode}</h1>
      <div className="space-y-2">
        {f.charges.map((c) => (
          <div key={c.id} className="flex justify-between rounded-lg border border-white/10 p-3 text-sm">
            <div><p>{c.description}</p><p className="text-white/40">{c.category}</p></div>
            <span>₹{c.amount.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-1 rounded-xl bg-black/30 p-4 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{f.subtotal.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>₹{f.taxAmount.toLocaleString('en-IN')}</span></div>
        <div className="flex justify-between font-semibold text-amber-300"><span>Outstanding</span><span>₹{f.outstandingBalance.toLocaleString('en-IN')}</span></div>
      </div>
    </GuestPortalShell>
  );
}

export function GuestChatPage({ sessionToken, session }: { sessionToken: string; session: GxpSessionContext }) {
  const [messages, setMessages] = useState<GxpChatMessageItem[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    createGxpClient(sessionToken).get<{ data: GxpChatMessageItem[] }>(GXP_PUBLIC_API.chat).then((r) => setMessages(r.data.data)).finally(() => setLoading(false));
  }, [sessionToken]);

  useEffect(() => { load(); }, [load]);

  const send = async () => {
    if (!text.trim()) return;
    await createGxpClient(sessionToken).post(GXP_PUBLIC_API.chat, { message: text, department: 'RECEPTION' });
    setText('');
    load();
  };

  if (loading) return <LoadingShell sessionToken={sessionToken} session={session} title="Live Chat" />;

  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <h1 className="mb-4 text-xl font-semibold">Chat with Reception</h1>
      <div className="mb-4 max-h-80 space-y-2 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`rounded-lg p-3 text-sm ${m.senderType === 'GUEST' ? 'ml-8 bg-amber-500/20' : 'mr-8 bg-white/10'}`}>
            <p className="text-xs text-white/40">{m.senderName ?? m.senderType}</p>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="border-white/20 bg-white/5 text-white" />
        <Button onClick={send} className="bg-amber-500 text-slate-950">Send</Button>
      </div>
    </GuestPortalShell>
  );
}

export function GuestCheckoutPage({ sessionToken, session }: { sessionToken: string; session: GxpSessionContext }) {
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(5);
  const [done, setDone] = useState(false);

  const submit = async () => {
    await createGxpClient(sessionToken).post(GXP_PUBLIC_API.checkout, {
      paymentMethod: 'CARD',
      feedback: { overallRating: rating, comments },
    });
    setDone(true);
  };

  return (
    <GuestPortalShell sessionToken={sessionToken} hotelName={session.hotelName}>
      <h1 className="mb-4 text-xl font-semibold">Express Checkout</h1>
      {done ? (
        <p className="text-amber-300">Checkout request submitted. Front desk will confirm shortly.</p>
      ) : (
        <>
          <label className="mb-2 block text-sm text-white/60">Overall Rating</label>
          <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mb-4 border-white/20 bg-white/5 text-white" />
          <Textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Share your experience…" className="mb-4 border-white/20 bg-white/5 text-white" />
          <Button className="w-full bg-amber-500 text-slate-950" onClick={submit}>Request Checkout</Button>
        </>
      )}
      <pre className="mt-4 overflow-x-auto rounded-lg bg-black/30 p-3 text-[10px] text-white/40">{GXP_CHECKOUT_FLOW_MERMAID}</pre>
    </GuestPortalShell>
  );
}
