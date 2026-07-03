'use client';

import { Suspense } from 'react';

import { RoomAssignmentPage } from '@/features/front-desk/components/walk-in-and-rooms';

export default function RoomAssignmentRoute() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <RoomAssignmentPage />
    </Suspense>
  );
}
