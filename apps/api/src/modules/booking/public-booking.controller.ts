import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/common/decorators/auth.decorators';
import { AvailabilityService } from '@/modules/booking/services/availability.service';
import { BookingService } from '@/modules/booking/services/booking.service';
import { PricingService } from '@/modules/booking/services/pricing.service';

import type {
  ApplyCouponInput,
  BookingQuoteInput,
  CreateBookingInput,
  CreateHoldInput,
} from '@tungaos/shared';

@ApiTags('Public Booking')
@Controller('public/booking')
export class PublicBookingController {
  constructor(
    private booking: BookingService,
    private pricing: PricingService,
    private availability: AvailabilityService,
  ) {}

  @Public()
  @Get('search')
  async search(
    @Query('hotelSlug') hotelSlug = 'tunga-international',
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('adults') adults = '2',
    @Query('children') children = '0',
    @Query('rooms') rooms = '1',
    @Query('sessionId') sessionId?: string,
  ) {
    const data = await this.booking.searchAvailability({
      hotelSlug,
      checkIn,
      checkOut,
      adults: Number(adults),
      children: Number(children),
      rooms: Number(rooms),
      sessionId,
    });
    return { data };
  }

  @Public()
  @Get('rooms/:roomTypeId')
  async roomDetail(
    @Param('roomTypeId') roomTypeId: string,
    @Query('hotelSlug') hotelSlug = 'tunga-international',
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('rooms') rooms = '1',
  ) {
    const data = await this.booking.getRoomDetail(hotelSlug, roomTypeId, checkIn, checkOut, Number(rooms));
    return { data };
  }

  @Public()
  @Get('addons')
  async addons(@Query('hotelSlug') hotelSlug = 'tunga-international') {
    const data = await this.booking.getAddons(hotelSlug);
    return { data };
  }

  @Public()
  @Post('quote')
  async quote(@Body() body: BookingQuoteInput) {
    const hotel = await this.booking.getHotelBySlug(body.hotelSlug);
    const data = await this.pricing.calculateQuote({
      hotelId: hotel.id,
      roomTypeId: body.roomTypeId,
      ratePlanId: body.ratePlanId,
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
      adults: body.adults,
      children: body.children,
      rooms: body.rooms,
      addonIds: body.addonIds,
      promoCode: body.promoCode,
      corporateCode: body.corporateCode,
    });
    return { data };
  }

  @Public()
  @Post('coupon/apply')
  async applyCoupon(@Body() body: ApplyCouponInput) {
    const hotel = await this.booking.getHotelBySlug(body.hotelSlug);
    const result = await this.pricing.validateCoupon(hotel.id, body.code, body.subtotal);
    if (!result) return { data: { valid: false, message: 'Invalid or expired coupon' } };
    return { data: { valid: true, discount: result.discount, code: body.code } };
  }

  @Public()
  @Post('hold')
  async createHold(@Body() body: CreateHoldInput) {
    const hotel = await this.booking.getHotelBySlug(body.hotelSlug);
    const hold = await this.availability.createHold({
      hotelId: hotel.id,
      sessionId: body.sessionId,
      roomTypeId: body.roomTypeId,
      roomCount: body.roomCount,
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
    });
    return { data: hold };
  }

  @Public()
  @Post('reservations')
  async createReservation(@Body() body: CreateBookingInput) {
    const data = await this.booking.createBooking(body);
    return { data };
  }

  @Public()
  @Get('reservations/:code')
  async getReservation(
    @Param('code') code: string,
    @Query('hotelSlug') hotelSlug = 'tunga-international',
  ) {
    const data = await this.booking.getBooking(hotelSlug, code);
    return { data };
  }

  @Public()
  @Post('reservations/:code/cancel')
  async cancelReservation(
    @Param('code') code: string,
    @Body('reason') reason: string,
    @Query('hotelSlug') hotelSlug = 'tunga-international',
  ) {
    const data = await this.booking.cancelBooking(hotelSlug, code, reason);
    return { data };
  }
}
