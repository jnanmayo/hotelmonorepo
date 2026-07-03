import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AdminBookingController } from '@/modules/booking/admin-booking.controller';
import { PublicBookingController } from '@/modules/booking/public-booking.controller';
import { AvailabilityService } from '@/modules/booking/services/availability.service';
import { BookingService } from '@/modules/booking/services/booking.service';
import { PaymentService } from '@/modules/booking/services/payment.service';
import { PricingService } from '@/modules/booking/services/pricing.service';

@Module({
  controllers: [PublicBookingController, AdminBookingController],
  providers: [AvailabilityService, PricingService, BookingService, PaymentService, PermissionsGuard],
  exports: [BookingService, AvailabilityService, PricingService],
})
export class BookingModule {}
