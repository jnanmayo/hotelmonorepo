import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { GxpSessionService } from '@/modules/gxp/services/gxp-session.service';

import type { GxpSessionContext } from '@tungaos/shared';

export const GXP_SESSION_HEADER = 'x-guest-session';

@Injectable()
export class GxpSessionGuard {
  constructor(private sessions: GxpSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string>; gxpSession?: GxpSessionContext }>();
    const token = req.headers[GXP_SESSION_HEADER] ?? req.headers[GXP_SESSION_HEADER.toLowerCase()];
    if (!token) throw new UnauthorizedException('Guest session required');
    req.gxpSession = await this.sessions.validateSession(token);
    return true;
  }
}

export const GxpSession = createParamDecorator((_data: unknown, ctx: ExecutionContext): GxpSessionContext => {
  const req = ctx.switchToHttp().getRequest<{ gxpSession: GxpSessionContext }>();
  return req.gxpSession;
});
