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
import { CorpSalesDashboardService } from '@/modules/corp-sales/services/corp-sales-dashboard.service';
import { CorpSalesLeadService } from '@/modules/corp-sales/services/corp-sales-lead.service';
import { CorpSalesOperationsService } from '@/modules/corp-sales/services/corp-sales-operations.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  CreateCorpCompanySchema,
  CreateCorpMeetingSchema,
  CreateCorpSalesLeadSchema,
  UpdateCorpSalesLeadStatusSchema,
} from '@tungaos/shared';

@ApiTags('Corporate Sales')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('corporate-sales')
export class CorpSalesController {
  constructor(
    private dashboard: CorpSalesDashboardService,
    private leads: CorpSalesLeadService,
    private operations: CorpSalesOperationsService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('corp-sales:company:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('owner-dashboard')
  @RequirePermissions('corp-sales:company:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOwnerDashboard(hotelId) };
  }

  @Get('analytics')
  @RequirePermissions('corp-sales:company:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getAnalytics(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('corp-sales:company:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.leads.seedDefaults(hotelId) };
  }

  @Get('companies')
  @RequirePermissions('corp-sales:company:read')
  async listCompanies(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listCompanies(hotelId) };
  }

  @Post('companies')
  @RequirePermissions('corp-sales:company:manage')
  async createCompany(@CurrentUser() user: JwtPayload, @Body() dto: CreateCorpCompanySchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createCompany(hotelId, dto) };
  }

  @Get('accounts')
  @RequirePermissions('corp-sales:company:read')
  async listAccounts(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listAccounts(hotelId) };
  }

  @Get('leads')
  @RequirePermissions('corp-sales:lead:read')
  async listLeads(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.leads.listLeads(hotelId, status) };
  }

  @Post('leads')
  @RequirePermissions('corp-sales:lead:create')
  async createLead(@CurrentUser() user: JwtPayload, @Body() dto: CreateCorpSalesLeadSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.leads.createLead(hotelId, dto, user.sub) };
  }

  @Patch('leads/:id/status')
  @RequirePermissions('corp-sales:lead:update')
  async updateLeadStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCorpSalesLeadStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.leads.updateLeadStatus(hotelId, id, dto) };
  }

  @Get('pipeline')
  @RequirePermissions('corp-sales:lead:read')
  async getPipeline(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.leads.getPipeline(hotelId) };
  }

  @Get('contracts')
  @RequirePermissions('corp-sales:contract:read')
  async listContracts(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listContracts(hotelId) };
  }

  @Get('rates')
  @RequirePermissions('corp-sales:contract:read')
  async listRates(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listRatePlans(hotelId) };
  }

  @Get('room-allocation')
  @RequirePermissions('corp-sales:company:read')
  async listRoomAllocation(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listRoomAllocations(hotelId) };
  }

  @Get('bookings')
  @RequirePermissions('corp-sales:company:read')
  async listBookings(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listBookings(hotelId) };
  }

  @Get('employees')
  @RequirePermissions('corp-sales:company:read')
  async listEmployees(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listEmployees(hotelId) };
  }

  @Get('meetings')
  @RequirePermissions('corp-sales:company:read')
  async listMeetings(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listMeetings(hotelId) };
  }

  @Post('meetings')
  @RequirePermissions('corp-sales:company:manage')
  async createMeeting(@CurrentUser() user: JwtPayload, @Body() dto: CreateCorpMeetingSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createMeeting(hotelId, dto) };
  }

  @Get('tasks')
  @RequirePermissions('corp-sales:company:read')
  async listTasks(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listTasks(hotelId) };
  }

  @Get('billing')
  @RequirePermissions('corp-sales:company:read')
  async listBilling(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listInvoices(hotelId) };
  }

  @Get('credit')
  @RequirePermissions('corp-sales:company:read')
  async listCredit(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listCredit(hotelId) };
  }

  @Get('collections')
  @RequirePermissions('corp-sales:company:read')
  async listCollections(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listPayments(hotelId) };
  }

  @Get('renewals')
  @RequirePermissions('corp-sales:contract:read')
  async listRenewals(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listRenewals(hotelId) };
  }

  @Get('documents')
  @RequirePermissions('corp-sales:company:read')
  async listDocuments(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listDocuments(hotelId) };
  }

  @Get('targets')
  @RequirePermissions('corp-sales:company:read')
  async listTargets(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listTargets(hotelId) };
  }

  @Get('commissions')
  @RequirePermissions('corp-sales:company:read')
  async listCommissions(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listCommissions(hotelId) };
  }

  @Get('approvals')
  @RequirePermissions('corp-sales:contract:read')
  async listApprovals(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listApprovals(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('reports:report:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getReport(hotelId, type) };
  }
}
