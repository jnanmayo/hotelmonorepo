import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GxpRequestStatus } from '@prisma/client';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { GxpAdminService } from '@/modules/gxp/services/gxp-admin.service';
import { GxpRequestService } from '@/modules/gxp/services/gxp-request.service';

import type { JwtPayload } from '@tungaos/shared';
import type { GxpAnnouncementSchema, GxpOfferSchema } from '@tungaos/shared';

@ApiTags('Guest Experience Platform')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('gxp')
export class GxpController {
  constructor(
    private admin: GxpAdminService,
    private requestService: GxpRequestService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('gxp:portal:read')
  async dashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.admin.getDashboard(hotelId) };
  }

  @Get('qr-codes')
  @RequirePermissions('gxp:portal:read')
  async qrCodes(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.admin.listQrCodes(hotelId) };
  }

  @Post('qr-codes/generate')
  @RequirePermissions('gxp:portal:create')
  async generateQr(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.admin.generateQrCodes(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('gxp:portal:create')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.admin.seedDefaults(hotelId) };
  }

  @Get('requests')
  @RequirePermissions('gxp:portal:read')
  async requests(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.admin.listRequests(hotelId) };
  }

  @Patch('requests/:id/status')
  @RequirePermissions('gxp:portal:update')
  async updateRequest(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { status: GxpRequestStatus },
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.requestService.updateRequestStatus(hotelId, id, body.status) };
  }

  @Post('offers')
  @RequirePermissions('gxp:portal:create')
  async createOffer(@CurrentUser() user: JwtPayload, @Body() body: GxpOfferSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.admin.createOffer(hotelId, body) };
  }

  @Post('announcements')
  @RequirePermissions('gxp:portal:create')
  async createAnnouncement(@CurrentUser() user: JwtPayload, @Body() body: GxpAnnouncementSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.admin.createAnnouncement(hotelId, body) };
  }
}
