import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { JwtPayload } from '@tungaos/shared';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);

export const HotelId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload; headers: Record<string, string> }>();
    return request.user?.hotelId ?? request.headers['x-hotel-id'] ?? null;
  },
);
