import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { PageLoader } from '@/components/ui/loader';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Sign In',
};

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<PageLoader />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
