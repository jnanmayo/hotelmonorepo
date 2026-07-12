/**
 * Centralized environment variable access with type safety.
 * All NEXT_PUBLIC_* vars are validated at build/runtime.
 */

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

export const env = {
  appName: process.env.NEXT_PUBLIC_API_URL ?? 'TungaOS',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  tenantMode: getEnv('NEXT_PUBLIC_TENANT_MODE', 'subdomain') as 'subdomain' | 'path',
  defaultHotelSlug: getEnv('NEXT_PUBLIC_DEFAULT_HOTEL_SLUG', 'tunga-international'),
  authCookieDomain: getEnv('NEXT_PUBLIC_AUTH_COOKIE_DOMAIN', 'localhost'),
  googleClientId: getOptionalEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000',
  cdnUrl: getOptionalEnv('NEXT_PUBLIC_CDN_URL'),
  enabledModules: (getOptionalEnv('NEXT_PUBLIC_ENABLED_MODULES') ?? '').split(',').filter(Boolean),
  whatsappNumber: getOptionalEnv('NEXT_PUBLIC_WHATSAPP_NUMBER'),
} as const;
