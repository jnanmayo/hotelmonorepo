import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { EventsController } from '@/modules/events/events.controller';
import { EventsRealtimeGateway } from '@/modules/events/gateways/events-realtime.gateway';
import { EventsDashboardService } from '@/modules/events/services/events-dashboard.service';
import { EventsOperationsService } from '@/modules/events/services/events-operations.service';
import { EventsSalesService } from '@/modules/events/services/events-sales.service';

@Module({
  controllers: [EventsController],
  providers: [
    EventsRealtimeGateway,
    EventsDashboardService,
    EventsSalesService,
    EventsOperationsService,
    PermissionsGuard,
  ],
  exports: [EventsDashboardService, EventsSalesService, EventsOperationsService],
})
export class EventsModule {}
