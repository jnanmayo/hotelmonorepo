import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { JwtPayload } from '@tungaos/shared/types';

interface AuthState {
  user: JwtPayload | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (user: JwtPayload, accessToken: string) => void;
  clearSession: () => void;
}

/**
 * Client-side auth state store.
 * Server-side session validation remains authoritative.
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        setSession: (user, accessToken) =>
          set({ user, accessToken, isAuthenticated: true }, false, 'auth/setSession'),
        clearSession: () =>
          set(
            { user: null, accessToken: null, isAuthenticated: false },
            false,
            'auth/clearSession',
          ),
      }),
      {
        name: 'tungaos-auth',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
);
