'use client';

import { authService } from '@/features/auth/services/auth.service';

import type { LoginInput } from '@tungaos/shared/validation';

export function useAuth() {
  return {
    login: (data: LoginInput) => authService.login(data),
    logout: () => authService.logout(),
    logoutAll: () => authService.logoutAll(),
    refreshToken: () => authService.refreshToken(),
    requestOtp: (channel: 'EMAIL' | 'SMS' | 'WHATSAPP') => authService.requestOtp(channel),
    verifyOtp: (code: string) => authService.verifyOtp(code),
    forgotPassword: (email: string) => authService.forgotPassword(email),
    resetPassword: (token: string, password: string) => authService.resetPassword(token, password),
    verifyEmail: (token: string) => authService.verifyEmail(token),
    registerHotel: authService.registerHotel,
    registerOwner: authService.registerOwner,
    googleLogin: () => authService.googleLogin(),
  };
}
