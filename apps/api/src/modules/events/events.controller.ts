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
import { EventsDashboardService } from '@/modules/events/services/events-dashboard.service';
import { EventsOperationsService } from '@/modules/events/services/events-operations.service';
import { EventsSalesService } from '@/modules/events/services/events-sales.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  CreateBanquetHallSchema,
  CreateEventLeadSchema,
  CreateEventQuotationSchema,
  CreateEventTaskSchema,
  UpdateEventLeadStatusSchema,
  UpdateEventTaskStatusSchema,
} from '@tungaos/shared';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('events')
export class EventsController {
  constructor(
    private dashboard: EventsDashboardService,
    private sales: EventsSalesService,
    private operations: EventsOperationsService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('events:booking:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('owner-dashboard')
  @RequirePermissions('events:booking:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOwnerDashboard(hotelId) };
  }

  @Get('operations-dashboard')
  @RequirePermissions('events:booking:read')
  async getOperationsDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOperationsDashboard(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('events:booking:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.sales.seedDefaults(hotelId) };
  }

  @Get('leads')
  @RequirePermissions('events:lead:read')
  async listLeads(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.sales.listLeads(hotelId, status) };
  }

  @Post('leads')
  @RequirePermissions('events:lead:create')
  async createLead(@CurrentUser() user: JwtPayload, @Body() dto: CreateEventLeadSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.sales.createLead(hotelId, dto, user.sub) };
  }

  @Patch('leads/:id/status')
  @RequirePermissions('events:lead:update')
  async updateLeadStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateEventLeadStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.sales.updateLeadStatus(hotelId, id, dto) };
  }

  @Get('clients')
  @RequirePermissions('events:booking:read')
  async listClients(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.sales.listClients(hotelId) };
  }

  @Get('halls')
  @RequirePermissions('events:booking:read')
  async listHalls(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listHalls(hotelId) };
  }

  @Post('halls')
  @RequirePermissions('events:booking:manage')
  async createHall(@CurrentUser() user: JwtPayload, @Body() dto: CreateBanquetHallSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createHall(hotelId, dto) };
  }

  @Get('calendar')
  @RequirePermissions('events:booking:read')
  async getCalendar(
    @CurrentUser() user: JwtPayload,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.getCalendar(hotelId, from, to) };
  }

  @Get('bookings')
  @RequirePermissions('events:booking:read')
  async listBookings(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listBookings(hotelId) };
  }

  @Get('quotations')
  @RequirePermissions('events:booking:read')
  async listQuotations(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.sales.listQuotations(hotelId) };
  }

  @Post('quotations')
  @RequirePermissions('events:booking:manage')
  async createQuotation(@CurrentUser() user: JwtPayload, @Body() dto: CreateEventQuotationSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.sales.createQuotation(hotelId, dto) };
  }

  @Get('packages')
  @RequirePermissions('events:booking:read')
  async listPackages(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listPackages(hotelId) };
  }

  @Get('menus')
  @RequirePermissions('events:booking:read')
  async listMenus(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listMenus(hotelId) };
  }

  @Get('seating')
  @RequirePermissions('events:booking:read')
  async listSeating(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listSeatingPlans(hotelId) };
  }

  @Get('tasks')
  @RequirePermissions('events:booking:read')
  async listTasks(@CurrentUser() user: JwtPayload, @Query('eventId') eventId?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listTasks(hotelId, eventId) };
  }

  @Post('tasks')
  @RequirePermissions('events:booking:manage')
  async createTask(@CurrentUser() user: JwtPayload, @Body() dto: CreateEventTaskSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createTask(hotelId, dto) };
  }

  @Patch('tasks/:id/status')
  @RequirePermissions('events:booking:manage')
  async updateTaskStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateEventTaskStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.updateTaskStatus(hotelId, id, dto) };
  }

  @Get('resources')
  @RequirePermissions('events:booking:read')
  async listResources(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listResources(hotelId) };
  }

  @Get('room-blocks')
  @RequirePermissions('events:booking:read')
  async listRoomBlocks(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listRoomBlocks(hotelId) };
  }

  @Get('payments')
  @RequirePermissions('events:booking:read')
  async listPayments(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.sales.listPayments(hotelId) };
  }

  @Get('contracts')
  @RequirePermissions('events:booking:read')
  async listContracts(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.sales.listContracts(hotelId) };
  }

  @Get('vendors')
  @RequirePermissions('events:booking:read')
  async listVendors(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listVendors(hotelId) };
  }

  @Get('checklists')
  @RequirePermissions('events:booking:read')
  async listChecklists(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listChecklists(hotelId) };
  }

  @Get('timeline')
  @RequirePermissions('events:booking:read')
  async listTimeline(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listTimeline(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('reports:report:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getReport(hotelId, type) };
  }
}
