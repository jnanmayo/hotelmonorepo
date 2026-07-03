import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { PageLoader } from '@/components/ui/loader';
import { OtpForm } from '@/features/auth/components/otp-form';

export const metadata = {
  title: 'Verification Code',
};

export default function OtpPage() {
  return (
    <AuthShell>
      <Suspense fallback={<PageLoader />}>
        <OtpForm />
      </Suspense>
    </AuthShell>
  );
}
