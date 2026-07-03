import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import { AUTH_DEFAULTS } from '@tungaos/shared';

@Injectable()
export class PasswordService {
  constructor(private prisma: PrismaService) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  validatePolicy(password: string): void {
    const checks = [
      password.length >= 12,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    if (!checks.every(Boolean)) {
      throw new BadRequestException('Password does not meet policy requirements');
    }
  }

  async checkHistory(userId: string, password: string): Promise<void> {
    const history = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: AUTH_DEFAULTS.passwordHistoryCount,
    });

    for (const entry of history) {
      if (await this.verify(password, entry.passwordHash)) {
        throw new BadRequestException('Password was recently used. Choose a different password.');
      }
    }
  }

  async recordHistory(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.passwordHistory.create({
      data: { userId, passwordHash },
    });
  }

  async checkAccountLock(user: { lockedUntil: Date | null; failedAttempts: number }): Promise<void> {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked. Try again later.');
    }
  }

  async recordFailedAttempt(userId: string): Promise<void> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { failedAttempts: { increment: 1 } },
    });

    if (user.failedAttempts >= AUTH_DEFAULTS.maxFailedLogins) {
      const lockedUntil = new Date(Date.now() + AUTH_DEFAULTS.lockoutDuration * 1000);
      await this.prisma.user.update({
        where: { id: userId },
        data: { lockedUntil },
      });
      await this.prisma.securityEvent.create({
        data: {
          userId,
          eventType: 'ACCOUNT_LOCKED',
          metadata: { failedAttempts: user.failedAttempts },
        },
      });
    }
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { failedAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
  }
}
