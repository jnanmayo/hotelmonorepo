import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { PageLoader } from '@/components/ui/loader';
import { ChooseHotelForm } from '@/features/auth/components/choose-hotel-form';

export const metadata = {
  title: 'Select Hotel',
};

export default function ChooseHotelPage() {
  return (
    <AuthShell>
      <Suspense fallback={<PageLoader />}>
        <ChooseHotelForm />
      </Suspense>
    </AuthShell>
  );
}
