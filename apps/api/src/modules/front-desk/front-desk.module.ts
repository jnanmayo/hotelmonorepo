import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { FrontDeskController } from '@/modules/front-desk/front-desk.controller';
import { FrontDeskRealtimeGateway } from '@/modules/front-desk/gateways/front-desk-realtime.gateway';
import { FrontDeskDashboardService } from '@/modules/front-desk/services/front-desk-dashboard.service';
import { FrontDeskLogService } from '@/modules/front-desk/services/front-desk-log.service';
import { FrontDeskOperationsService } from '@/modules/front-desk/services/front-desk-operations.service';
import { FrontDeskSupportService } from '@/modules/front-desk/services/front-desk-support.service';
import { PmsModule } from '@/modules/pms/pms.module';

@Module({
  imports: [PmsModule],
  controllers: [FrontDeskController],
  providers: [
    FrontDeskLogService,
    FrontDeskRealtimeGateway,
    FrontDeskDashboardService,
    FrontDeskOperationsService,
    FrontDeskSupportService,
    PermissionsGuard,
  ],
  exports: [FrontDeskDashboardService, FrontDeskOperationsService, FrontDeskRealtimeGateway],
})
export class FrontDeskModule {}
