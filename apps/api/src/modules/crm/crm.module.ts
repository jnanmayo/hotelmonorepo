import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CrmController } from '@/modules/crm/crm.controller';
import { CrmRealtimeGateway } from '@/modules/crm/gateways/crm-realtime.gateway';
import { CrmDashboardService } from '@/modules/crm/services/crm-dashboard.service';
import { CrmGuestService } from '@/modules/crm/services/crm-guest.service';
import { CrmLoyaltyService } from '@/modules/crm/services/crm-loyalty.service';
import { CrmMarketingService } from '@/modules/crm/services/crm-marketing.service';
import { CrmSalesService } from '@/modules/crm/services/crm-sales.service';

@Module({
  controllers: [CrmController],
  providers: [
    CrmRealtimeGateway,
    CrmDashboardService,
    CrmGuestService,
    CrmSalesService,
    CrmLoyaltyService,
    CrmMarketingService,
    PermissionsGuard,
  ],
  exports: [CrmDashboardService, CrmGuestService],
})
export class CrmModule {}
