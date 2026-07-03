'use client';

import { Suspense } from 'react';

import { FrontDeskCheckOutPage } from '@/features/front-desk/components/folio-and-payments';

export default function CheckOutPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <FrontDeskCheckOutPage />
    </Suspense>
  );
}
