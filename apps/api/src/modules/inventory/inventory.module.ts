import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { InventoryRealtimeGateway } from '@/modules/inventory/gateways/inventory-realtime.gateway';
import { InventoryController } from '@/modules/inventory/inventory.controller';
import {
  InvAuditService,
  InvBatchService,
  InvPurchaseRequestService,
} from '@/modules/inventory/services/inv-batch-audit.service';
import { InvDashboardService } from '@/modules/inventory/services/inv-dashboard.service';
import { InvMasterService } from '@/modules/inventory/services/inv-master.service';
import { InvOperationsService } from '@/modules/inventory/services/inv-operations.service';
import {
  InvAnalyticsService,
  InvBarcodeService,
  InvReportService,
} from '@/modules/inventory/services/inv-report.service';
import { InvStockService } from '@/modules/inventory/services/inv-stock.service';

@Module({
  controllers: [InventoryController],
  providers: [
    InventoryRealtimeGateway,
    InvDashboardService,
    InvMasterService,
    InvStockService,
    InvOperationsService,
    InvBatchService,
    InvAuditService,
    InvPurchaseRequestService,
    InvReportService,
    InvAnalyticsService,
    InvBarcodeService,
    PermissionsGuard,
  ],
  exports: [InvMasterService, InvOperationsService, InvDashboardService],
})
export class InventoryModule {}
