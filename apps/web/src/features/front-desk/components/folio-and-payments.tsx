'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FRONT_DESK_API } from '@/features/front-desk/api/endpoints';
import { FrontDeskShell } from '@/features/front-desk/components/front-desk-shell';
import { apiClient } from '@/services/api-client';

import type { GuestFolioView } from '@tungaos/shared';

export function GuestFolioPage({ reservationId }: { reservationId: string }) {
  const [folio, setFolio] = useState<GuestFolioView | null>(null);

  useEffect(() => {
    apiClient.get<{ data: GuestFolioView }>(FRONT_DESK_API.folio(reservationId)).then((r) => setFolio(r.data.data)).catch(() => {});
  }, [reservationId]);

  if (!folio) return <FrontDeskShell title="Guest Folio"><p className="text-muted-foreground">Loading...</p></FrontDeskShell>;

  return (
    <FrontDeskShell title="Guest Folio" description={`${folio.reservationCode} — ${folio.guestName}`}>
      <Card>
        <CardHeader><CardTitle>Room {folio.roomNumber ?? 'Unassigned'}</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th className="pb-2">Charge</th><th className="pb-2 text-right">Amount</th></tr></thead>
            <tbody>
              {folio.charges.map((c) => (
                <tr key={c.id} className="border-b"><td className="py-2">{c.description} ({c.category})</td><td className="py-2 text-right">₹{c.amount.toLocaleString('en-IN')}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 space-y-1 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><span>₹{folio.subtotal.toLocaleString('en-IN')}</span></p>
            <p className="flex justify-between"><span>Tax</span><span>₹{folio.taxAmount.toLocaleString('en-IN')}</span></p>
            <p className="flex justify-between font-semibold"><span>Outstanding</span><span>₹{folio.outstandingBalance.toLocaleString('en-IN')}</span></p>
          </div>
        </CardContent>
      </Card>
    </FrontDeskShell>
  );
}

export function PaymentCollectionPage() {
  const [reservationId, setReservationId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('CASH');

  async function collect() {
    await apiClient.post(FRONT_DESK_API.payments, {
      reservationId,
      amount: Number(amount),
      method,
      paymentType: 'BALANCE',
    });
    toast.success('Payment collected');
  }

  return (
    <FrontDeskShell title="Payment Collection" description="Advance, balance, deposit, refund & split payments">
      <Card className="max-w-md">
        <CardContent className="space-y-4 pt-6">
          <div><Label>Reservation ID</Label><Input value={reservationId} onChange={(e) => setReservationId(e.target.value)} /></div>
          <div><Label>Amount</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div>
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['CASH', 'CREDIT_CARD', 'UPI', 'CORPORATE_CREDIT'].map((m) => (
                  <SelectItem key={m} value={m}>{m.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={collect} className="w-full">Collect Payment</Button>
        </CardContent>
      </Card>
    </FrontDeskShell>
  );
}

export function FrontDeskCheckOutPage() {
  const params = useSearchParams();
  const [reservationId, setReservationId] = useState(params.get('reservation') ?? '');

  async function complete() {
    await apiClient.post(FRONT_DESK_API.checkOutComplete(reservationId), {
      paymentMethod: 'CASH',
      paymentAmount: 0,
      feedbackRating: 5,
    });
    toast.success('Checkout complete');
  }

  return (
    <FrontDeskShell title="Checkout" description="Complete departure, invoice & feedback">
      <Card className="max-w-md">
        <CardContent className="space-y-4 pt-6">
          <div><Label>Reservation ID</Label><Input value={reservationId} onChange={(e) => setReservationId(e.target.value)} /></div>
          <Button onClick={complete} className="w-full">Complete Checkout</Button>
        </CardContent>
      </Card>
    </FrontDeskShell>
  );
}
