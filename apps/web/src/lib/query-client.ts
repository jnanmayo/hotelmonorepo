import { QueryClient } from '@tanstack/react-query';

/** Default React Query client configuration */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

/** Standard query key factory pattern — extend per feature module */
export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
    profile: ['auth', 'profile'] as const,
  },
  tenant: {
    branding: (hotelId: string) => ['tenant', 'branding', hotelId] as const,
    settings: (hotelId: string) => ['tenant', 'settings', hotelId] as const,
  },
} as const;
