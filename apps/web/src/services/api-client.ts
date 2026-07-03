// api-client.ts
import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { AUTH_COOKIES, TENANT_HEADER } from '@tungaos/shared/constants';
import type { ApiError, ApiResponse } from '@tungaos/shared/types';
import { env } from '@/lib/env';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/features/auth/hooks/use-auth';


export function createApiClient(): AxiosInstance {

  const client = axios.create({
    baseURL: env.apiUrl,
    timeout: 30_000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // needed for cookies
  });

  client.interceptors.request.use((config) => {
    // 1. Add access token from cookie
    const token = getCookieValue(AUTH_COOKIES.accessToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Add tenant header
    const hotelId = getCookieValue(TENANT_HEADER);
    if (hotelId) {
      config.headers[TENANT_HEADER] = hotelId;
    }
    return config;
  });

  // Response interceptor: handle 401 with refresh token
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // If it's a 401
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get refresh token from cookie
          const refreshToken = getCookieValue(AUTH_COOKIES.refreshToken);
          if (!refreshToken) {
            await logoutUser();
            return Promise.reject(error);
          }

          // Call refresh endpoint
          const { data } = await axios.post<{ data: { accessToken: string } }>(
            `${env.apiUrl}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          const newAccessToken = data.data.accessToken;

          setCookie(AUTH_COOKIES.accessToken, newAccessToken);

          const authStore = useAuthStore.getState();
          if (authStore.user) {
            authStore.setSession(authStore.user, newAccessToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return client(originalRequest);
        } catch (refreshError) {

          await logoutUser();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(normalizeApiError(error));
    }
  );

  return client;
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

async function logoutUser(): Promise<void> {
  const { useAuth } = await import('@/features/auth/hooks/use-auth');
  const{ logout }=useAuth();
  await logout();
}
function setCookie(name: string, value: string): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${name}=${value}; path=/; SameSite=Lax${secure}`;
}


function normalizeApiError(error: AxiosError<ApiError>): ApiError {
  if (error.response?.data) {
    return error.response.data;
  }
  return {
    success: false,
    error: {
      code: 'NETWORK_ERROR',
      message: error.message || 'An unexpected network error occurred',
    },
    timestamp: new Date().toISOString(),
  };
}

export const apiClient = createApiClient();
export type { ApiResponse, ApiError };