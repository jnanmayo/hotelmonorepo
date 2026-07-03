'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { GuestDashboard } from '@/features/gxp/components/guest-dashboard';
import { validateGuestSession } from '@/features/gxp/services/gxp-api';

import type { GxpSessionContext } from '@tungaos/shared';

interface StayHomeClientProps {
  token: string;
}

export default function StayHomeClient({ token }: StayHomeClientProps) {
  const [session, setSession] = useState<GxpSessionContext | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    validateGuestSession(token)
      .then(setSession)
      .catch(() => setError(true));
  }, [token]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>
          Session expired.{' '}
          <a href="/stay/scan" className="text-amber-400 underline">
            Scan QR again
          </a>
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return <GuestDashboard sessionToken={token} session={session} />;
}
