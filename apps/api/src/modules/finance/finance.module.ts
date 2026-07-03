import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { FinanceRealtimeGateway } from '@/modules/finance/gateways/finance-realtime.gateway';
import { FinanceController } from '@/modules/finance/finance.controller';
import { FinDashboardService } from '@/modules/finance/services/fin-dashboard.service';
import { FinLedgerService } from '@/modules/finance/services/fin-ledger.service';
import { FinSupportService } from '@/modules/finance/services/fin-support.service';

@Module({
  controllers: [FinanceController],
  providers: [
    FinanceRealtimeGateway,
    FinDashboardService,
    FinLedgerService,
    FinSupportService,
    PermissionsGuard,
  ],
  exports: [FinLedgerService, FinDashboardService],
})
export class FinanceModule {}
