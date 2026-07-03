import type { HotelId, UserId } from './index.js';

export interface AuthUser {
  id: UserId;
  email: string;
  firstName: string;
  lastName: string;
  hotelId: HotelId | null;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  isMfaEnabled: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
  requiresMfa?: boolean;
  requiresEmailVerification?: boolean;
  requiresHotelSelection?: boolean;
  requiresRoleSelection?: boolean;
}

export interface SessionInfo {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string | null;
  lastActiveAt: string;
  isCurrent: boolean;
  isTrusted: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  status: 'SUCCESS' | 'FAILED' | 'LOCKED' | 'MFA_REQUIRED';
  ipAddress: string | null;
  device: string | null;
  location: string | null;
  failureReason: string | null;
  createdAt: string;
}

export type OtpChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';
export type OtpPurpose =
  | 'LOGIN'
  | 'MFA'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFICATION'
  | 'PHONE_VERIFICATION';
