import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { HousekeepingRealtimeGateway } from '@/modules/housekeeping/gateways/housekeeping-realtime.gateway';
import { HousekeepingController } from '@/modules/housekeeping/housekeeping.controller';
import { HkDashboardService } from '@/modules/housekeeping/services/hk-dashboard.service';
import { HkInspectionService } from '@/modules/housekeeping/services/hk-inspection.service';
import {
  HkLaundryService,
  HkLinenService,
  HkReportService,
  HkSupportService,
} from '@/modules/housekeeping/services/hk-laundry.service';
import { HkTaskService } from '@/modules/housekeeping/services/hk-task.service';
import { PmsModule } from '@/modules/pms/pms.module';

@Module({
  imports: [PmsModule],
  controllers: [HousekeepingController],
  providers: [
    HousekeepingRealtimeGateway,
    HkDashboardService,
    HkTaskService,
    HkInspectionService,
    HkLaundryService,
    HkLinenService,
    HkSupportService,
    HkReportService,
    PermissionsGuard,
  ],
  exports: [HkTaskService, HkDashboardService],
})
export class HousekeepingModule {}
