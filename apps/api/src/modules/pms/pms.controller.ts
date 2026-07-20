import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservationStatus, RoomStatus } from '@prisma/client';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PmsCalendarService } from '@/modules/pms/services/pms-calendar.service';
import { PmsCheckInService } from '@/modules/pms/services/pms-checkin.service';
import { PmsCheckOutService } from '@/modules/pms/services/pms-checkout.service';
import { PmsDashboardService } from '@/modules/pms/services/pms-dashboard.service';
import { PmsGuestService } from '@/modules/pms/services/pms-guest.service';
import {
  PmsNightAuditService,
  PmsReportService,
  PmsSearchService,
} from '@/modules/pms/services/pms-report.service';
import { PmsReservationService } from '@/modules/pms/services/pms-reservation.service';
import { PmsRoomService } from '@/modules/pms/services/pms-room.service';
import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  CheckInStepSchema,
  CheckOutSchema,
  CreatePmsReservationSchema,
  FolioChargeSchema,
  GuestProfileSchema,
  RoomBlockSchema,
  RoomTransferSchema,
  UpdatePmsReservationSchema,
} from '@tungaos/shared';

@ApiTags('PMS')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('pms')
export class PmsController {
  constructor(
    private dashboard: PmsDashboardService,
    private reservations: PmsReservationService,
    private guests: PmsGuestService,
    private rooms: PmsRoomService,
    private checkIn: PmsCheckInService,
    private checkOut: PmsCheckOutService,
    private calendar: PmsCalendarService,
    private search: PmsSearchService,
    private reports: PmsReportService,
    private nightAudit: PmsNightAuditService,
    private prisma: PrismaService,
  ) {}

  private hotelId(user: JwtPayload) {
    if (!user.hotelId) return null;
    return user.hotelId;
  }

  // ─── Dashboard ───────────────────────────────────────────────────────────

