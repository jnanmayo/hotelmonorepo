'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

import {
  registerHotelSchema,
  registerOwnerSchema,
  type RegisterHotelInput,
  type RegisterOwnerInput,
} from '@tungaos/shared/validation';

type Step = 'hotel' | 'owner';

export function RegisterForm() {
  const router = useRouter();
  const { registerHotel, registerOwner } = useAuth();
  const [step, setStep] = useState<Step>('hotel');
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hotelForm = useForm<RegisterHotelInput>({
    resolver: zodResolver(registerHotelSchema),
    defaultValues: { country: 'IN' },
  });

  const ownerForm = useForm<RegisterOwnerInput>({
    resolver: zodResolver(registerOwnerSchema),
  });

  const onHotelSubmit = async (data: RegisterHotelInput) => {
    setError(null);
    try {
      const result = await registerHotel(data);
      setHotelId(result.hotelId);
      setStep('owner');
      toast.success('Hotel registered. Complete owner details.');
    } catch {
      setError('Unable to register hotel. The slug may already be taken.');
    }
  };

  const onOwnerSubmit = async (data: RegisterOwnerInput) => {
    setError(null);
    try {
      await registerOwner({ ...data, ...(hotelId ? {} : {}) });
      toast.success('Registration complete. Verify your email to continue.');
      router.push(`${AUTH_ROUTES.verifyEmail}?registered=1`);
    } catch {
      setError('Unable to complete registration. Please try again.');
    }
  };

  return (
    <AuthCard
      title={step === 'hotel' ? 'Register Your Hotel' : 'Create Owner Account'}
      description={
        step === 'hotel'
          ? 'Step 1 of 2 — Hotel details'
          : 'Step 2 of 2 — Owner account'
      }
      footer={
        <p className="text-muted-foreground">
          Already registered?{' '}
          <Link href={AUTH_ROUTES.login} className="font-medium text-tunga-navy hover:text-tunga-gold">
            Sign in
          </Link>
        </p>
      }
    >
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {step === 'hotel' ? (
        <form onSubmit={hotelForm.handleSubmit(onHotelSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelName">Hotel Name</Label>
            <Input
              id="hotelName"
              placeholder="Tunga International"
              error={hotelForm.formState.errors.hotelName?.message}
              {...hotelForm.register('hotelName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              placeholder="tunga-international"
              error={hotelForm.formState.errors.slug?.message}
              {...hotelForm.register('slug')}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" error={hotelForm.formState.errors.city?.message} {...hotelForm.register('city')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" error={hotelForm.formState.errors.phone?.message} {...hotelForm.register('phone')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Hotel Email</Label>
            <Input
              id="email"
              type="email"
              error={hotelForm.formState.errors.email?.message}
              {...hotelForm.register('email')}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" isLoading={hotelForm.formState.isSubmitting}>
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={ownerForm.handleSubmit(onOwnerSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                error={ownerForm.formState.errors.firstName?.message}
                {...ownerForm.register('firstName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                error={ownerForm.formState.errors.lastName?.message}
                {...ownerForm.register('lastName')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Email</Label>
            <Input
              id="ownerEmail"
              type="email"
              error={ownerForm.formState.errors.email?.message}
              {...ownerForm.register('email')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Mobile</Label>
            <Input
              id="ownerPhone"
              error={ownerForm.formState.errors.phone?.message}
              {...ownerForm.register('phone')}
            />
          </div>
          <PasswordField
            id="password"
            label="Password"
            showStrength
            error={ownerForm.formState.errors.password?.message}
            {...ownerForm.register('password')}
            value={ownerForm.watch('password') ?? ''}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm Password"
            error={ownerForm.formState.errors.confirmPassword?.message}
            {...ownerForm.register('confirmPassword')}
            value={ownerForm.watch('confirmPassword') ?? ''}
          />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 rounded" {...ownerForm.register('acceptTerms')} />
            <span>I accept the Terms of Service and Privacy Policy</span>
          </label>
          {ownerForm.formState.errors.acceptTerms && (
            <p className="text-xs text-destructive">{ownerForm.formState.errors.acceptTerms.message}</p>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep('hotel')}>
              Back
            </Button>
            <Button type="submit" className="flex-1" size="lg" isLoading={ownerForm.formState.isSubmitting}>
              Complete Registration
            </Button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
