'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import {
  GuestChatPage,
  GuestCheckoutPage,
  GuestConciergePage,
  GuestDiningPage,
  GuestFolioPage,
  GuestRoomPage,
} from '@/features/gxp/components/guest-sections';
import { validateGuestSession } from '@/features/gxp/services/gxp-api';

import type { GxpSessionContext } from '@tungaos/shared';

interface StaySlugClientProps {
  token: string;
  slug: string;
}

const SECTIONS: Record<
  string,
  (props: { sessionToken: string; session: GxpSessionContext }) => React.ReactNode
> = {
  room: (p) => <GuestRoomPage {...p} />,
  dining: (p) => <GuestDiningPage {...p} />,
  concierge: (p) => <GuestConciergePage {...p} />,
  folio: (p) => <GuestFolioPage {...p} />,
  chat: (p) => <GuestChatPage {...p} />,
  checkout: (p) => <GuestCheckoutPage {...p} />,
};

export default function StaySlugClient({ token, slug }: StaySlugClientProps) {
  const [session, setSession] = useState<GxpSessionContext | null>(null);

  const Section = SECTIONS[slug];

  useEffect(() => {
    validateGuestSession(token)
      .then(setSession)
      .catch(() => setSession(null));
  }, [token]);

  if (!Section) {
    notFound();
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return <Section sessionToken={token} session={session} />;
}
