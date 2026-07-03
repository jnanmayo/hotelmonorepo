'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { AuthCard } from '@/components/auth/auth-shell';
import { PasswordField } from '@/components/auth/password-field';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AUTH_ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { resetPasswordSchema, type ResetPasswordInput } from '@tungaos/shared/validation';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setError(null);
    try {
      await resetPassword(data.token, data.password);
      toast.success('Password updated successfully');
      router.push(AUTH_ROUTES.login);
    } catch {
      setError('Invalid or expired reset link. Please request a new one.');
    }
  };

  if (!token) {
    return (
      <AuthCard title="Invalid Link" description="This password reset link is invalid or has expired">
        <Alert variant="error" className="mb-4">
          Please request a new password reset link.
        </Alert>
        <Button asChild className="w-full">
          <Link href={AUTH_ROUTES.forgotPassword}>Request New Link</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset Password" description="Create a new secure password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('token')} />
        {error && <Alert variant="error">{error}</Alert>}
        <PasswordField
          id="password"
          label="New Password"
          showStrength
          error={errors.password?.message}
          {...register('password')}
          value={watch('password') ?? ''}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          value={watch('confirmPassword') ?? ''}
        />
        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Update Password
        </Button>
      </form>
    </AuthCard>
  );
}
