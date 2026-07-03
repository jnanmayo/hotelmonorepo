import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { ChannelService } from '@/modules/channel/services/channel.service';
import { ChannelSyncService } from '@/modules/channel/services/channel-sync.service';
import { ChannelWebhookService } from '@/modules/channel/services/channel-webhook.service';
import { SyncQueueService } from '@/modules/channel/services/sync-queue.service';

import type { JwtPayload } from '@tungaos/shared';

@ApiTags('Channel Manager')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('channels')
export class ChannelController {
  constructor(
    private channel: ChannelService,
    private sync: ChannelSyncService,
    private webhookService: ChannelWebhookService,
    private queue: SyncQueueService,
  ) {}

  @Get('dashboard')
  @RequirePermissions('reports:report:read')
  async dashboard(@CurrentUser() user: JwtPayload) {
    if (!user.hotelId) return { data: null };
    return { data: await this.channel.getDashboard(user.hotelId) };
  }

  @Get('connections')
  @RequirePermissions('reports:report:read')
  async connections(@CurrentUser() user: JwtPayload) {
    if (!user.hotelId) return { data: [] };
    return { data: await this.channel.listConnections(user.hotelId) };
  }

  @Post('connect')
  @RequirePermissions('settings:config:manage')
  async connect(@CurrentUser() user: JwtPayload, @Body() body: Record<string, unknown>) {
    if (!user.hotelId) return { data: null };
    const data = await this.channel.connectChannel(user.hotelId, body as Parameters<ChannelService['connectChannel']>[1]);
    return { data };
  }

  @Post(':integrationId/disconnect')
  @RequirePermissions('settings:config:manage')
  async disconnect(@CurrentUser() user: JwtPayload, @Param('integrationId') integrationId: string) {
    if (!user.hotelId) return { data: null };
    return { data: await this.channel.disconnectChannel(user.hotelId, integrationId) };
  }

  @Get('room-mappings')
  @RequirePermissions('rooms:room:read')
  async roomMappings(@CurrentUser() user: JwtPayload, @Query('integrationId') integrationId?: string) {
    if (!user.hotelId) return { data: [] };
    return { data: await this.channel.listRoomMappings(user.hotelId, integrationId) };
  }

  @Put('room-mappings')
  @RequirePermissions('rooms:room:update')
  async upsertRoomMapping(@CurrentUser() user: JwtPayload, @Body() body: Record<string, unknown>) {
    if (!user.hotelId) return { data: null };
    return { data: await this.channel.upsertRoomMapping(user.hotelId, body as Parameters<ChannelService['upsertRoomMapping']>[1]) };
  }

  @Get('rate-mappings')
  @RequirePermissions('rooms:room:read')
  async rateMappings(@CurrentUser() user: JwtPayload, @Query('integrationId') integrationId?: string) {
    if (!user.hotelId) return { data: [] };
    return { data: await this.channel.listRateMappings(user.hotelId, integrationId) };
  }

  @Put('rate-mappings')
  @RequirePermissions('rooms:room:update')
  async upsertRateMapping(@CurrentUser() user: JwtPayload, @Body() body: Record<string, unknown>) {
    if (!user.hotelId) return { data: null };
    return { data: await this.channel.upsertRateMapping(user.hotelId, body as Parameters<ChannelService['upsertRateMapping']>[1]) };
  }

  @Get('restrictions')
  @RequirePermissions('rooms:room:read')
  async restrictions(@CurrentUser() user: JwtPayload) {
    if (!user.hotelId) return { data: [] };
    return { data: await this.channel.listRestrictions(user.hotelId) };
  }

  @Post('sync/inventory')
  @RequirePermissions('rooms:room:update')
  async syncInventory(@CurrentUser() user: JwtPayload, @Query('integrationId') integrationId?: string) {
    if (!user.hotelId) return { data: null };
    return { data: await this.sync.syncInventory(user.hotelId, integrationId) };
  }

  @Post('sync/rates')
  @RequirePermissions('rooms:room:update')
  async syncRates(@CurrentUser() user: JwtPayload, @Query('integrationId') integrationId?: string) {
    if (!user.hotelId) return { data: null };
    return { data: await this.sync.syncRates(user.hotelId, integrationId) };
  }

  @Post('sync/retry/:jobId')
  @RequirePermissions('rooms:room:update')
  async retrySync(@Param('jobId') jobId: string) {
    return { data: await this.queue.retryJob(jobId) };
  }

  @Get('sync-logs')
  @RequirePermissions('reports:report:read')
  async syncLogs(@CurrentUser() user: JwtPayload, @Query('page') page = '1') {
    if (!user.hotelId) return { data: { items: [], meta: {} } };
    return { data: await this.channel.listSyncLogs(user.hotelId, Number(page)) };
  }

  @Get('webhooks')
  @RequirePermissions('reports:report:read')
  async listWebhooks(@CurrentUser() user: JwtPayload, @Query('page') page = '1') {
    if (!user.hotelId) return { data: { items: [], meta: {} } };
    return { data: await this.webhookService.listWebhookEvents(user.hotelId, Number(page)) };
  }

  @Get('ota-bookings')
  @RequirePermissions('reservations:booking:read')
  async otaBookings(@CurrentUser() user: JwtPayload, @Query('page') page = '1') {
    if (!user.hotelId) return { data: { items: [], meta: {} } };
    return { data: await this.channel.listOtaBookings(user.hotelId, Number(page)) };
  }

  @Get('commission')
  @RequirePermissions('finance:ledger:read')
  async commission(@CurrentUser() user: JwtPayload) {
    if (!user.hotelId) return { data: null };
    return { data: await this.channel.getCommissionSummary(user.hotelId) };
  }

  @Get('analytics')
  @RequirePermissions('reports:report:read')
  async analytics(@CurrentUser() user: JwtPayload) {
    if (!user.hotelId) return { data: null };
    return { data: await this.channel.getAnalytics(user.hotelId) };
  }
}
