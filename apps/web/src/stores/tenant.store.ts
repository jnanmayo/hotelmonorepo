import { create } from 'zustand';

import type { HotelId, TenantBranding } from '@tungaos/shared/types';
import { DEFAULT_THEME } from '@tungaos/shared/constants';

interface TenantState {
  hotelId: HotelId | null;
  slug: string | null;
  branding: TenantBranding;
  setTenant: (hotelId: HotelId, slug: string, branding: TenantBranding) => void;
  clearTenant: () => void;
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

/**
 * Tenant resolution state.
 * Populated by middleware on initial request, hydrated on client.
 */
export const useTenantStore = create<TenantState>()((set) => ({
  hotelId: null,
  slug: null,
  branding: defaultBranding,
  setTenant: (hotelId, slug, branding) => set({ hotelId, slug, branding }),
  clearTenant: () => set({ hotelId: null, slug: null, branding: defaultBranding }),
}));
