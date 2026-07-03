import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { PageLoader } from '@/components/ui/loader';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
