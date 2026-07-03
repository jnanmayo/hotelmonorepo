import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { HrDashboardService } from '@/modules/hr/services/hr-dashboard.service';
import { HrEmployeeService } from '@/modules/hr/services/hr-employee.service';
import { HrOperationsService } from '@/modules/hr/services/hr-operations.service';
import { HrPayrollService } from '@/modules/hr/services/hr-payroll.service';
import { HrSupportService } from '@/modules/hr/services/hr-support.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  ApproveLeaveSchema,
  AssignRosterSchema,
  CreateCandidateSchema,
  CreateExpenseClaimSchema,
  CreateJobOpeningSchema,
  CreateLeaveRequestSchema,
  CreatePayrollRunSchema,
  CreateShiftSchema,
  ScheduleInterviewSchema,
} from '@tungaos/shared';

@ApiTags('HR')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('hr')
export class HrController {
  constructor(
    private dashboard: HrDashboardService,
    private employees: HrEmployeeService,
    private operations: HrOperationsService,
    private payroll: HrPayrollService,
    private support: HrSupportService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('payroll:salary:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('owner-dashboard')
  @RequirePermissions('payroll:salary:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getOwnerDashboard(hotelId) };
  }

  @Get('analytics')
  @RequirePermissions('payroll:salary:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.employees.getAnalytics(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('payroll:salary:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.employees.seedDefaults(hotelId, user.sub) };
  }

  @Get('employees')
  @RequirePermissions('users:user:read')
  async listEmployees(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.employees.listEmployees(hotelId, search) };
  }

  @Get('departments')
  @RequirePermissions('payroll:salary:read')
  async listDepartments(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.employees.listDepartments(hotelId) };
  }

  @Get('designations')
  @RequirePermissions('payroll:salary:read')
  async listDesignations(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.employees.listDesignations(hotelId) };
  }

  @Get('attendance')
  @RequirePermissions('payroll:salary:read')
  async listAttendance(@CurrentUser() user: JwtPayload, @Query('date') date?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listAttendance(hotelId, date) };
  }

  @Get('leave')
  @RequirePermissions('payroll:salary:read')
  async listLeave(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listLeave(hotelId, status) };
  }

  @Post('leave')
  @RequirePermissions('payroll:salary:read')
  async createLeave(@CurrentUser() user: JwtPayload, @Body() dto: CreateLeaveRequestSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createLeave(hotelId, dto, user.sub) };
  }

  @Patch('leave/:id/approve')
  @RequirePermissions('payroll:salary:manage')
  async approveLeave(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: ApproveLeaveSchema,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.approveLeave(hotelId, id, dto, user.sub) };
  }

  @Get('shifts')
  @RequirePermissions('payroll:salary:read')
  async listShifts(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listShifts(hotelId) };
  }

  @Post('shifts')
  @RequirePermissions('payroll:salary:manage')
  async createShift(@CurrentUser() user: JwtPayload, @Body() dto: CreateShiftSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createShift(hotelId, dto, user.sub) };
  }

  @Get('roster')
  @RequirePermissions('payroll:salary:read')
  async listRoster(@CurrentUser() user: JwtPayload, @Query('date') date?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listRoster(hotelId, date) };
  }

  @Post('roster')
  @RequirePermissions('payroll:salary:manage')
  async assignRoster(@CurrentUser() user: JwtPayload, @Body() dto: AssignRosterSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.assignRoster(hotelId, dto, user.sub) };
  }

  @Get('payroll/runs')
  @RequirePermissions('payroll:salary:read')
  async listPayrollRuns(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.payroll.listRuns(hotelId) };
  }

  @Get('payroll/components')
  @RequirePermissions('payroll:salary:read')
  async listSalaryComponents(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.payroll.listSalaryComponents(hotelId) };
  }

  @Post('payroll/runs')
  @RequirePermissions('payroll:salary:manage')
  async createPayrollRun(@CurrentUser() user: JwtPayload, @Body() dto: CreatePayrollRunSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.payroll.createRun(hotelId, dto, user.sub) };
  }

  @Post('payroll/runs/:id/calculate')
  @RequirePermissions('payroll:salary:manage')
  async calculatePayroll(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.payroll.calculateRun(hotelId, id, user.sub) };
  }

  @Patch('payroll/runs/:id/approve')
  @RequirePermissions('payroll:salary:manage')
  async approvePayroll(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.payroll.approveRun(hotelId, id, user.sub) };
  }

  @Get('recruitment/openings')
  @RequirePermissions('payroll:salary:read')
  async listOpenings(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listJobOpenings(hotelId) };
  }

  @Post('recruitment/openings')
  @RequirePermissions('payroll:salary:manage')
  async createOpening(@CurrentUser() user: JwtPayload, @Body() dto: CreateJobOpeningSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createJobOpening(hotelId, dto) };
  }

  @Get('recruitment/candidates')
  @RequirePermissions('payroll:salary:read')
  async listCandidates(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listCandidates(hotelId) };
  }

  @Post('recruitment/candidates')
  @RequirePermissions('payroll:salary:manage')
  async createCandidate(@CurrentUser() user: JwtPayload, @Body() dto: CreateCandidateSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createCandidate(hotelId, dto) };
  }

  @Get('recruitment/interviews')
  @RequirePermissions('payroll:salary:read')
  async listInterviews(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listInterviews(hotelId) };
  }

  @Post('recruitment/interviews')
  @RequirePermissions('payroll:salary:manage')
  async scheduleInterview(@CurrentUser() user: JwtPayload, @Body() dto: ScheduleInterviewSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.scheduleInterview(hotelId, dto) };
  }

  @Get('onboarding')
  @RequirePermissions('payroll:salary:read')
  async listOnboarding(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listOnboarding(hotelId) };
  }

  @Get('training')
  @RequirePermissions('payroll:salary:read')
  async listTraining(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listTraining(hotelId) };
  }

  @Get('performance')
  @RequirePermissions('payroll:salary:read')
  async listPerformance(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listPerformance(hotelId) };
  }

  @Get('expenses')
  @RequirePermissions('payroll:salary:read')
  async listExpenses(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listExpenses(hotelId) };
  }

  @Post('expenses')
  @RequirePermissions('payroll:salary:read')
  async createExpense(@CurrentUser() user: JwtPayload, @Body() dto: CreateExpenseClaimSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createExpense(hotelId, dto) };
  }

  @Patch('expenses/:id/approve')
  @RequirePermissions('payroll:salary:manage')
  async approveExpense(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.approveExpense(hotelId, id, user.sub) };
  }

  @Get('exit')
  @RequirePermissions('payroll:salary:read')
  async listExit(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listExit(hotelId) };
  }

  @Get('documents')
  @RequirePermissions('payroll:salary:read')
  async listDocuments(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listDocuments(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('payroll:salary:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getReport(hotelId, type) };
  }
}
