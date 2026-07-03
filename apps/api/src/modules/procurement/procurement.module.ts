import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { ProcurementRealtimeGateway } from '@/modules/procurement/gateways/procurement-realtime.gateway';
import { ProcurementController, VendorPortalController } from '@/modules/procurement/procurement.controller';
import { ProcDashboardService } from '@/modules/procurement/services/proc-dashboard.service';
import { ProcGrnService, ProcPoService } from '@/modules/procurement/services/proc-po-grn.service';
import { ProcSupportService } from '@/modules/procurement/services/proc-support.service';
import { ProcVendorService } from '@/modules/procurement/services/proc-vendor.service';
import { ProcWorkflowService } from '@/modules/procurement/services/proc-workflow.service';

@Module({
  controllers: [ProcurementController, VendorPortalController],
  providers: [
    ProcurementRealtimeGateway,
    ProcDashboardService,
    ProcVendorService,
    ProcWorkflowService,
    ProcPoService,
    ProcGrnService,
    ProcSupportService,
    PermissionsGuard,
  ],
  exports: [ProcPoService, ProcGrnService, ProcVendorService],
})
export class ProcurementModule {}
