'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { AuthCard } from '@/components/auth/auth-shell';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AUTH_ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { forgotPasswordSchema, type ForgotPasswordInput } from '@tungaos/shared/validation';

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      await forgotPassword(data.email);
      setSent(true);
      toast.success('Reset instructions sent');
    } catch {
      setError('Unable to process request. Please try again.');
    }
  };

  return (
    <AuthCard
      title="Forgot Password"
      description="We'll send a verification code to your email"
      footer={
        <Link href={AUTH_ROUTES.login} className="font-medium text-tunga-navy hover:text-tunga-gold">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <Alert variant="success">
          If an account exists with that email, you will receive password reset instructions shortly.
          Check your inbox and follow the link to reset your password.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@hotel.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
