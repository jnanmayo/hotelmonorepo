import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { PageLoader } from '@/components/ui/loader';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';

export const metadata = {
  title: 'Verify Email',
};

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <Suspense fallback={<PageLoader />}>
        <VerifyEmailForm />
      </Suspense>
    </AuthShell>
  );
}
