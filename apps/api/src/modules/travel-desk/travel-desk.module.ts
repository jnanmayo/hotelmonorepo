import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { TravelDeskRealtimeGateway } from '@/modules/travel-desk/gateways/travel-desk-realtime.gateway';
import { TmsDashboardService } from '@/modules/travel-desk/services/tms-dashboard.service';
import { TmsFleetService } from '@/modules/travel-desk/services/tms-fleet.service';
import { TmsOperationsService } from '@/modules/travel-desk/services/tms-operations.service';
import { TmsTripService } from '@/modules/travel-desk/services/tms-trip.service';
import { TravelDeskController } from '@/modules/travel-desk/travel-desk.controller';

@Module({
  controllers: [TravelDeskController],
  providers: [
    TravelDeskRealtimeGateway,
    TmsDashboardService,
    TmsFleetService,
    TmsTripService,
    TmsOperationsService,
    PermissionsGuard,
  ],
  exports: [TmsDashboardService, TmsTripService, TmsFleetService],
})
export class TravelDeskModule {}
