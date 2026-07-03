'use client';

import { createContext, useContext, useMemo } from 'react';

import type { JwtPayload, TenantBranding } from '@tungaos/shared/types';

interface AuthContextValue {
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication context provider.
 * Session hydration and token refresh logic implemented in auth module.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export type { TenantBranding };
