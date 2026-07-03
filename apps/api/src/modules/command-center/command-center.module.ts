import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CorpSalesModule } from '@/modules/corp-sales/corp-sales.module';
import { CrmModule } from '@/modules/crm/crm.module';
import { EventsModule } from '@/modules/events/events.module';
import { FinanceModule } from '@/modules/finance/finance.module';
import { FrontDeskModule } from '@/modules/front-desk/front-desk.module';
import { HrModule } from '@/modules/hr/hr.module';
import { InventoryModule } from '@/modules/inventory/inventory.module';
import { PmsModule } from '@/modules/pms/pms.module';
import { RestaurantModule } from '@/modules/restaurant/restaurant.module';
import { TravelDeskModule } from '@/modules/travel-desk/travel-desk.module';
import { CommandCenterController } from '@/modules/command-center/command-center.controller';
import { CommandCenterRealtimeGateway } from '@/modules/command-center/gateways/command-center-realtime.gateway';
import { CommandCenterService } from '@/modules/command-center/services/command-center.service';

@Module({
  imports: [
    PmsModule,
    FrontDeskModule,
    FinanceModule,
    RestaurantModule,
    EventsModule,
    HrModule,
    CrmModule,
    InventoryModule,
    TravelDeskModule,
    CorpSalesModule,
  ],
  controllers: [CommandCenterController],
  providers: [CommandCenterService, CommandCenterRealtimeGateway, PermissionsGuard],
  exports: [CommandCenterService],
})
export class CommandCenterModule {}
