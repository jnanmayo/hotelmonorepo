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
import { BillStatus, KitchenOrderStatus } from '@prisma/client';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { FnbDashboardService } from '@/modules/restaurant/services/fnb-dashboard.service';
import {
  FnbKitchenService,
  FnbOutletService,
  FnbPosService,
  FnbReportService,
} from '@/modules/restaurant/services/fnb-pos.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  AddBillItemSchema,
  CloseBillSchema,
  CreateBillSchema,
  CreateMenuItemSchema,
  CreateTableSchema,
  RoomServiceOrderSchema,
  UpdateKitchenStatusSchema,
} from '@tungaos/shared';

@ApiTags('Restaurant POS')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('restaurant')
export class RestaurantController {
  constructor(
    private dashboard: FnbDashboardService,
    private pos: FnbPosService,
    private outlet: FnbOutletService,
    private kitchen: FnbKitchenService,
    private reports: FnbReportService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('restaurant:order:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('outlets')
  @RequirePermissions('restaurant:order:read')
  async outlets(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.outlet.listOutlets(hotelId) };
  }

  @Post('outlets/seed')
  @RequirePermissions('restaurant:order:create')
  async seedOutlets(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.outlet.seedDefaults(hotelId, user.sub) };
  }

  @Get('tables')
  @RequirePermissions('restaurant:order:read')
  async tables(@CurrentUser() user: JwtPayload, @Query('restaurantId') restaurantId?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.outlet.listTables(hotelId, restaurantId) };
  }

  @Post('tables')
  @RequirePermissions('restaurant:order:create')
  async createTable(@CurrentUser() user: JwtPayload, @Body() body: CreateTableSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.outlet.createTable(hotelId, body, user.sub) };
  }

  @Get('menu')
  @RequirePermissions('restaurant:order:read')
  async menu(@CurrentUser() user: JwtPayload, @Query('restaurantId') restaurantId?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.outlet.listMenu(hotelId, restaurantId) };
  }

  @Post('menu')
  @RequirePermissions('restaurant:order:create')
  async createMenuItem(@CurrentUser() user: JwtPayload, @Body() body: CreateMenuItemSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.outlet.createMenuItem(hotelId, body, user.sub) };
  }

  @Get('bills')
  @RequirePermissions('restaurant:order:read')
  async bills(@CurrentUser() user: JwtPayload, @Query('status') status?: BillStatus) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.pos.listBills(hotelId, status) };
  }

  @Post('bills')
  @RequirePermissions('restaurant:order:create')
  async createBill(@CurrentUser() user: JwtPayload, @Body() body: CreateBillSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.pos.createBill(hotelId, body, user.sub) };
  }

  @Post('room-service')
  @RequirePermissions('restaurant:order:create')
  async roomService(@CurrentUser() user: JwtPayload, @Body() body: RoomServiceOrderSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.pos.roomServiceOrder(hotelId, body, user.sub) };
  }

  @Get('kitchen/orders')
  @RequirePermissions('restaurant:order:read')
  async kitchenOrders(@CurrentUser() user: JwtPayload, @Query('status') status?: KitchenOrderStatus) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.kitchen.listOrders(hotelId, status) };
  }

  @Get('reports/:type')
  @RequirePermissions('restaurant:order:read')
  async report(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reports.generate(hotelId, type) };
  }

  @Post('bills/:id/items')
  @RequirePermissions('restaurant:order:create')
  async addItem(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: AddBillItemSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.pos.addItem(hotelId, id, body, user.sub) };
  }

  @Post('bills/:id/close')
  @RequirePermissions('restaurant:order:update')
  async closeBill(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: CloseBillSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.pos.closeBill(hotelId, id, body, user.sub) };
  }

  @Get('bills/:id')
  @RequirePermissions('restaurant:order:read')
  async getBill(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.pos.getBill(hotelId, id) };
  }

  @Patch('kitchen/orders/:id/status')
  @RequirePermissions('restaurant:order:update')
  async updateKitchenStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateKitchenStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.kitchen.updateStatus(hotelId, id, body.status as KitchenOrderStatus, user.sub) };
  }
}
