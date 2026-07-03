import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CrmDashboardService } from '@/modules/crm/services/crm-dashboard.service';
import { CrmGuestService } from '@/modules/crm/services/crm-guest.service';
import { CrmLoyaltyService } from '@/modules/crm/services/crm-loyalty.service';
import { CrmMarketingService } from '@/modules/crm/services/crm-marketing.service';
import { CrmSalesService } from '@/modules/crm/services/crm-sales.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  AdjustLoyaltyPointsSchema,
  CreateCampaignSchema,
  CreateCouponSchema,
  CreateGiftCardSchema,
  CreateLeadSchema,
  CreateReferralSchema,
  UpdateLeadStatusSchema,
} from '@tungaos/shared';

@ApiTags('CRM')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('crm')
export class CrmController {
  constructor(
    private dashboard: CrmDashboardService,
    private guests: CrmGuestService,
    private sales: CrmSalesService,
    private loyalty: CrmLoyaltyService,
    private marketing: CrmMarketingService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('crm:lead:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('owner-dashboard')
  @RequirePermissions('crm:lead:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOwnerDashboard(hotelId) };
  }

  @Get('analytics')
  @RequirePermissions('crm:lead:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.guests.getAnalytics(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('crm:lead:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.guests.seedDefaults(hotelId) };
  }

  @Get('guests')
  @RequirePermissions('crm:lead:read')
  async listGuests(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.guests.listGuests(hotelId, search) };
  }

  @Get('guests/:id')
  @RequirePermissions('crm:lead:read')
  async getGuest(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.guests.getGuest360(hotelId, id) };
  }

  @Get('guests/:id/timeline')
  @RequirePermissions('crm:lead:read')
  async getTimeline(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.guests.getTimeline(hotelId, id) };
  }

  @Get('segments')
  @RequirePermissions('crm:lead:read')
  async getSegments(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.guests.getSegments(hotelId) };
  }

  @Get('leads')
  @RequirePermissions('crm:lead:read')
  async listLeads(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.sales.listLeads(hotelId, status) };
  }

  @Post('leads')
  @RequirePermissions('crm:lead:create')
  async createLead(@CurrentUser() user: JwtPayload, @Body() dto: CreateLeadSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.sales.createLead(hotelId, dto, user.sub) };
  }

  @Patch('leads/:id/status')
  @RequirePermissions('crm:lead:update')
  async updateLeadStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateLeadStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.sales.updateLeadStatus(hotelId, id, dto, user.sub) };
  }

  @Get('pipeline')
  @RequirePermissions('crm:lead:read')
  async getPipeline(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.sales.getPipeline(hotelId) };
  }

  @Get('loyalty/members')
  @RequirePermissions('crm:lead:read')
  async listLoyaltyMembers(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.loyalty.listMembers(hotelId) };
  }

  @Get('loyalty/transactions')
  @RequirePermissions('crm:lead:read')
  async listLoyaltyTransactions(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.loyalty.listTransactions(hotelId) };
  }

  @Get('loyalty/program')
  @RequirePermissions('crm:lead:read')
  async getLoyaltyProgram(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.loyalty.getProgram(hotelId) };
  }

  @Post('loyalty/points')
  @RequirePermissions('crm:lead:manage')
  async adjustPoints(@CurrentUser() user: JwtPayload, @Body() dto: AdjustLoyaltyPointsSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.loyalty.adjustPoints(hotelId, dto, user.sub) };
  }

  @Get('campaigns')
  @RequirePermissions('crm:lead:read')
  async listCampaigns(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listCampaigns(hotelId) };
  }

  @Post('campaigns')
  @RequirePermissions('crm:lead:manage')
  async createCampaign(@CurrentUser() user: JwtPayload, @Body() dto: CreateCampaignSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.marketing.createCampaign(hotelId, dto, user.sub) };
  }

  @Get('automation')
  @RequirePermissions('crm:lead:read')
  async listAutomations(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listAutomations(hotelId) };
  }

  @Get('communications/email')
  @RequirePermissions('crm:lead:read')
  async listEmail(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listEmailLogs(hotelId) };
  }

  @Get('communications/whatsapp')
  @RequirePermissions('crm:lead:read')
  async listWhatsApp(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listWhatsAppLogs(hotelId) };
  }

  @Get('communications/sms')
  @RequirePermissions('crm:lead:read')
  async listSms(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listSmsLogs(hotelId) };
  }

  @Get('coupons')
  @RequirePermissions('crm:lead:read')
  async listCoupons(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listCoupons(hotelId) };
  }

  @Post('coupons')
  @RequirePermissions('crm:lead:manage')
  async createCoupon(@CurrentUser() user: JwtPayload, @Body() dto: CreateCouponSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.marketing.createCoupon(hotelId, dto, user.sub) };
  }

  @Get('gift-cards')
  @RequirePermissions('crm:lead:read')
  async listGiftCards(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listGiftCards(hotelId) };
  }

  @Post('gift-cards')
  @RequirePermissions('crm:lead:manage')
  async createGiftCard(@CurrentUser() user: JwtPayload, @Body() dto: CreateGiftCardSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.marketing.createGiftCard(hotelId, dto) };
  }

  @Get('referrals')
  @RequirePermissions('crm:lead:read')
  async listReferrals(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listReferrals(hotelId) };
  }

  @Post('referrals')
  @RequirePermissions('crm:lead:manage')
  async createReferral(@CurrentUser() user: JwtPayload, @Body() dto: CreateReferralSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.marketing.createReferral(hotelId, dto) };
  }

  @Get('corporate')
  @RequirePermissions('crm:lead:read')
  async listCorporate(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listCorporate(hotelId) };
  }

  @Get('travel-agents')
  @RequirePermissions('crm:lead:read')
  async listTravelAgents(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listTravelAgents(hotelId) };
  }

  @Get('feedback')
  @RequirePermissions('crm:lead:read')
  async listFeedback(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listFeedback(hotelId) };
  }

  @Get('reviews')
  @RequirePermissions('crm:lead:read')
  async listReviews(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.marketing.listReviews(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('crm:lead:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.marketing.getReport(hotelId, type) };
  }
}
