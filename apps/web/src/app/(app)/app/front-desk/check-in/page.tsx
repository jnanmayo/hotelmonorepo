'use client';

import { PmsCheckInWorkflow } from '@/features/pms/components/pms-checkin-workflow';
import { FrontDeskNav } from '@/features/front-desk/components/front-desk-shell';

export default function CheckInPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <FrontDeskNav />
      <PmsCheckInWorkflow />
    </div>
  );
}
