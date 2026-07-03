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
import { HousekeepingStatus } from '@prisma/client';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { HkDashboardService } from '@/modules/housekeeping/services/hk-dashboard.service';
import { HkInspectionService } from '@/modules/housekeeping/services/hk-inspection.service';
import {
  HkLaundryService,
  HkLinenService,
  HkReportService,
  HkSupportService,
} from '@/modules/housekeeping/services/hk-laundry.service';
import { HkTaskService } from '@/modules/housekeeping/services/hk-task.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  AmenityRefillSchema,
  AssignHkTaskSchema,
  CreateHkTaskSchema,
  CreateLostFoundSchema,
  CreateLaundryOrderSchema,
  HkInspectionSchema,
  UpdateHkTaskStatusSchema,
  UpdateLaundryStatusSchema,
} from '@tungaos/shared';

@ApiTags('Housekeeping')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('housekeeping')
export class HousekeepingController {
  constructor(
    private dashboard: HkDashboardService,
    private tasks: HkTaskService,
    private inspection: HkInspectionService,
    private laundry: HkLaundryService,
    private linen: HkLinenService,
    private support: HkSupportService,
    private reports: HkReportService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('housekeeping:task:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('tasks')
  @RequirePermissions('housekeeping:task:read')
  async listTasks(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: HousekeepingStatus,
    @Query('staffId') staffId?: string,
    @Query('roomId') roomId?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.tasks.listTasks(hotelId, { status, staffId, roomId }) };
  }

  @Post('tasks')
  @RequirePermissions('housekeeping:task:create')
  async createTask(@CurrentUser() user: JwtPayload, @Body() body: CreateHkTaskSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.tasks.createTask(hotelId, body, user.sub) };
  }

  @Get('staff')
  @RequirePermissions('housekeeping:task:read')
  async listStaff(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.tasks.listStaff(hotelId) };
  }

  @Get('inspections')
  @RequirePermissions('housekeeping:task:read')
  async listInspections(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.inspection.list(hotelId) };
  }

  @Post('inspections')
  @RequirePermissions('housekeeping:task:update')
  async createInspection(@CurrentUser() user: JwtPayload, @Body() body: HkInspectionSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.inspection.inspect(hotelId, body, user.sub) };
  }

  @Get('laundry')
  @RequirePermissions('housekeeping:task:read')
  async listLaundry(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.laundry.listOrders(hotelId) };
  }

  @Post('laundry')
  @RequirePermissions('housekeeping:task:create')
  async createLaundry(@CurrentUser() user: JwtPayload, @Body() body: CreateLaundryOrderSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.laundry.createOrder(hotelId, body, user.sub) };
  }

  @Get('linen')
  @RequirePermissions('housekeeping:task:read')
  async listLinen(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.linen.list(hotelId) };
  }

  @Post('linen/seed')
  @RequirePermissions('housekeeping:task:manage')
  async seedLinen(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.linen.seedDefaults(hotelId) };
  }

  @Get('lost-found')
  @RequirePermissions('housekeeping:task:read')
  async listLostFound(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listLostFound(hotelId) };
  }

  @Post('lost-found')
  @RequirePermissions('housekeeping:task:create')
  async createLostFound(@CurrentUser() user: JwtPayload, @Body() body: CreateLostFoundSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createLostFound(hotelId, body, user.sub) };
  }

  @Get('guest-requests')
  @RequirePermissions('housekeeping:task:read')
  async listGuestRequests(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listGuestRequests(hotelId) };
  }

  @Get('deep-cleaning')
  @RequirePermissions('housekeeping:task:read')
  async listDeepCleaning(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listDeepCleaning(hotelId) };
  }

  @Post('amenity-refill')
  @RequirePermissions('housekeeping:task:update')
  async amenityRefill(@CurrentUser() user: JwtPayload, @Body() body: AmenityRefillSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.logAmenityRefill(hotelId, body, user.sub) };
  }

  @Get('reports/:type')
  @RequirePermissions('housekeeping:task:read')
  async report(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reports.generate(hotelId, type) };
  }

  @Post('tasks/:id/assign')
  @RequirePermissions('housekeeping:task:update')
  async assignTask(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: AssignHkTaskSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.tasks.assignTask(hotelId, id, body, user.sub) };
  }

  @Post('tasks/:id/auto-assign')
  @RequirePermissions('housekeeping:task:update')
  async autoAssign(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.tasks.autoAssign(hotelId, id, user.sub) };
  }

  @Patch('tasks/:id/status')
  @RequirePermissions('housekeeping:task:update')
  async updateTaskStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateHkTaskStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.tasks.updateStatus(hotelId, id, body, user.sub) };
  }

  @Patch('laundry/:id/status')
  @RequirePermissions('housekeeping:task:update')
  async updateLaundryStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateLaundryStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.laundry.updateStatus(hotelId, id, body) };
  }

  @Get('tasks/:id')
  @RequirePermissions('housekeeping:task:read')
  async getTask(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.tasks.getTask(hotelId, id) };
  }
}
