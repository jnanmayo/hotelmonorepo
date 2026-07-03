'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PMS_API } from '@/features/pms/api/endpoints';
import { apiClient } from '@/services/api-client';

const STEPS = [
  'RESERVATION',
  'GUEST_VERIFICATION',
  'DOCUMENT_UPLOAD',
  'DIGITAL_SIGNATURE',
  'PAYMENT_VERIFICATION',
  'ROOM_ASSIGNMENT',
  'KEY_CARD_ISSUE',
  'COMPLETE',
] as const;

export function PmsCheckInWorkflow() {
  const [reservationId, setReservationId] = useState('');
  const [workflow, setWorkflow] = useState<{
    currentStep: string;
    reservation: { reservationCode: string; guest: { firstName: string; lastName: string } };
  } | null>(null);
  const [roomId, setRoomId] = useState('');
  const [keyCard, setKeyCard] = useState('');
  const [loading, setLoading] = useState(false);

  async function start() {
    if (!reservationId) return;
    setLoading(true);
    try {
      const r = await apiClient.post<{ data: typeof workflow }>(PMS_API.checkInStart(reservationId));
      setWorkflow(r.data.data);
      toast.success('Check-in started');
    } catch {
      toast.error('Failed to start check-in');
    } finally {
      setLoading(false);
    }
  }

  async function advance(step: (typeof STEPS)[number]) {
    if (!reservationId) return;
    setLoading(true);
    try {
      const r = await apiClient.post<{ data: typeof workflow }>(PMS_API.checkInStep(reservationId), {
        step,
        ...(step === 'ROOM_ASSIGNMENT' && roomId ? { roomId } : {}),
        ...(step === 'KEY_CARD_ISSUE' && keyCard ? { keyCardNumber: keyCard } : {}),
      });
      setWorkflow(r.data.data);
      if (step === 'COMPLETE') toast.success('Check-in complete');
    } catch {
      toast.error('Step failed');
    } finally {
      setLoading(false);
    }
  }

  const currentIdx = workflow ? STEPS.indexOf(workflow.currentStep as (typeof STEPS)[number]) : -1;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 lg:px-8">
      <div>
        <h2 className="text-h2">Digital Check-in</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Guest verification → documents → signature → payment → room → key card
        </p>
      </div>

      {!workflow ? (
        <Card>
          <CardHeader>
            <CardTitle>Start Check-in</CardTitle>
            <CardDescription>Enter reservation ID or scan booking QR</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Input
              placeholder="Reservation ID"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
            />
            <Button onClick={start} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {workflow.reservation.reservationCode} — {workflow.reservation.guest.firstName}{' '}
                {workflow.reservation.guest.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm">
                    <CheckCircle2
                      className={`h-5 w-5 ${i <= currentIdx ? 'text-emerald-600' : 'text-muted-foreground/40'}`}
                    />
                    <span className={i === currentIdx ? 'font-medium' : 'text-muted-foreground'}>
                      {step.replace(/_/g, ' ')}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {workflow.currentStep === 'ROOM_ASSIGNMENT' && (
            <div className="space-y-2">
              <Label>Room ID</Label>
              <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Assign room UUID" />
            </div>
          )}

          {workflow.currentStep === 'KEY_CARD_ISSUE' && (
            <div className="space-y-2">
              <Label>Key Card Number</Label>
              <Input value={keyCard} onChange={(e) => setKeyCard(e.target.value)} />
            </div>
          )}

          {currentIdx < STEPS.length - 1 && (
            <Button
              onClick={() => advance(STEPS[currentIdx + 1]!)}
              disabled={loading}
              className="w-full"
            >
              Continue: {STEPS[currentIdx + 1]!.replace(/_/g, ' ')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
