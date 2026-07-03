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
import { FrontDeskDashboardService } from '@/modules/front-desk/services/front-desk-dashboard.service';
import { FrontDeskOperationsService } from '@/modules/front-desk/services/front-desk-operations.service';
import { FrontDeskSupportService } from '@/modules/front-desk/services/front-desk-support.service';
import { PmsCalendarService } from '@/modules/pms/services/pms-calendar.service';
import { PmsCheckOutService } from '@/modules/pms/services/pms-checkout.service';
import { PmsCheckInService } from '@/modules/pms/services/pms-checkin.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  AssignRoomSchema,
  CheckInStepSchema,
  CheckOutSchema,
  CollectPaymentSchema,
  ComplaintSchema,
  GuestRequestSchema,
  KeyCardSchema,
  LostFoundSchema,
  WalkInSchema,
} from '@tungaos/shared';
import type { SendCommunicationInput } from '@tungaos/shared';

@ApiTags('Front Desk')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('front-desk')
export class FrontDeskController {
  constructor(
    private dashboard: FrontDeskDashboardService,
    private operations: FrontDeskOperationsService,
    private support: FrontDeskSupportService,
    private calendar: PmsCalendarService,
    private checkIn: PmsCheckInService,
    private checkOut: PmsCheckOutService,
  ) {}

  private hid(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('frontdesk:operations:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('performance')
  @RequirePermissions('frontdesk:operations:read')
  async performance(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getPerformance(hotelId) };
  }

  @Get('arrivals')
  @RequirePermissions('frontdesk:operations:read')
  async arrivals(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.getArrivalBoard(hotelId) };
  }

  @Get('departures')
  @RequirePermissions('frontdesk:operations:read')
  async departures(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.getDepartureBoard(hotelId) };
  }

  @Post('walk-in')
  @RequirePermissions('frontdesk:operations:create')
  async walkIn(@CurrentUser() user: JwtPayload, @Body() body: WalkInSchema) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.walkIn(hotelId, body, user.sub) };
  }

  @Post('assign-room')
  @RequirePermissions('frontdesk:operations:update')
  async assignRoom(@CurrentUser() user: JwtPayload, @Body() body: AssignRoomSchema) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.assignRoom(hotelId, body, user.sub) };
  }

  @Get('room-suggestions/:reservationId')
  @RequirePermissions('frontdesk:operations:read')
  async roomSuggestions(@CurrentUser() user: JwtPayload, @Param('reservationId') reservationId: string) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.suggestRooms(hotelId, reservationId) };
  }

  @Get('folio/:reservationId')
  @RequirePermissions('frontdesk:operations:read')
  async folio(@CurrentUser() user: JwtPayload, @Param('reservationId') reservationId: string) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.getFolio(hotelId, reservationId) };
  }

  @Post('payments')
  @RequirePermissions('frontdesk:operations:update')
  async collectPayment(@CurrentUser() user: JwtPayload, @Body() body: CollectPaymentSchema) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.collectPayment(hotelId, body, user.sub) };
  }

  @Post('check-in/:reservationId/start')
  @RequirePermissions('frontdesk:operations:update')
  async startCheckIn(@CurrentUser() user: JwtPayload, @Param('reservationId') reservationId: string) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.startCheckIn(hotelId, reservationId, user.sub) };
  }

  @Post('check-in/:reservationId/step')
  @RequirePermissions('frontdesk:operations:update')
  async checkInStep(
    @CurrentUser() user: JwtPayload,
    @Param('reservationId') reservationId: string,
    @Body() body: CheckInStepSchema,
  ) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkIn.advanceStep(hotelId, reservationId, body, user.sub) };
  }

  @Get('check-out/:reservationId')
  @RequirePermissions('frontdesk:operations:read')
  async checkOutWorkflow(@CurrentUser() user: JwtPayload, @Param('reservationId') reservationId: string) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkOut.getWorkflow(hotelId, reservationId) };
  }

  @Post('check-out/:reservationId/complete')
  @RequirePermissions('frontdesk:operations:update')
  async completeCheckOut(
    @CurrentUser() user: JwtPayload,
    @Param('reservationId') reservationId: string,
    @Body() body: CheckOutSchema,
  ) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkOut.complete(hotelId, reservationId, body, user.sub) };
  }

  @Get('calendar')
  @RequirePermissions('frontdesk:operations:read')
  async getCalendar(
    @CurrentUser() user: JwtPayload,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('view') view?: 'daily' | 'weekly' | 'monthly',
  ) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.calendar.getCalendar(hotelId, start, end, view) };
  }

  @Get('search')
  @RequirePermissions('frontdesk:operations:read')
  async search(@CurrentUser() user: JwtPayload, @Query('q') q: string) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.search(hotelId, q) };
  }

  @Get('complaints')
  @RequirePermissions('frontdesk:operations:read')
  async complaints(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listComplaints(hotelId) };
  }

  @Post('complaints')
  @RequirePermissions('frontdesk:operations:create')
  async createComplaint(@CurrentUser() user: JwtPayload, @Body() body: ComplaintSchema) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createComplaint(hotelId, body, user.sub) };
  }

  @Get('guest-requests')
  @RequirePermissions('frontdesk:operations:read')
  async guestRequests(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listGuestRequests(hotelId) };
  }

  @Post('guest-requests')
  @RequirePermissions('frontdesk:operations:create')
  async createGuestRequest(@CurrentUser() user: JwtPayload, @Body() body: GuestRequestSchema) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createGuestRequest(hotelId, body, user.sub) };
  }

  @Get('tasks')
  @RequirePermissions('frontdesk:operations:read')
  async tasks(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listTasks(hotelId) };
  }

  @Post('tasks')
  @RequirePermissions('frontdesk:operations:create')
  async createTask(@CurrentUser() user: JwtPayload, @Body() body: Record<string, unknown>) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createTask(hotelId, body as never, user.sub) };
  }

  @Get('lost-found')
  @RequirePermissions('frontdesk:operations:read')
  async lostFound(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listLostFound(hotelId) };
  }

  @Post('lost-found')
  @RequirePermissions('frontdesk:operations:create')
  async createLostFound(@CurrentUser() user: JwtPayload, @Body() body: LostFoundSchema) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createLostFound(hotelId, body, user.sub) };
  }

  @Get('communications')
  @RequirePermissions('frontdesk:operations:read')
  async communications(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listCommunications(hotelId) };
  }

  @Post('communications')
  @RequirePermissions('frontdesk:operations:create')
  async sendCommunication(@CurrentUser() user: JwtPayload, @Body() body: SendCommunicationInput) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.sendCommunication(hotelId, body, user.sub) };
  }

  @Get('key-cards')
  @RequirePermissions('frontdesk:operations:read')
  async keyCards(@CurrentUser() user: JwtPayload, @Query('reservationId') reservationId?: string) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listKeyCards(hotelId, reservationId) };
  }

  @Post('key-cards')
  @RequirePermissions('frontdesk:operations:create')
  async issueKeyCard(@CurrentUser() user: JwtPayload, @Body() body: KeyCardSchema) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.issueKeyCard(hotelId, body, user.sub) };
  }

  @Patch('key-cards/:id/deactivate')
  @RequirePermissions('frontdesk:operations:update')
  async deactivateKey(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body('reason') reason: string) {
    const hotelId = this.hid(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.deactivateKeyCard(hotelId, id, reason ?? 'DEACTIVATED', user.sub) };
  }
}
