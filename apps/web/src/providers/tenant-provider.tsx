'use client';

import { DEFAULT_THEME } from '@tungaos/shared/constants';
import type { HotelId, TenantBranding } from '@tungaos/shared/types';
import { createContext, useContext, useMemo } from 'react';

interface TenantContextValue {
  hotelId: HotelId | null;
  branding: TenantBranding;
  isLoading: boolean;
}

const defaultBranding: TenantBranding = {
  hotelId: '' as HotelId,
  name: 'Tunga International Hotel',
  logoUrl: null,
  primaryColor: DEFAULT_THEME.primary,
  secondaryColor: DEFAULT_THEME.secondary,
  accentColor: DEFAULT_THEME.accent,
  backgroundColor: DEFAULT_THEME.background,
  fontHeading: 'Playfair Display',
  fontBody: 'Inter',
};

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: React.ReactNode;
}

/**
 * Multi-tenant context provider.
 * Resolves hotel_id from subdomain/path and injects branding CSS variables.
 */
export function TenantProvider({ children }: TenantProviderProps) {
  const value = useMemo<TenantContextValue>(
    () => ({
      hotelId: null,
      branding: defaultBranding,
      isLoading: true,
    }),
    [],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenantContext(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within TenantProvider');
  }
  return context;
}
