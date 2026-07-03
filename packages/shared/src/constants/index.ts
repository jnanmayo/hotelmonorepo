/**
 * Shared application constants.
 * Role definitions, permission keys, and platform-wide enums live here.
 */

export const APP_NAME = 'TungaOS' as const;
export const APP_VENDOR = 'Sharada Sama Solutions' as const;
export const APP_VERSION = '0.1.0' as const;

/** Default brand theme — overridden per tenant at runtime */
export const DEFAULT_THEME = {
  primary: '#001F3F',
  secondary: '#C9A227',
  accent: '#FFFFFF',
  background: '#F5F5F5',
  borderRadius: '12px',
} as const;

/** HTTP header used to pass tenant context */
export const TENANT_HEADER = 'x-hotel-id' as const;

/** Cookie names for auth tokens */
export const AUTH_COOKIES = {
  accessToken: 'tungaos_access_token',
  refreshToken: 'tungaos_refresh_token',
} as const;

/** Pagination defaults */
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
} as const;

/** Session and token expiry defaults (seconds) */
export const AUTH_DEFAULTS = {
  accessTokenExpiry: 900,
  refreshTokenExpiry: 604_800,
  sessionTimeout: 1_800,
  rememberMeExpiry: 2_592_000,
  otpExpiry: 300,
  otpMaxAttempts: 5,
  maxFailedLogins: 5,
  lockoutDuration: 900,
  passwordExpiryDays: 90,
  passwordHistoryCount: 5,
} as const;

export * from './roles.js';
export * from './permissions.js';
