import { z } from 'zod';

import { emailSchema } from './common.schemas.js';

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(specialCharRegex, 'Must contain a special character');

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email, username, or mobile is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
  captchaToken: z.string().optional(),
});

export const registerHotelSchema = z.object({
  hotelName: z.string().min(2, 'Hotel name is required').max(255),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  country: z.string().default('IN'),
  city: z.string().min(1, 'City is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: emailSchema,
});

export const registerOwnerSchema = z
  .object({
    hotelId: z.string().uuid(),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: emailSchema,
    phone: z.string().min(10, 'Valid phone number required'),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterHotelInput = z.infer<typeof registerHotelSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
