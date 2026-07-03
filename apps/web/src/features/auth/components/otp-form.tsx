'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { AuthCard } from '@/components/auth/auth-shell';
import { OtpInput } from '@/components/auth/otp-input';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { asRoute } from '@/lib/navigation';

const RESEND_COOLDOWN = 60;

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/app/dashboard';
  const { verifyOtp, requestOtp } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await verifyOtp(code);
      toast.success('Verification successful');
      router.push(asRoute(redirect));
    } catch {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [code, verifyOtp, router, redirect]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await requestOtp('EMAIL');
      setCooldown(RESEND_COOLDOWN);
      toast.success('New code sent');
    } catch {
      toast.error('Unable to resend code');
    }
  };

  return (
    <AuthCard
      title="Enter Verification Code"
      description="We sent a 6-digit code to your email"
      footer={
        <Link href={AUTH_ROUTES.login} className="text-tunga-navy hover:text-tunga-gold">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}
        <OtpInput value={code} onChange={setCode} error={error ?? undefined} disabled={isSubmitting} />
        <Button className="w-full" size="lg" onClick={handleVerify} isLoading={isSubmitting}>
          Verify
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="font-medium text-tunga-navy hover:text-tunga-gold disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </p>
      </div>
    </AuthCard>
  );
}
