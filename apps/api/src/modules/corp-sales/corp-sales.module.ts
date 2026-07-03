import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CorpSalesController } from '@/modules/corp-sales/corp-sales.controller';
import { CorpSalesRealtimeGateway } from '@/modules/corp-sales/gateways/corp-sales-realtime.gateway';
import { CorpSalesDashboardService } from '@/modules/corp-sales/services/corp-sales-dashboard.service';
import { CorpSalesLeadService } from '@/modules/corp-sales/services/corp-sales-lead.service';
import { CorpSalesOperationsService } from '@/modules/corp-sales/services/corp-sales-operations.service';

@Module({
  controllers: [CorpSalesController],
  providers: [
    CorpSalesRealtimeGateway,
    CorpSalesDashboardService,
    CorpSalesLeadService,
    CorpSalesOperationsService,
    PermissionsGuard,
  ],
  exports: [CorpSalesDashboardService, CorpSalesLeadService, CorpSalesOperationsService],
})
export class CorpSalesModule {}
