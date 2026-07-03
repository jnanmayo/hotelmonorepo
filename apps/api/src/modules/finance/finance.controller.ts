import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/auth.decorators';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { FinDashboardService } from '@/modules/finance/services/fin-dashboard.service';
import { FinLedgerService } from '@/modules/finance/services/fin-ledger.service';
import { FinSupportService } from '@/modules/finance/services/fin-support.service';

import type { JwtPayload } from '@tungaos/shared';
import type {
  CreateBankAccountSchema,
  CreateBudgetSchema,
  CreateCashTransactionSchema,
  CreateExpenseSchema,
  CreateGstEntrySchema,
  CreateIncomeSchema,
  CreateJournalEntrySchema,
} from '@tungaos/shared';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('finance')
export class FinanceController {
  constructor(
    private dashboard: FinDashboardService,
    private ledger: FinLedgerService,
    private support: FinSupportService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('finance:ledger:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Get('owner-dashboard')
  @RequirePermissions('finance:ledger:read')
  async getOwnerDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getOwnerDashboard(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('finance:ledger:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    const [accounts, costCenters, expenseCategories] = await Promise.all([
      this.ledger.seedChartOfAccounts(hotelId, user.sub),
      this.ledger.seedCostCenters(hotelId),
      this.support.seedExpenseCategories(hotelId, user.sub),
    ]);
    return { data: { accounts, costCenters, expenseCategories } };
  }

  @Post('sync')
  @RequirePermissions('finance:ledger:manage')
  async sync(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.ledger.syncFromModules(hotelId, user.sub) };
  }

  @Get('accounts')
  @RequirePermissions('finance:ledger:read')
  async listAccounts(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.ledger.listAccounts(hotelId) };
  }

  @Get('journal-entries')
  @RequirePermissions('finance:ledger:read')
  async listJournals(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.ledger.listJournalEntries(hotelId) };
  }

  @Post('journal-entries')
  @RequirePermissions('finance:journal:create')
  async createJournal(@CurrentUser() user: JwtPayload, @Body() dto: CreateJournalEntrySchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.ledger.createJournal(hotelId, dto, user.sub) };
  }

  @Patch('journal-entries/:id/post')
  @RequirePermissions('finance:journal:approve')
  async postJournal(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.ledger.postJournal(hotelId, id, user.sub) };
  }

  @Get('general-ledger')
  @RequirePermissions('finance:ledger:read')
  async getGl(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.ledger.getGeneralLedger(hotelId) };
  }

  @Get('trial-balance')
  @RequirePermissions('finance:report:read')
  async trialBalance(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.ledger.getTrialBalance(hotelId) };
  }

  @Get('receivables')
  @RequirePermissions('finance:ledger:read')
  async listReceivables(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listReceivables(hotelId) };
  }

  @Get('payables')
  @RequirePermissions('finance:ledger:read')
  async listPayables(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listPayables(hotelId) };
  }

  @Get('expenses')
  @RequirePermissions('finance:ledger:read')
  async listExpenses(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listExpenses(hotelId) };
  }

  @Post('expenses')
  @RequirePermissions('finance:journal:create')
  async createExpense(@CurrentUser() user: JwtPayload, @Body() dto: CreateExpenseSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createExpense(hotelId, dto, user.sub) };
  }

  @Get('revenue')
  @RequirePermissions('finance:ledger:read')
  async listRevenue(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listIncome(hotelId) };
  }

  @Post('revenue')
  @RequirePermissions('finance:journal:create')
  async createRevenue(@CurrentUser() user: JwtPayload, @Body() dto: CreateIncomeSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createIncome(hotelId, dto, user.sub) };
  }

  @Get('bank-accounts')
  @RequirePermissions('finance:ledger:read')
  async listBanks(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listBankAccounts(hotelId) };
  }

  @Post('bank-accounts')
  @RequirePermissions('finance:ledger:manage')
  async createBank(@CurrentUser() user: JwtPayload, @Body() dto: CreateBankAccountSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createBankAccount(hotelId, dto) };
  }

  @Get('cash')
  @RequirePermissions('finance:ledger:read')
  async listCash(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listCashTransactions(hotelId) };
  }

  @Post('cash')
  @RequirePermissions('finance:journal:create')
  async recordCash(@CurrentUser() user: JwtPayload, @Body() dto: CreateCashTransactionSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.recordCashTransaction(hotelId, dto, user.sub) };
  }

  @Get('budgets')
  @RequirePermissions('finance:ledger:read')
  async listBudgets(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listBudgets(hotelId) };
  }

  @Post('budgets')
  @RequirePermissions('finance:ledger:manage')
  async createBudget(@CurrentUser() user: JwtPayload, @Body() dto: CreateBudgetSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.createBudget(hotelId, dto) };
  }

  @Get('cost-centers')
  @RequirePermissions('finance:ledger:read')
  async listCostCenters(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listCostCenters(hotelId) };
  }

  @Get('gst')
  @RequirePermissions('finance:report:read')
  async getGst(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getGstSummary(hotelId) };
  }

  @Post('gst')
  @RequirePermissions('finance:journal:create')
  async recordGst(@CurrentUser() user: JwtPayload, @Body() dto: CreateGstEntrySchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.recordGstEntry(hotelId, dto) };
  }

  @Get('approvals')
  @RequirePermissions('finance:payment:approve')
  async listApprovals(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.support.listApprovals(hotelId) };
  }

  @Patch('approvals/:entityType/:entityId')
  @RequirePermissions('finance:payment:approve')
  async approve(
    @CurrentUser() user: JwtPayload,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.approveEntity(hotelId, entityType, entityId, user.sub) };
  }

  @Get('analytics')
  @RequirePermissions('finance:report:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getAnalytics(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('finance:report:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.support.getReport(hotelId, type) };
  }
}
