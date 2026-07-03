import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { HrRealtimeGateway } from '@/modules/hr/gateways/hr-realtime.gateway';
import { HrController } from '@/modules/hr/hr.controller';
import { HrDashboardService } from '@/modules/hr/services/hr-dashboard.service';
import { HrEmployeeService } from '@/modules/hr/services/hr-employee.service';
import { HrOperationsService } from '@/modules/hr/services/hr-operations.service';
import { HrPayrollService } from '@/modules/hr/services/hr-payroll.service';
import { HrSupportService } from '@/modules/hr/services/hr-support.service';

@Module({
  controllers: [HrController],
  providers: [
    HrRealtimeGateway,
    HrDashboardService,
    HrEmployeeService,
    HrOperationsService,
    HrPayrollService,
    HrSupportService,
    PermissionsGuard,
  ],
  exports: [HrDashboardService, HrEmployeeService],
})
export class HrModule {}
