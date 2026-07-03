import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { BookingService } from '@/modules/booking/services/booking.service';

import type { JwtPayload } from '@tungaos/shared';

@ApiTags('Booking Admin')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('booking')
export class AdminBookingController {
  constructor(private booking: BookingService) {}

  @Get('dashboard')
  @RequirePermissions('reservations:booking:read')
  async dashboard(@CurrentUser() user: JwtPayload) {
    if (!user.hotelId) return { data: null };
    const data = await this.booking.getDashboardStats(user.hotelId);
    return { data };
  }

  @Get('reservations')
  @RequirePermissions('reservations:booking:read')
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    if (!user.hotelId) return { data: { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } } };
    const data = await this.booking.listBookings(user.hotelId, Number(page), Number(limit));
    return { data };
  }
}
