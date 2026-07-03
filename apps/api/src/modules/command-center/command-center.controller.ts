import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CommandCenterService } from '@/modules/command-center/services/command-center.service';

import type { JwtPayload } from '@tungaos/shared';

@ApiTags('Command Center')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('command-center')
export class CommandCenterController {
  constructor(private commandCenter: CommandCenterService) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  // @RequirePermissions('dashboard:overview:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.commandCenter.getCommandCenter(hotelId) };
  }

  @Get('war-room')
  @RequirePermissions('dashboard:overview:read')
  async getWarRoom(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.commandCenter.getWarRoom(hotelId) };
  }

  @Get('ai')
  @RequirePermissions('ai:assistant:read')
  async getAi(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.commandCenter.getAiInsights(hotelId) };
  }

  @Get('investor')
  @RequirePermissions('reports:report:read')
  async getInvestor(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.commandCenter.getInvestorDashboard(hotelId) };
  }
}