  @Get('dashboard')
  @RequirePermissions('dashboard:overview:read')
  async executiveDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getExecutiveDashboard(hotelId) };
  }

  @Get('dashboard/owner')
  @RequirePermissions('reports:report:read')
  async ownerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOwnerDashboard(hotelId) };
  }

  // ─── Reservations ────────────────────────────────────────────────────────

  @Get('reservations')
  @RequirePermissions('reservations:booking:read')
  async listReservations(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ReservationStatus,
    @Query('search') search?: string,
    @Query('checkInFrom') checkInFrom?: string,
    @Query('checkInTo') checkInTo?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId)
      return { data: { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } } };
    return {
      data: await this.reservations.list(hotelId, {
        page: Number(page ?? 1),
        limit: Number(limit ?? 20),
        status,
        search,
        checkInFrom,
        checkInTo,
      }),
    };
  }

  @Get('reservations/:id')
  @RequirePermissions('reservations:booking:read')
  async getReservation(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reservations.getById(hotelId, id) };
  }

  @Post('reservations')
  @RequirePermissions('reservations:booking:create')
  async createReservation(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreatePmsReservationSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reservations.create(hotelId, body, user.sub) };
  }

  @Patch('reservations/:id')
  @RequirePermissions('reservations:booking:update')
  async updateReservation(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdatePmsReservationSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reservations.update(hotelId, id, body, user.sub) };
  }

  @Post('reservations/:id/cancel')
  @RequirePermissions('reservations:booking:update')
  async cancelReservation(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reservations.cancel(hotelId, id, reason ?? 'Cancelled', user.sub) };
  }

  @Post('reservations/:id/duplicate')
  @RequirePermissions('reservations:booking:create')
  async duplicateReservation(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reservations.duplicate(hotelId, id, user.sub) };
  }

  @Post('reservations/:id/transfer')
  @RequirePermissions('reservations:booking:update')
  async transferReservation(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('roomId') roomId: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reservations.transfer(hotelId, id, roomId, user.sub) };
  }

  // ─── Guests ──────────────────────────────────────────────────────────────

  @Get('guests')
  @RequirePermissions('crm:lead:read')
  async listGuests(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('vipOnly') vipOnly?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: { items: [], meta: {} } };
    return {
      data: await this.guests.list(hotelId, {
        page: Number(page ?? 1),
        limit: Number(limit ?? 20),
        search,
        vipOnly: vipOnly === 'true',
      }),
    };
  }

  @Get('guests/:id')
  @RequirePermissions('crm:lead:read')
  async getGuest(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.guests.getProfile(hotelId, id) };
  }

  @Post('guests')
  @RequirePermissions('crm:lead:create')
  async createGuest(@CurrentUser() user: JwtPayload, @Body() body: GuestProfileSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.guests.create(hotelId, body, user.sub) };
  }

  @Patch('guests/:id')
  @RequirePermissions('crm:lead:update')
  async updateGuest(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() body: Partial<GuestProfileSchema>,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.guests.update(hotelId, id, body, user.sub) };
  }

  // ─── Rooms ───────────────────────────────────────────────────────────────

  @Get('rooms')
  @RequirePermissions('rooms:room:read')
  async listRooms(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: RoomStatus,
    @Query('floorId') floorId?: string,
    @Query('buildingId') buildingId?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.rooms.listRooms(hotelId, { status, floorId, buildingId }) };
  }

  @Get('rooms/inventory')
  @RequirePermissions('rooms:room:read')
  async roomInventory(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.rooms.getInventory(hotelId) };
  }

  @Patch('rooms/:id/status')
  @RequirePermissions('rooms:room:update')
  async updateRoomStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body('status') status: RoomStatus,
    @Body('reason') reason?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.rooms.updateStatus(hotelId, id, status, reason, user.sub) };
  }

  @Post('rooms/blocks')
  @RequirePermissions('rooms:room:update')
  async blockRoom(@CurrentUser() user: JwtPayload, @Body() body: RoomBlockSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.rooms.createBlock(hotelId, body, user.sub) };
  }

  @Post('rooms/transfer')
  @RequirePermissions('rooms:room:update')
  async roomTransfer(@CurrentUser() user: JwtPayload, @Body() body: RoomTransferSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.rooms.roomTransfer(hotelId, body, user.sub) };
  }

  // ─── Check-in / Check-out ────────────────────────────────────────────────

  @Post('check-in/:reservationId/start')
  @RequirePermissions('reservations:booking:update')
  async startCheckIn(
    @CurrentUser() user: JwtPayload,
    @Param('reservationId') reservationId: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkIn.start(hotelId, reservationId, user.sub) };
  }

  @Get('check-in/:reservationId')
  @RequirePermissions('reservations:booking:read')
  async getCheckIn(@CurrentUser() user: JwtPayload, @Param('reservationId') reservationId: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkIn.getWorkflow(hotelId, reservationId) };
  }

  @Post('check-in/:reservationId/step')
  @RequirePermissions('reservations:booking:update')
  async advanceCheckIn(
    @CurrentUser() user: JwtPayload,
    @Param('reservationId') reservationId: string,
    @Body() body: CheckInStepSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkIn.advanceStep(hotelId, reservationId, body, user.sub) };
  }

  @Get('check-out/:reservationId')
  @RequirePermissions('reservations:booking:read')
  async getCheckOut(
    @CurrentUser() user: JwtPayload,
    @Param('reservationId') reservationId: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkOut.getWorkflow(hotelId, reservationId) };
  }

  @Post('check-out/:reservationId/complete')
  @RequirePermissions('reservations:booking:update')
  async completeCheckOut(
    @CurrentUser() user: JwtPayload,
    @Param('reservationId') reservationId: string,
    @Body() body: CheckOutSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkOut.complete(hotelId, reservationId, body, user.sub) };
  }

  @Post('folio/charges')
  @RequirePermissions('finance:ledger:create')
  async postFolioCharge(@CurrentUser() user: JwtPayload, @Body() body: FolioChargeSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.checkOut.postFolioCharge(hotelId, body, user.sub) };
  }

  @Post('folio/restaurant-charge')
  @RequirePermissions('finance:ledger:create')
  async restaurantCharge(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: { reservationId: string; amount: number; description: string; sourceRef?: string },
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return {
      data: await this.checkOut.postRestaurantCharge(
        hotelId,
        body.reservationId,
        body.amount,
        body.description,
        body.sourceRef,
      ),
    };
  }

  // ─── Calendar ────────────────────────────────────────────────────────────

  @Get('calendar')
  @RequirePermissions('reservations:booking:read', 'frontdesk:operations:read')
  async getCalendar(
    @CurrentUser() user: JwtPayload,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('view') view?: 'daily' | 'weekly' | 'monthly',
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.calendar.getCalendar(hotelId, start, end, view) };
  }

  @Get('calendar/availability')
  @RequirePermissions('reservations:booking:read')
  async availability(
    @CurrentUser() user: JwtPayload,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.calendar.getAvailability(hotelId, checkIn, checkOut) };
  }

  // ─── Search ──────────────────────────────────────────────────────────────

  @Get('search')
  @RequirePermissions('reservations:booking:read')
  async searchAll(@CurrentUser() user: JwtPayload, @Query('q') q: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.search.search(hotelId, q) };
  }

  // ─── Reports ─────────────────────────────────────────────────────────────

  @Get('reports/:type')
  @RequirePermissions('reports:report:read')
  async report(
    @CurrentUser() user: JwtPayload,
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.reports.generate(hotelId, type, from, to) };
  }

  // ─── Night Audit ─────────────────────────────────────────────────────────

  @Get('night-audit')
  @RequirePermissions('finance:ledger:read')
  async listNightAudits(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.nightAudit.list(hotelId) };
  }

  @Post('night-audit/run')
  @RequirePermissions('finance:ledger:manage')
  async runNightAudit(@CurrentUser() user: JwtPayload, @Body('auditDate') auditDate: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    const date = auditDate ?? new Date().toISOString().split('T')[0]!;
    return { data: await this.nightAudit.run(hotelId, date, user.sub) };
  }

  // ─── Groups & Corporate ──────────────────────────────────────────────────

  @Get('groups')
  @RequirePermissions('reservations:booking:read')
  async listGroups(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return {
      data: await this.prisma.groupBooking.findMany({
        where: { hotelId, deletedAt: null },
        include: { reservations: { include: { guest: true, room: true } } },
        orderBy: { checkInDate: 'desc' },
      }),
    };
  }

  @Get('corporate')
  @RequirePermissions('crm:lead:read')
  async listCorporate(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return {
      data: await this.prisma.corporateCompany.findMany({
        where: { hotelId, deletedAt: null },
        include: { contracts: true, bookings: true, employees: true },
      }),
    };
  }

  @Get('invoices')
  @RequirePermissions('finance:ledger:read')
  async listInvoices(
    @CurrentUser() user: JwtPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: { items: [], meta: {} } };
    const p = Number(page ?? 1);
    const l = Number(limit ?? 20);
    const [items, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { hotelId, deletedAt: null },
        include: { guest: true, lineItems: true },
        orderBy: { createdAt: 'desc' },
        skip: (p - 1) * l,
        take: l,
      }),
      this.prisma.invoice.count({ where: { hotelId, deletedAt: null } }),
    ]);
    return {
      data: { items, meta: { page: p, limit: l, total, totalPages: Math.ceil(total / l) } },
    };
  }
}
