import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import { AUTH_DEFAULTS, type OtpChannel, type OtpPurpose } from '@tungaos/shared';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  hashCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  async createOtp(
    identifier: string,
    channel: OtpChannel,
    purpose: OtpPurpose,
    userId?: string,
  ): Promise<string> {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + AUTH_DEFAULTS.otpExpiry * 1000);

    await this.prisma.otpVerification.create({
      data: {
        userId,
        identifier,
        codeHash: this.hashCode(code),
        channel,
        purpose,
        maxAttempts: AUTH_DEFAULTS.otpMaxAttempts,
        expiresAt,
      },
    });

    // Notification dispatch wired in notifications module
    return code;
  }

  async verifyOtp(identifier: string, code: string, purpose: OtpPurpose): Promise<boolean> {
    const otp = await this.prisma.otpVerification.findFirst({
      where: {
        identifier,
        purpose,
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) return false;

    if (otp.attempts >= otp.maxAttempts) return false;

    await this.prisma.otpVerification.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });

    if (this.hashCode(code) !== otp.codeHash) return false;

    await this.prisma.otpVerification.update({
      where: { id: otp.id },
      data: { verifiedAt: new Date() },
    });

    return true;
  }
}
