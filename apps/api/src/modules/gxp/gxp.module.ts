import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { FrontDeskModule } from '@/modules/front-desk/front-desk.module';
import { GxpController } from '@/modules/gxp/gxp.controller';
import { GxpRealtimeGateway } from '@/modules/gxp/gateways/gxp-realtime.gateway';
import { GxpSessionGuard } from '@/modules/gxp/guards/gxp-session.guard';
import { PublicGxpController } from '@/modules/gxp/public-gxp.controller';
import { GxpAdminService } from '@/modules/gxp/services/gxp-admin.service';
import { GxpChatService } from '@/modules/gxp/services/gxp-chat.service';
import { GxpDashboardService } from '@/modules/gxp/services/gxp-dashboard.service';
import { GxpDiningService } from '@/modules/gxp/services/gxp-dining.service';
import { GxpFolioService } from '@/modules/gxp/services/gxp-folio.service';
import { GxpRequestService } from '@/modules/gxp/services/gxp-request.service';
import { GxpRoomService } from '@/modules/gxp/services/gxp-room.service';
import { GxpSessionService } from '@/modules/gxp/services/gxp-session.service';
import { HousekeepingModule } from '@/modules/housekeeping/housekeeping.module';
import { RestaurantModule } from '@/modules/restaurant/restaurant.module';

@Module({
  imports: [FrontDeskModule, RestaurantModule, HousekeepingModule],
  controllers: [PublicGxpController, GxpController],
  providers: [
    GxpRealtimeGateway,
    GxpSessionGuard,
    GxpSessionService,
    GxpDashboardService,
    GxpRoomService,
    GxpRequestService,
    GxpFolioService,
    GxpDiningService,
    GxpChatService,
    GxpAdminService,
    PermissionsGuard,
  ],
  exports: [GxpSessionService, GxpAdminService],
})
export class GxpModule {}
