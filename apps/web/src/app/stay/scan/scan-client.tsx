'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GXP_STAY_ROUTES } from '@/features/gxp/constants/gxp-navigation';
import { createGuestSession } from '@/features/gxp/services/gxp-api';

export default function StayScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reservationCode, setReservationCode] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) return;

    const token = q.startsWith('TUNGAOS:STAY:') ? q.replace('TUNGAOS:STAY:', '') : q;
    setLoading(true);
    createGuestSession({ qrToken: token })
      .then((session) => router.replace(GXP_STAY_ROUTES.home(session.sessionToken)))
      .catch(() => setError('Invalid or expired QR code. Enter booking details below.'))
      .finally(() => setLoading(false));
  }, [searchParams, router]);

  const manualLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const session = await createGuestSession({ reservationCode, lastName });
      router.push(GXP_STAY_ROUTES.home(session.sessionToken));
    } catch {
      setError('Could not find your stay. Check booking code and last name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-amber-400/20 bg-slate-900/80 p-6 backdrop-blur">
        <p className="text-xs uppercase tracking-widest text-amber-400">TungaOS Guest</p>
        <h1 className="mt-1 text-2xl font-semibold">Digital Concierge</h1>
        <p className="mt-2 text-sm text-white/60">Scan your room QR or enter booking details. No app install required.</p>

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          </div>
        )}

        {!loading && (
          <div className="mt-6 space-y-3">
            <Input
              placeholder="Booking code"
              value={reservationCode}
              onChange={(e) => setReservationCode(e.target.value)}
              className="border-white/20 bg-white/5 text-white"
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border-white/20 bg-white/5 text-white"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400" onClick={manualLogin}>
              Open Guest Portal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
