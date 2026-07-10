'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  registerHotelPropertySchema,
  registerHotelSchema,
  registerOwnerSchema,
  type RegisterHotelInput,
  type RegisterHotelPropertyInput,
  type RegisterOwnerInput,
} from '@tungaos/shared/validation';

type Step = 'hotel' | 'property' | 'owner';

const defaultPropertyValues: RegisterHotelPropertyInput = {
  hotelId: '',
  roomTypes: [{ name: 'Standard', code: 'STD', baseRate: 0, maxOccupancy: 2, maxAdults: 2, maxChildren: 0 }],
  buildings: [
    {
      name: 'Main Building',
      code: 'MAIN',
      floors: [
        {
          name: 'Ground Floor',
          floorNumber: 0,
          rooms: [{ roomNumber: '101', roomTypeCode: 'STD', category: 'STANDARD', isSmoking: false, isAccessible: false }],
        },
      ],
    },
  ],
};

export function RegisterForm() {
  const router = useRouter();
  const { registerHotel, registerHotelProperty, registerOwner } = useAuth();
  const [step, setStep] = useState<Step>('hotel');
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hotelForm = useForm<RegisterHotelInput>({
    resolver: zodResolver(registerHotelSchema),
    defaultValues: { country: 'IN' },
  });

  const propertyForm = useForm<RegisterHotelPropertyInput>({
    resolver: zodResolver(registerHotelPropertySchema),
    defaultValues: defaultPropertyValues,
  });

  const {
    fields: roomTypeFields,
    append: appendRoomType,
    remove: removeRoomType,
  } = useFieldArray({ control: propertyForm.control, name: 'roomTypes' });

  const {
    fields: floorFields,
    append: appendFloor,
    remove: removeFloor,
  } = useFieldArray({ control: propertyForm.control, name: 'buildings.0.floors' });

  const ownerForm = useForm<RegisterOwnerInput>({
    resolver: zodResolver(registerOwnerSchema),
  });

  const onHotelSubmit = async (data: RegisterHotelInput) => {
    setError(null);
    try {
      const result = await registerHotel(data);
      setHotelId(result.hotelId);
      propertyForm.reset({ ...defaultPropertyValues, hotelId: result.hotelId });
      setStep('property');
      toast.success('Hotel registered. Set up your property structure.');
    } catch {
      setError('Unable to register hotel. The slug may already be taken.');
    }
  };

  const onPropertySubmit = async (data: RegisterHotelPropertyInput) => {
    setError(null);
    try {
      await registerHotelProperty(data);
      toast.success('Property structure saved.');
      setStep('owner');
    } catch {
      setError('Unable to save property structure. Check room type codes and room numbers.');
    }
  };

  const onPropertySkip = () => {
    setError(null);
    setStep('owner');
  };

  const onOwnerSubmit = async (data: RegisterOwnerInput) => {
    if (!hotelId) {
      setError('Hotel registration is incomplete. Please start again.');
      return;
    }
    setError(null);
    try {
      await registerOwner({ ...data, hotelId });
      toast.success('Registration complete. Verify your email to continue.');
      router.push(`${AUTH_ROUTES.verifyEmail}?registered=1`);
    } catch {
      setError('Unable to complete registration. Please try again.');
    }
  };

  const roomTypeCodes = propertyForm.watch('roomTypes').map((rt) => rt.code).filter(Boolean);

  const stepTitle =
    step === 'hotel' ? 'Register Your Hotel' : step === 'property' ? 'Property Setup' : 'Create Owner Account';
  const stepDescription =
    step === 'hotel'
      ? 'Step 1 of 3 — Hotel details'
      : step === 'property'
        ? 'Step 2 of 3 — Buildings, floors, room types, and rooms'
        : 'Step 3 of 3 — Owner account';

  return (
    <AuthCard
      title={stepTitle}
      description={stepDescription}
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
      ) : step === 'property' ? (
        <form onSubmit={propertyForm.handleSubmit(onPropertySubmit)} className="space-y-6">
          <input type="hidden" {...propertyForm.register('hotelId')} />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Room Types</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendRoomType({ name: '', code: '', baseRate: 0, maxOccupancy: 2, maxAdults: 2, maxChildren: 0 })}
              >
                Add Type
              </Button>
            </div>
            {roomTypeFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-2 rounded-lg border p-3">
                <Input placeholder="Name" {...propertyForm.register(`roomTypes.${index}.name`)} />
                <Input placeholder="Code" {...propertyForm.register(`roomTypes.${index}.code`)} />
                <Input
                  type="number"
                  placeholder="Base rate"
                  {...propertyForm.register(`roomTypes.${index}.baseRate`, { valueAsNumber: true })}
                />
                <Input
                  type="number"
                  placeholder="Max occupancy"
                  {...propertyForm.register(`roomTypes.${index}.maxOccupancy`, { valueAsNumber: true })}
                />
                {roomTypeFields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="col-span-2" onClick={() => removeRoomType(index)}>
                    Remove type
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Label>Building</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Building name" {...propertyForm.register('buildings.0.name')} />
              <Input placeholder="Building code" {...propertyForm.register('buildings.0.code')} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Floors & Rooms</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendFloor({
                    name: `Floor ${floorFields.length + 1}`,
                    floorNumber: floorFields.length + 1,
                    rooms: [{ roomNumber: '', roomTypeCode: roomTypeCodes[0] ?? '', category: 'STANDARD', isSmoking: false, isAccessible: false }],
                  })
                }
              >
                Add Floor
              </Button>
            </div>
            {floorFields.map((floor, floorIndex) => (
              <div key={floor.id} className="space-y-2 rounded-lg border p-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Floor name" {...propertyForm.register(`buildings.0.floors.${floorIndex}.name`)} />
                  <Input
                    type="number"
                    placeholder="Floor number"
                    {...propertyForm.register(`buildings.0.floors.${floorIndex}.floorNumber`, { valueAsNumber: true })}
                  />
                </div>
                <Input
                  placeholder="Room number"
                  {...propertyForm.register(`buildings.0.floors.${floorIndex}.rooms.0.roomNumber`)}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...propertyForm.register(`buildings.0.floors.${floorIndex}.rooms.0.roomTypeCode`)}
                >
                  {roomTypeCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                {floorFields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFloor(floorIndex)}>
                    Remove floor
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep('hotel')}>
              Back
            </Button>
            <Button type="button" variant="ghost" onClick={onPropertySkip}>
              Skip for now
            </Button>
            <Button type="submit" className="flex-1" size="lg" isLoading={propertyForm.formState.isSubmitting}>
              Continue
            </Button>
          </div>
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
            <Button type="button" variant="outline" onClick={() => setStep('property')}>
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
