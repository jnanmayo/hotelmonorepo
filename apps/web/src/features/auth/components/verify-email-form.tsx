'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AuthCard } from '@/components/auth/auth-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loader';
import { AUTH_ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isPending = searchParams.get('pending') === '1' || searchParams.get('registered') === '1';
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>(
    token ? 'loading' : isPending ? 'pending' : 'error',
  );

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => {
        setStatus('success');
        toast.success('Email verified');
        setTimeout(() => router.push(AUTH_ROUTES.login), 2000);
      })
      .catch(() => setStatus('error'));
  }, [token, verifyEmail, router]);

  if (status === 'loading') {
    return (
      <AuthCard title="Verifying Email" description="Please wait...">
        <PageLoader />
      </AuthCard>
    );
  }

  if (status === 'success') {
    return (
      <AuthCard title="Email Verified" description="Your account is now active">
        <Alert variant="success">Redirecting to sign in...</Alert>
      </AuthCard>
    );
  }

  if (status === 'pending') {
    return (
      <AuthCard
        title="Check Your Email"
        description="We sent a verification link to your inbox"
        footer={
          <Link href={AUTH_ROUTES.login} className="text-tunga-navy hover:text-tunga-gold">
            Back to sign in
          </Link>
        }
      >
        <Alert variant="info">
          Click the link in your email to verify your account. The link expires in 24 hours.
        </Alert>
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link href={AUTH_ROUTES.login}>I&apos;ve verified my email</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Verification Failed" description="This link is invalid or has expired">
      <Alert variant="error" className="mb-4">
        Please sign in and request a new verification email.
      </Alert>
      <Button asChild className="w-full">
        <Link href={AUTH_ROUTES.login}>Sign In</Link>
      </Button>
    </AuthCard>
  );
}
