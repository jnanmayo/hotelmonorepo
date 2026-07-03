import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { JwtPayload } from '@tungaos/shared';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    if (!user?.hotelId || user.roles.includes('SUPER_ADMIN')) return true;

    const subscription = await this.prisma.hotelSubscription.findUnique({
      where: { hotelId: user.hotelId },
    });

    if (!subscription || !subscription.isActive) {
      throw new ForbiddenException('Hotel subscription inactive or expired');
    }

    return true;
  }
}
