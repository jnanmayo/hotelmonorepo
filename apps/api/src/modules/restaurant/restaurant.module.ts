import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PmsModule } from '@/modules/pms/pms.module';
import { RestaurantRealtimeGateway } from '@/modules/restaurant/gateways/restaurant-realtime.gateway';
import { RestaurantController } from '@/modules/restaurant/restaurant.controller';
import { FnbDashboardService } from '@/modules/restaurant/services/fnb-dashboard.service';
import {
  FnbKitchenService,
  FnbOutletService,
  FnbPosService,
  FnbReportService,
} from '@/modules/restaurant/services/fnb-pos.service';

@Module({
  imports: [PmsModule],
  controllers: [RestaurantController],
  providers: [
    RestaurantRealtimeGateway,
    FnbDashboardService,
    FnbPosService,
    FnbOutletService,
    FnbKitchenService,
    FnbReportService,
    PermissionsGuard,
  ],
  exports: [FnbPosService, FnbDashboardService],
})
export class RestaurantModule {}
