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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AUTH_ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { asRoute } from '@/lib/navigation';

import { loginSchema, type LoginInput } from '@tungaos/shared/validation';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/app/dashboard';
  const { login, googleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      const result = await login(data);
      if (result.requiresMfa) {
        router.push(`${AUTH_ROUTES.otp}?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
      if (result.requiresEmailVerification) {
        router.push(`${AUTH_ROUTES.verifyEmail}?pending=1`);
        return;
      }
      if (result.requiresHotelSelection) {
        router.push(`${AUTH_ROUTES.chooseHotel}?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
      if (result.requiresRoleSelection) {
        router.push(`${AUTH_ROUTES.chooseRole}?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
      toast.success('Welcome back');
      router.push(asRoute(redirect));
    } catch {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your TungaOS Executive Command Center"
      footer={
        <p className="text-muted-foreground">
          New hotel?{' '}
          <Link href={AUTH_ROUTES.register} className="font-medium text-tunga-navy hover:text-tunga-gold">
            Register your property
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="space-y-2">
          <Label htmlFor="identifier">Email, Username, or Mobile</Label>
          <Input
            id="identifier"
            placeholder="you@hotel.com"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register('identifier')}
          />
        </div>

        <PasswordField
          id="password"
          label="Password"
          error={errors.password?.message}
          {...register('password')}
          value={watch('password') ?? ''}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-input" {...register('rememberMe')} />
            Remember me
          </label>
          <Link href={AUTH_ROUTES.forgotPassword} className="text-tunga-navy hover:text-tunga-gold">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Sign In
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={googleLogin}>
          Continue with Google
        </Button>
      </form>
    </AuthCard>
  );
}
