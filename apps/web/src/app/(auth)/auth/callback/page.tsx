'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import toast from 'react-hot-toast';

import { AuthShell } from '@/components/auth/auth-shell';
import { PageLoader } from '@/components/ui/loader';
import { AUTH_ROUTES } from '@/constants/routes';

function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error('Google sign-in failed');
      router.replace(AUTH_ROUTES.login);
      return;
    }
    toast.success('Signed in with Google');
    router.replace('/app/dashboard');
  }, [router, searchParams]);

  return <PageLoader label="Completing sign in..." />;
}

export default function OAuthCallbackPage() {
  return (
    <AuthShell>
      <Suspense fallback={<PageLoader />}>
        <OAuthCallbackHandler />
      </Suspense>
    </AuthShell>
  );
}
