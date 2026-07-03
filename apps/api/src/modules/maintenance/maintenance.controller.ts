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
import { EamAssetService } from '@/modules/maintenance/services/eam-asset.service';
import { EamDashboardService } from '@/modules/maintenance/services/eam-dashboard.service';
import { EamSupportService } from '@/modules/maintenance/services/eam-support.service';
import { EamWorkflowService } from '@/modules/maintenance/services/eam-workflow.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  AddWorkOrderPartSchema,
  AssignWorkOrderSchema,
  CreateAmcContractSchema,
  CreateAssetSchema,
  CreateEnergyReadingSchema,
  CreateEamInspectionSchema,
  CreateMaintenanceRequestSchema,
  CreatePmPlanSchema,
  CreateWarrantyClaimSchema,
  CreateWorkOrderSchema,
  UpdateAssetLifecycleSchema,
  UpdateWorkOrderStatusSchema,
} from '@tungaos/shared';

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private dashboard: EamDashboardService,
    private assets: EamAssetService,
    private workflow: EamWorkflowService,
    private support: EamSupportService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('maintenance:asset:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('owner-dashboard')
  @RequirePermissions('maintenance:asset:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getOwnerDashboard(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('maintenance:asset:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    const [categories, safety] = await Promise.all([
      this.assets.seedCategories(hotelId),
      this.support.seedSafetyRecords(hotelId),
    ]);
    return { data: { categories, safety } };
  }

  @Get('assets')
  @RequirePermissions('maintenance:asset:read')
  async listAssets(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.assets.list(hotelId, search) };
  }

  @Post('assets')
  @RequirePermissions('maintenance:asset:manage')
  async createAsset(@CurrentUser() user: JwtPayload, @Body() dto: CreateAssetSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.assets.create(hotelId, dto, user.sub) };
  }

  @Get('assets/:id')
  @RequirePermissions('maintenance:asset:read')
  async getAsset(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.assets.get(hotelId, id) };
  }

  @Patch('assets/:id/lifecycle')
  @RequirePermissions('maintenance:asset:manage')
  async updateLifecycle(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAssetLifecycleSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.assets.updateLifecycle(hotelId, id, dto, user.sub) };
  }

  @Get('asset-categories')
  @RequirePermissions('maintenance:asset:read')
  async listCategories(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.assets.listCategories(hotelId) };
  }

  @Get('requests')
  @RequirePermissions('maintenance:workorder:read')
  async listRequests(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.workflow.listRequests(hotelId) };
  }

  @Post('requests')
  @RequirePermissions('maintenance:workorder:create')
  async createRequest(@CurrentUser() user: JwtPayload, @Body() dto: CreateMaintenanceRequestSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.createRequest(hotelId, dto, user.sub) };
  }

  @Patch('requests/:id/review')
  @RequirePermissions('maintenance:workorder:manage')
  async reviewRequest(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.reviewRequest(hotelId, id, user.sub) };
  }

  @Post('requests/:id/work-order')
  @RequirePermissions('maintenance:workorder:manage')
  async createWoFromRequest(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.createWorkOrderFromRequest(hotelId, id, user.sub) };
  }

  @Get('work-orders')
  @RequirePermissions('maintenance:workorder:read')
  async listWorkOrders(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.workflow.listWorkOrders(hotelId, status) };
  }

  @Post('work-orders')
  @RequirePermissions('maintenance:workorder:manage')
  async createWorkOrder(@CurrentUser() user: JwtPayload, @Body() dto: CreateWorkOrderSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.createWorkOrder(hotelId, dto, user.sub) };
  }

  @Patch('work-orders/:id/assign')
  @RequirePermissions('maintenance:workorder:manage')
  async assignWorkOrder(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AssignWorkOrderSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.assignWorkOrder(hotelId, id, dto, user.sub) };
  }

  @Patch('work-orders/:id/status')
  @RequirePermissions('maintenance:workorder:manage')
  async updateWoStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWorkOrderStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.workflow.updateWorkOrderStatus(hotelId, id, dto, user.sub) };
  }

  @Post('work-orders/:id/parts')
  @RequirePermissions('maintenance:workorder:manage')
  async addPart(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AddWorkOrderPartSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.addWorkOrderPart(hotelId, id, dto, user.sub) };
  }

  @Get('preventive')
  @RequirePermissions('maintenance:asset:read')
  async listPm(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listPmPlans(hotelId) };
  }

  @Post('preventive')
  @RequirePermissions('maintenance:asset:manage')
  async createPm(@CurrentUser() user: JwtPayload, @Body() dto: CreatePmPlanSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createPmPlan(hotelId, dto) };
  }

  @Post('preventive/generate')
  @RequirePermissions('maintenance:asset:manage')
  async generatePm(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.generatePmWorkOrders(hotelId, user.sub) };
  }

  @Get('amc')
  @RequirePermissions('maintenance:asset:read')
  async listAmc(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listAmcContracts(hotelId) };
  }

  @Post('amc')
  @RequirePermissions('maintenance:asset:manage')
  async createAmc(@CurrentUser() user: JwtPayload, @Body() dto: CreateAmcContractSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createAmcContract(hotelId, dto) };
  }

  @Get('warranty')
  @RequirePermissions('maintenance:asset:read')
  async listWarranty(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listWarrantyClaims(hotelId) };
  }

  @Post('warranty')
  @RequirePermissions('maintenance:asset:manage')
  async createWarranty(@CurrentUser() user: JwtPayload, @Body() dto: CreateWarrantyClaimSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createWarrantyClaim(hotelId, dto) };
  }

  @Get('technicians')
  @RequirePermissions('maintenance:workorder:read')
  async listTechnicians(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listTechnicians(hotelId) };
  }

  @Get('inspections')
  @RequirePermissions('maintenance:asset:read')
  async listInspections(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listInspections(hotelId) };
  }

  @Post('inspections')
  @RequirePermissions('maintenance:asset:manage')
  async createInspection(@CurrentUser() user: JwtPayload, @Body() dto: CreateEamInspectionSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createInspection(hotelId, dto, user.sub) };
  }

  @Get('safety')
  @RequirePermissions('maintenance:asset:read')
  async listSafety(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listSafetyRecords(hotelId) };
  }

  @Get('energy')
  @RequirePermissions('maintenance:asset:read')
  async getEnergy(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getEnergyStats(hotelId) };
  }

  @Post('energy')
  @RequirePermissions('maintenance:asset:manage')
  async recordEnergy(@CurrentUser() user: JwtPayload, @Body() dto: CreateEnergyReadingSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.recordEnergyReading(hotelId, dto) };
  }

  @Get('analytics')
  @RequirePermissions('maintenance:asset:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getAnalytics(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('maintenance:asset:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getReport(hotelId, type) };
  }
}
