import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SKIP_HOTEL_CHECK } from '@/common/decorators/auth.decorators';

import type { JwtPayload } from '@tungaos/shared';

@Injectable()
export class HotelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_HOTEL_CHECK, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<{
      user?: JwtPayload;
      headers: Record<string, string>;
      params: Record<string, string>;
      body: Record<string, unknown>;
    }>();

    const user = request.user;
    if (!user) return true;

    if (user.roles.includes('SUPER_ADMIN')) return true;

    const headerHotelId = request.headers['x-hotel-id'];
    const paramHotelId = request.params.hotelId;
    const bodyHotelId = request.body?.hotelId as string | undefined;

    const requestedHotelId = headerHotelId ?? paramHotelId ?? bodyHotelId;
    if (!requestedHotelId) {
      throw new BadRequestException('Hotel context required (x-hotel-id header)');
    }

    if (user.hotelId && user.hotelId !== requestedHotelId) {
      throw new ForbiddenException('Cross-tenant access denied');
    }

    return true;
  }
}
