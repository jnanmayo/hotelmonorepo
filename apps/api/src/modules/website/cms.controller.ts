import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { WebsiteService } from '@/modules/website/website.service';

import type { JwtPayload } from '@tungaos/shared';

@ApiTags('CMS')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('cms')
export class CmsController {
  constructor(private websiteService: WebsiteService) {}

  @Get('dashboard')
  @RequirePermissions('website:content:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = user.hotelId;
    if (!hotelId) return { data: null };
    const stats = await this.websiteService.getCmsDashboard(hotelId);
    return { data: stats };
  }

  @Get('sections/:section')
  @RequirePermissions('website:content:read')
  async listSection(@CurrentUser() user: JwtPayload, @Param('section') section: string) {
    const hotelId = user.hotelId;
    if (!hotelId) return { data: [] };
    const items = await this.websiteService.listCmsSection(hotelId, section);
    return { data: items };
  }
}
