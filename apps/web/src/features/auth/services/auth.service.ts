import { AUTH_COOKIES } from '@tungaos/shared/constants';

import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterHotelInput,
  RegisterHotelPropertyInput,
  RegisterOwnerInput,
} from '@tungaos/shared/validation';
import type { AuthUser, LoginResponse } from '@tungaos/shared/types';

function setAuthCookies(accessToken: string, refreshToken: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${AUTH_COOKIES.accessToken}=${accessToken}; path=/; SameSite=Lax${secure}`;
  document.cookie = `${AUTH_COOKIES.refreshToken}=${refreshToken}; path=/; SameSite=Lax${secure}`;
}

function clearAuthCookies(): void {
  document.cookie = `${AUTH_COOKIES.accessToken}=; path=/; max-age=0`;
  document.cookie = `${AUTH_COOKIES.refreshToken}=; path=/; max-age=0`;
}

export const authService = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', data);
    const result = response.data.data;
    console.log(result);
    if (result.tokens) {
      setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken);
      useAuthStore.getState().setSession(
        {
          sub: result.user.id,
          email: result.user.email,
          hotelId: result.user.hotelId,
          roles: result.user.roles,
          permissions: result.user.permissions,
          iat: 0,
          exp: 0,
        },
        result.tokens.accessToken,
      );
    }

    return result;
  },

  async logout(): Promise<void> {
    try {
      // await apiClient.post('/auth/logout');
      console.log(useAuthStore);
    } finally {
      clearAuthCookies();
      useAuthStore.getState().clearSession();
    }
  },

  async logoutAll(): Promise<void> {
    try {
      await apiClient.post('/auth/logout-all');
    } finally {
      clearAuthCookies();
      useAuthStore.getState().clearSession();
    }
  },

  async refreshToken(): Promise<string | null> {
    const response = await apiClient.post<{ data: { accessToken: string } }>('/auth/refresh');
    const accessToken = response.data.data.accessToken;
    const user = useAuthStore.getState().user;
    if (user) {
      useAuthStore.getState().setSession(user, accessToken);
      setAuthCookies(accessToken, '');
    }
    return accessToken;
  },

  async requestOtp(channel: 'EMAIL' | 'SMS' | 'WHATSAPP'): Promise<void> {
    await apiClient.post('/auth/otp/send', { channel });
  },

  async verifyOtp(code: string): Promise<LoginResponse> {
    const response = await apiClient.post<{ data: LoginResponse }>('/auth/otp/verify', { code });
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    const payload: ForgotPasswordInput = { email };
    await apiClient.post('/auth/forgot-password', payload);
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password, confirmPassword: password });
  },

  async verifyEmail(token: string): Promise<AuthUser> {
    const response = await apiClient.post<{ data: AuthUser }>('/auth/verify-email', { token });
    return response.data.data;
  },

  async registerHotel(data: RegisterHotelInput): Promise<{ hotelId: string }> {
    const response = await apiClient.post<{ data: { hotelId: string } }>(
      '/auth/register/hotel',
      data,
    );
    return response.data.data;
  },

  async registerHotelProperty(data: RegisterHotelPropertyInput): Promise<{ hotelId: string }> {
    const response = await apiClient.post<{ data: { hotelId: string } }>(
      '/auth/register/property',
      data,
    );
    return response.data.data;
  },

  async registerOwner(data: RegisterOwnerInput): Promise<{ userId: string }> {
    console.log('cs');
    const response = await apiClient.post<{ data: { userId: string } }>(
      '/auth/register/owner',
      data,
    );
    return response.data.data;
  },

  googleLogin(): void {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
    window.location.href = `${apiUrl}/auth/google`;
  },
};
