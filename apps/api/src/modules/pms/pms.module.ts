import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';
import { PmsController } from '@/modules/pms/pms.controller';
import { PmsAuditService } from '@/modules/pms/services/pms-audit.service';
import { PmsCalendarService } from '@/modules/pms/services/pms-calendar.service';
import {
  PmsCheckInService,
  PmsHousekeepingIntegrationService,
} from '@/modules/pms/services/pms-checkin.service';
import { PmsCheckOutService } from '@/modules/pms/services/pms-checkout.service';
import { PmsDashboardService } from '@/modules/pms/services/pms-dashboard.service';
import { PmsEncryptionService } from '@/modules/pms/services/pms-encryption.service';
import { PmsGuestService } from '@/modules/pms/services/pms-guest.service';
import {
  PmsNightAuditService,
  PmsReportService,
  PmsSearchService,
} from '@/modules/pms/services/pms-report.service';
import { PmsReservationService } from '@/modules/pms/services/pms-reservation.service';
import { PmsRoomService } from '@/modules/pms/services/pms-room.service';

@Module({
  controllers: [PmsController],
  providers: [
    PmsAuditService,
    PmsEncryptionService,
    PmsRealtimeGateway,
    PmsDashboardService,
    PmsReservationService,
    PmsGuestService,
    PmsRoomService,
    PmsCheckInService,
    PmsCheckOutService,
    PmsHousekeepingIntegrationService,
    PmsCalendarService,
    PmsSearchService,
    PmsReportService,
    PmsNightAuditService,
    PermissionsGuard,
  ],
  exports: [
    PmsDashboardService,
    PmsReservationService,
    PmsRoomService,
    PmsRealtimeGateway,
    PmsCheckOutService,
    PmsCheckInService,
    PmsHousekeepingIntegrationService,
    PmsCalendarService,
  ],
})
export class PmsModule {}
