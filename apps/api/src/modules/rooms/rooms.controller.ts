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
import { RoomStatus } from '@prisma/client';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PmsCalendarService } from '@/modules/pms/services/pms-calendar.service';
import { RoomAllocationService } from '@/modules/rooms/services/room-allocation.service';
import { RoomDashboardService } from '@/modules/rooms/services/room-dashboard.service';
import {
  RoomAssetService,
  RoomOperationsService,
  RoomReportService,
} from '@/modules/rooms/services/room-operations.service';
import { RoomPricingService, RoomRevenueService } from '@/modules/rooms/services/room-pricing.service';
import { RoomPropertyService } from '@/modules/rooms/services/room-property.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  CreateAmenitySchema,
  CreateBuildingSchema,
  CreateDamageSchema,
  CreateFloorSchema,
  CreateInspectionSchema,
  CreateRoomSchema,
  CreateRoomTypeSchema,
  RoomAllocationSchema,
  UpdateRoomStatusSchema,
} from '@tungaos/shared';
import type { RoomBlockSchema } from '@tungaos/shared';

@ApiTags('Room Management')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('rooms')
export class RoomsController {
  constructor(
    private dashboard: RoomDashboardService,
    private property: RoomPropertyService,
    private allocation: RoomAllocationService,
    private pricing: RoomPricingService,
    private revenue: RoomRevenueService,
    private operations: RoomOperationsService,
    private assets: RoomAssetService,
    private reports: RoomReportService,
    private calendar: PmsCalendarService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  // ─── Static routes (must precede :id) ─────────────────────────────────────

  @Get('dashboard')
  @RequirePermissions('rooms:room:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('dashboard/owner')
  @RequirePermissions('reports:report:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOwnerStats(hotelId) };
  }

  @Get('inventory')
  @RequirePermissions('rooms:room:read')
  async inventory(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.property.getInventory(hotelId) };
  }

  @Get('search')
  @RequirePermissions('rooms:room:read')
  async search(@CurrentUser() user: JwtPayload, @Query('q') q: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.property.search(hotelId, q ?? '') };
  }

  @Get('amenities')
  @RequirePermissions('rooms:room:read')
  async amenities(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.property.listAmenities(hotelId) };
  }

  @Get('pricing/plans')
  @RequirePermissions('rooms:room:read')
  async pricingPlans(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.pricing.listPlans(hotelId) };
  }

  @Get('pricing/dynamic')
  @RequirePermissions('rooms:room:read')
  async dynamicPricing(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.pricing.getDynamicRules(hotelId) };
  }

  @Get('revenue/stats')
  @RequirePermissions('reports:report:read')
  async revenueStats(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.revenue.getStats(hotelId) };
  }

  @Get('blocks')
  @RequirePermissions('rooms:room:read')
  async blocks(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listBlocks(hotelId) };
  }

  @Get('maintenance')
  @RequirePermissions('rooms:room:read')
  async maintenance(@CurrentUser() user: JwtPayload, @Query('roomId') roomId?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listMaintenance(hotelId, roomId) };
  }

  @Get('inspections')
  @RequirePermissions('rooms:room:read')
  async inspections(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listInspections(hotelId) };
  }

  @Get('damages')
  @RequirePermissions('rooms:room:read')
  async damages(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listDamages(hotelId) };
  }

  @Get('assets/all')
  @RequirePermissions('rooms:room:read')
  async allAssets(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.assets.listAll(hotelId) };
  }

  @Get('calendar/availability')
  @RequirePermissions('rooms:room:read')
  async availabilityCalendar(
    @CurrentUser() user: JwtPayload,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.calendar.getAvailability(hotelId, from, to) };
  }

  @Get('reports/:type')
  @RequirePermissions('reports:report:read')
  async report(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reports.generate(hotelId, type) };
  }

  @Post('amenities')
  @RequirePermissions('rooms:room:manage')
  async createAmenity(@CurrentUser() user: JwtPayload, @Body() body: CreateAmenitySchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.property.createAmenity(hotelId, body, user.sub) };
  }

  @Post('buildings')
  @RequirePermissions('rooms:room:manage')
  async createBuilding(@CurrentUser() user: JwtPayload, @Body() body: CreateBuildingSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.property.createBuilding(hotelId, body, user.sub) };
  }

  @Post('floors')
  @RequirePermissions('rooms:room:manage')
  async createFloor(@CurrentUser() user: JwtPayload, @Body() body: CreateFloorSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.property.createFloor(hotelId, body, user.sub) };
  }

  @Post('types')
  @RequirePermissions('rooms:room:manage')
  async createRoomType(@CurrentUser() user: JwtPayload, @Body() body: CreateRoomTypeSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.property.createRoomType(hotelId, body, user.sub) };
  }

  @Post('allocation/suggest')
  @RequirePermissions('rooms:room:update')
  async suggestAllocation(@CurrentUser() user: JwtPayload, @Body() body: RoomAllocationSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.allocation.suggest(hotelId, body) };
  }

  @Post('allocation/auto')
  @RequirePermissions('rooms:room:update')
  async autoAllocate(
    @CurrentUser() user: JwtPayload,
    @Body() body: { reservationId: string },
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.allocation.autoAssign(hotelId, body.reservationId, user.sub) };
  }

  @Post('blocks')
  @RequirePermissions('rooms:room:update')
  async createBlock(@CurrentUser() user: JwtPayload, @Body() body: RoomBlockSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createBlock(hotelId, body, user.sub) };
  }

  @Post('inspections')
  @RequirePermissions('rooms:room:update')
  async createInspection(@CurrentUser() user: JwtPayload, @Body() body: CreateInspectionSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createInspection(hotelId, body, user.sub) };
  }

  @Post('damages')
  @RequirePermissions('rooms:room:update')
  async createDamage(@CurrentUser() user: JwtPayload, @Body() body: CreateDamageSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createDamage(hotelId, body, user.sub) };
  }

  // ─── Collection routes ────────────────────────────────────────────────────

  @Get()
  @RequirePermissions('rooms:room:read')
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: RoomStatus,
    @Query('search') search?: string,
    @Query('buildingId') buildingId?: string,
    @Query('floorId') floorId?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.property.listRooms(hotelId, { status, search, buildingId, floorId }) };
  }

  @Post()
  @RequirePermissions('rooms:room:manage')
  async createRoom(@CurrentUser() user: JwtPayload, @Body() body: CreateRoomSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.property.createRoom(hotelId, body, user.sub) };
  }

  // ─── Parameterized routes (must be last) ──────────────────────────────────

  @Get(':id/timeline')
  @RequirePermissions('rooms:room:read')
  async timeline(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.property.getTimeline(hotelId, id) };
  }

  @Get(':id/revenue')
  @RequirePermissions('reports:report:read')
  async roomRevenue(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.revenue.getStats(hotelId, id) };
  }

  @Get(':id/assets')
  @RequirePermissions('rooms:room:read')
  async roomAssets(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.assets.listByRoom(hotelId, id) };
  }

  @Patch(':id/status')
  @RequirePermissions('rooms:room:update')
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateRoomStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.updateStatus(hotelId, id, body, user.sub) };
  }

  @Get(':id')
  @RequirePermissions('rooms:room:read')
  async profile(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.property.getProfile(hotelId, id) };
  }
}
