import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import type { AuthConfig } from '@/config/auth.config';

import { AUTH_DEFAULTS, type JwtPayload } from '@tungaos/shared';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const authConfig = this.configService.get<AuthConfig>('auth');
    return this.jwtService.sign(payload, {
      secret: authConfig?.jwtAccessSecret,
      expiresIn: authConfig?.jwtAccessExpiry ?? '15m',
    });
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();
    return {
      accessToken,
      refreshToken,
      expiresIn: AUTH_DEFAULTS.accessTokenExpiry,
    };
  }

  verifyRefreshToken(token: string, hash: string): boolean {
    return this.hashToken(token) === hash;
  }
}
