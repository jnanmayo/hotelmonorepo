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
import { TmsDashboardService } from '@/modules/travel-desk/services/tms-dashboard.service';
import { TmsFleetService } from '@/modules/travel-desk/services/tms-fleet.service';
import { TmsOperationsService } from '@/modules/travel-desk/services/tms-operations.service';
import { TmsTripService } from '@/modules/travel-desk/services/tms-trip.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  AssignTmsTripSchema,
  CreateFuelLogSchema,
  CreateShuttleRouteSchema,
  CreateTmsDriverSchema,
  CreateTmsTripSchema,
  CreateTmsVehicleSchema,
  CreateTravelRequestSchema,
  CreateTravelVendorSchema,
  CreateTripPaymentSchema,
  RecordGpsSchema,
  UpdateTmsTripStatusSchema,
} from '@tungaos/shared';

@ApiTags('Travel Desk')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('travel-desk')
export class TravelDeskController {
  constructor(
    private dashboard: TmsDashboardService,
    private fleet: TmsFleetService,
    private trips: TmsTripService,
    private operations: TmsOperationsService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('travel-desk:trip:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('owner-dashboard')
  @RequirePermissions('travel-desk:trip:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOwnerDashboard(hotelId) };
  }

  @Get('dispatch')
  @RequirePermissions('travel-desk:dispatch:read')
  async getDispatch(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDispatch(hotelId) };
  }

  @Get('analytics')
  @RequirePermissions('travel-desk:report:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getAnalytics(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('travel-desk:trip:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.fleet.seedDefaults(hotelId, user.sub) };
  }

  @Get('requests')
  @RequirePermissions('travel-desk:trip:read')
  async listRequests(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.trips.listRequests(hotelId) };
  }

  @Post('requests')
  @RequirePermissions('travel-desk:trip:create')
  async createRequest(@CurrentUser() user: JwtPayload, @Body() dto: CreateTravelRequestSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.trips.createRequest(hotelId, dto, user.sub) };
  }

  @Get('trips')
  @RequirePermissions('travel-desk:trip:read')
  async listTrips(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.trips.listTrips(hotelId, status) };
  }

  @Post('trips')
  @RequirePermissions('travel-desk:trip:create')
  async createTrip(@CurrentUser() user: JwtPayload, @Body() dto: CreateTmsTripSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.trips.createTrip(hotelId, dto, user.sub) };
  }

  @Patch('trips/:id/assign')
  @RequirePermissions('travel-desk:dispatch:manage')
  async assignTrip(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AssignTmsTripSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.trips.assignTrip(hotelId, id, dto) };
  }

  @Patch('trips/:id/status')
  @RequirePermissions('travel-desk:trip:update')
  async updateTripStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTmsTripStatusSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.trips.updateStatus(hotelId, id, dto) };
  }

  @Get('airport-transfers')
  @RequirePermissions('travel-desk:trip:read')
  async listAirport(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.trips.listAirportTransfers(hotelId) };
  }

  @Get('corporate-trips')
  @RequirePermissions('travel-desk:trip:read')
  async listCorporate(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.trips.listCorporateTrips(hotelId) };
  }

  @Get('calendar')
  @RequirePermissions('travel-desk:trip:read')
  async getCalendar(@CurrentUser() user: JwtPayload, @Query('month') month?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.trips.getCalendar(hotelId, month) };
  }

  @Get('vehicles')
  @RequirePermissions('travel-desk:vehicle:read')
  async listVehicles(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.fleet.listVehicles(hotelId) };
  }

  @Post('vehicles')
  @RequirePermissions('travel-desk:vehicle:manage')
  async createVehicle(@CurrentUser() user: JwtPayload, @Body() dto: CreateTmsVehicleSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.fleet.createVehicle(hotelId, dto, user.sub) };
  }

  @Get('drivers')
  @RequirePermissions('travel-desk:driver:read')
  async listDrivers(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.fleet.listDrivers(hotelId) };
  }

  @Post('drivers')
  @RequirePermissions('travel-desk:driver:manage')
  async createDriver(@CurrentUser() user: JwtPayload, @Body() dto: CreateTmsDriverSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.fleet.createDriver(hotelId, dto, user.sub) };
  }

  @Patch('drivers/:id/duty')
  @RequirePermissions('travel-desk:driver:manage')
  async toggleDuty(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: { onDuty: boolean },
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.fleet.toggleDriverDuty(hotelId, id, body.onDuty) };
  }

  @Get('vendors')
  @RequirePermissions('travel-desk:trip:read')
  async listVendors(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.fleet.listVendors(hotelId) };
  }

  @Post('vendors')
  @RequirePermissions('travel-desk:trip:manage')
  async createVendor(@CurrentUser() user: JwtPayload, @Body() dto: CreateTravelVendorSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.fleet.createVendor(hotelId, dto) };
  }

  @Get('fuel')
  @RequirePermissions('travel-desk:vehicle:read')
  async listFuel(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listFuelLogs(hotelId) };
  }

  @Post('fuel')
  @RequirePermissions('travel-desk:vehicle:manage')
  async createFuel(@CurrentUser() user: JwtPayload, @Body() dto: CreateFuelLogSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createFuelLog(hotelId, dto, user.sub) };
  }

  @Get('maintenance')
  @RequirePermissions('travel-desk:vehicle:read')
  async listMaintenance(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listMaintenance(hotelId) };
  }

  @Get('billing')
  @RequirePermissions('travel-desk:trip:read')
  async listBilling(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listPayments(hotelId) };
  }

  @Post('billing')
  @RequirePermissions('travel-desk:trip:manage')
  async createPayment(@CurrentUser() user: JwtPayload, @Body() dto: CreateTripPaymentSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createPayment(hotelId, dto) };
  }

  @Get('shuttle-routes')
  @RequirePermissions('travel-desk:trip:read')
  async listShuttle(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listShuttleRoutes(hotelId) };
  }

  @Post('shuttle-routes')
  @RequirePermissions('travel-desk:trip:manage')
  async createShuttle(@CurrentUser() user: JwtPayload, @Body() dto: CreateShuttleRouteSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createShuttleRoute(hotelId, dto) };
  }

  @Get('gps')
  @RequirePermissions('travel-desk:dispatch:read')
  async listGps(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listGpsLogs(hotelId) };
  }

  @Post('gps')
  @RequirePermissions('travel-desk:dispatch:manage')
  async recordGps(@CurrentUser() user: JwtPayload, @Body() dto: RecordGpsSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.recordGps(hotelId, dto) };
  }

  @Get('reports/:type')
  @RequirePermissions('travel-desk:report:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.getReport(hotelId, type) };
  }
}
