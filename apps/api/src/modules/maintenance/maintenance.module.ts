import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { InventoryModule } from '@/modules/inventory/inventory.module';
import { MaintenanceRealtimeGateway } from '@/modules/maintenance/gateways/maintenance-realtime.gateway';
import { MaintenanceController } from '@/modules/maintenance/maintenance.controller';
import { EamAssetService } from '@/modules/maintenance/services/eam-asset.service';
import { EamDashboardService } from '@/modules/maintenance/services/eam-dashboard.service';
import { EamSupportService } from '@/modules/maintenance/services/eam-support.service';
import { EamWorkflowService } from '@/modules/maintenance/services/eam-workflow.service';

@Module({
  imports: [InventoryModule],
  controllers: [MaintenanceController],
  providers: [
    MaintenanceRealtimeGateway,
    EamDashboardService,
    EamAssetService,
    EamWorkflowService,
    EamSupportService,
    PermissionsGuard,
  ],
  exports: [EamAssetService, EamWorkflowService],
})
export class MaintenanceModule {}
