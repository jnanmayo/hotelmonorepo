'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

import StayScanPage from './scan-client';

export default function StayScanRoute() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950"><Loader2 className="h-8 w-8 animate-spin text-amber-400" /></div>}>
      <StayScanPage />
    </Suspense>
  );
}
