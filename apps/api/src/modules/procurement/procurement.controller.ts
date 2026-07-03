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
import { ProcDashboardService } from '@/modules/procurement/services/proc-dashboard.service';
import { ProcGrnService, ProcPoService } from '@/modules/procurement/services/proc-po-grn.service';
import { ProcSupportService } from '@/modules/procurement/services/proc-support.service';
import { ProcVendorService } from '@/modules/procurement/services/proc-vendor.service';
import { ProcWorkflowService } from '@/modules/procurement/services/proc-workflow.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  CreateContractSchema,
  CreateGrnSchema,
  CreatePoSchema,
  CreateProcPrSchema,
  CreateQuotationSchema,
  CreateReturnSchema,
  CreateRfqSchema,
  CreateVendorSchema,
} from '@tungaos/shared';

@ApiTags('Procurement')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('procurement')
export class ProcurementController {
  constructor(
    private dashboard: ProcDashboardService,
    private vendors: ProcVendorService,
    private workflow: ProcWorkflowService,
    private po: ProcPoService,
    private grn: ProcGrnService,
    private support: ProcSupportService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('procurement:order:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('procurement:order:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    const [categories, budgets] = await Promise.all([
      this.vendors.seedCategories(hotelId),
      this.support.seedBudgets(hotelId),
    ]);
    return { data: { categories, budgets } };
  }

  @Get('vendors')
  @RequirePermissions('procurement:vendor:read')
  async listVendors(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.vendors.list(hotelId, search) };
  }

  @Post('vendors')
  @RequirePermissions('procurement:vendor:manage')
  async createVendor(@CurrentUser() user: JwtPayload, @Body() dto: CreateVendorSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.vendors.create(hotelId, dto, user.sub) };
  }

  @Get('vendors/:id')
  @RequirePermissions('procurement:vendor:read')
  async getVendor(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.vendors.get(hotelId, id) };
  }

  @Get('vendor-categories')
  @RequirePermissions('procurement:vendor:read')
  async listVendorCategories(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.vendors.listCategories(hotelId) };
  }

  @Get('purchase-requests')
  @RequirePermissions('procurement:order:read')
  async listPr(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.workflow.listPurchaseRequests(hotelId) };
  }

  @Post('purchase-requests')
  @RequirePermissions('procurement:order:create')
  async createPr(@CurrentUser() user: JwtPayload, @Body() dto: CreateProcPrSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.createPurchaseRequest(hotelId, dto, user.sub) };
  }

  @Patch('purchase-requests/:id/approve')
  @RequirePermissions('procurement:order:approve')
  async approvePr(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Query('level') level: 'dept' | 'pm' = 'dept',
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.approvePurchaseRequest(hotelId, id, level, user.sub) };
  }

  @Get('rfqs')
  @RequirePermissions('procurement:order:read')
  async listRfqs(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.workflow.listRfqs(hotelId) };
  }

  @Post('rfqs')
  @RequirePermissions('procurement:order:create')
  async createRfq(@CurrentUser() user: JwtPayload, @Body() dto: CreateRfqSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.createRfq(hotelId, dto, user.sub) };
  }

  @Get('quotations')
  @RequirePermissions('procurement:order:read')
  async listQuotations(@CurrentUser() user: JwtPayload, @Query('rfqId') rfqId?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.workflow.listQuotations(hotelId, rfqId) };
  }

  @Post('quotations')
  @RequirePermissions('procurement:order:create')
  async createQuotation(@CurrentUser() user: JwtPayload, @Body() dto: CreateQuotationSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.createQuotation(hotelId, dto) };
  }

  @Get('quotations/compare/:rfqId')
  @RequirePermissions('procurement:order:read')
  async compareQuotations(@CurrentUser() user: JwtPayload, @Param('rfqId') rfqId: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.compareQuotations(hotelId, rfqId) };
  }

  @Patch('quotations/:id/select')
  @RequirePermissions('procurement:order:approve')
  async selectQuotation(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.selectQuotation(hotelId, id) };
  }

  @Get('purchase-orders')
  @RequirePermissions('procurement:order:read')
  async listPos(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.po.list(hotelId) };
  }

  @Post('purchase-orders')
  @RequirePermissions('procurement:order:create')
  async createPo(@CurrentUser() user: JwtPayload, @Body() dto: CreatePoSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.po.create(hotelId, dto, user.sub) };
  }

  @Patch('purchase-orders/:id/approve')
  @RequirePermissions('procurement:order:approve')
  async approvePo(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.po.approve(hotelId, id, user.sub) };
  }

  @Patch('purchase-orders/:id/send')
  @RequirePermissions('procurement:order:update')
  async sendPo(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.po.send(hotelId, id) };
  }

  @Get('grns')
  @RequirePermissions('procurement:order:read')
  async listGrns(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.grn.list(hotelId) };
  }

  @Post('grns')
  @RequirePermissions('procurement:order:create')
  async createGrn(@CurrentUser() user: JwtPayload, @Body() dto: CreateGrnSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.grn.create(hotelId, dto, user.sub) };
  }

  @Patch('grns/:id/inspect')
  @RequirePermissions('procurement:order:approve')
  async inspectGrn(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { approved: boolean; notes?: string },
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.grn.inspect(hotelId, id, body.approved, body.notes) };
  }

  @Patch('grns/:id/post')
  @RequirePermissions('procurement:order:approve')
  async postGrn(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.grn.post(hotelId, id, user.sub) };
  }

  @Get('returns')
  @RequirePermissions('procurement:order:read')
  async listReturns(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listReturns(hotelId) };
  }

  @Post('returns')
  @RequirePermissions('procurement:order:create')
  async createReturn(@CurrentUser() user: JwtPayload, @Body() dto: CreateReturnSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createReturn(hotelId, dto) };
  }

  @Get('contracts')
  @RequirePermissions('procurement:order:read')
  async listContracts(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listContracts(hotelId) };
  }

  @Post('contracts')
  @RequirePermissions('procurement:order:create')
  async createContract(@CurrentUser() user: JwtPayload, @Body() dto: CreateContractSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createContract(hotelId, dto) };
  }

  @Get('budgets')
  @RequirePermissions('procurement:order:read')
  async listBudgets(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listBudgets(hotelId) };
  }

  @Get('invoices')
  @RequirePermissions('procurement:order:read')
  async listInvoices(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listInvoices(hotelId) };
  }

  @Get('analytics')
  @RequirePermissions('procurement:order:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getAnalytics(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('procurement:order:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.getReport(hotelId, type) };
  }
}

@ApiTags('Vendor Portal')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('vendor-portal')
export class VendorPortalController {
  constructor(private support: ProcSupportService) {}

  @Get('dashboard')
  @RequirePermissions('procurement:vendor:read')
  async dashboard(@Query('vendorId') vendorId: string) {
    if (!vendorId) return { data: null };
    return { data: await this.support.getVendorPortalDashboard(vendorId) };
  }

  @Get('purchase-orders')
  @RequirePermissions('procurement:vendor:read')
  async pos(@Query('vendorId') vendorId: string) {
    if (!vendorId) return { data: [] };
    return { data: await this.support.getVendorPortalPos(vendorId) };
  }

  @Get('rfqs')
  @RequirePermissions('procurement:vendor:read')
  async rfqs(@Query('vendorId') vendorId: string) {
    if (!vendorId) return { data: [] };
    return { data: await this.support.getVendorPortalRfqs(vendorId) };
  }
}
