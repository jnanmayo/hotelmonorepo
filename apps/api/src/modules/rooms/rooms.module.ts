import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PmsModule } from '@/modules/pms/pms.module';
import { RoomsController } from '@/modules/rooms/rooms.controller';
import { RoomAllocationService } from '@/modules/rooms/services/room-allocation.service';
import { RoomDashboardService } from '@/modules/rooms/services/room-dashboard.service';
import {
  RoomAssetService,
  RoomOperationsService,
  RoomReportService,
} from '@/modules/rooms/services/room-operations.service';
import { RoomPricingService, RoomRevenueService } from '@/modules/rooms/services/room-pricing.service';
import { RoomPropertyService } from '@/modules/rooms/services/room-property.service';

@Module({
  imports: [PmsModule],
  controllers: [RoomsController],
  providers: [
    RoomDashboardService,
    RoomPropertyService,
    RoomAllocationService,
    RoomPricingService,
    RoomRevenueService,
    RoomOperationsService,
    RoomAssetService,
    RoomReportService,
    PermissionsGuard,
  ],
  exports: [RoomDashboardService, RoomPropertyService],
})
export class RoomsModule {}
