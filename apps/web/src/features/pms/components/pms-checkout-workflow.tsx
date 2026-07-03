'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PMS_API } from '@/features/pms/api/endpoints';
import { apiClient } from '@/services/api-client';

import type { CheckOutWorkflow } from '@tungaos/shared';

export function PmsCheckOutWorkflow() {
  const [reservationId, setReservationId] = useState('');
  const [workflow, setWorkflow] = useState<CheckOutWorkflow | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [rating, setRating] = useState('5');

  async function load() {
    if (!reservationId) return;
    setLoading(true);
    try {
      const r = await apiClient.get<{ data: CheckOutWorkflow }>(PMS_API.checkOut(reservationId));
      setWorkflow(r.data.data);
    } catch {
      toast.error('Could not load checkout folio');
    } finally {
      setLoading(false);
    }
  }

  async function complete() {
    if (!workflow) return;
    const total = workflow.checkOutRecord?.totalAmount ?? workflow.reservation.balanceAmount;
    setLoading(true);
    try {
      await apiClient.post(PMS_API.checkOutComplete(reservationId), {
        paymentMethod,
        paymentAmount: total,
        feedbackRating: Number(rating),
      });
      toast.success('Checkout complete — invoice generated');
      setWorkflow(null);
      setReservationId('');
    } catch {
      toast.error('Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  const folioTotal =
    workflow?.folioCharges.reduce((s, c) => s + c.totalAmount, 0) ?? workflow?.reservation.balanceAmount ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 lg:px-8">
      <div>
        <h2 className="text-h2">Checkout & Invoice</h2>
        <p className="mt-1 text-sm text-muted-foreground">Room, F&B, laundry, spa, taxes, payment & GST invoice</p>
      </div>

      {!workflow ? (
        <Card>
          <CardHeader>
            <CardTitle>Load Folio</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Input value={reservationId} onChange={(e) => setReservationId(e.target.value)} placeholder="Reservation ID" />
            <Button onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{workflow.reservation.reservationCode}</CardTitle>
              <CardDescription>
                {workflow.reservation.guest.firstName} {workflow.reservation.guest.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {workflow.folioCharges.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2">
                        {c.description}
                        <span className="ml-2 text-xs text-muted-foreground">({c.category})</span>
                      </td>
                      <td className="py-2 text-right">₹{c.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="pt-3">Total</td>
                    <td className="pt-3 text-right">₹{folioTotal.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['CASH', 'CREDIT_CARD', 'UPI', 'CORPORATE_CREDIT'].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Feedback (1-5)</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={complete} disabled={loading} className="w-full">
            Complete Checkout & Generate GST Invoice
          </Button>
        </>
      )}
    </div>
  );
}
