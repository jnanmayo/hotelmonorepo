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

import type { JwtPayload } from '@tungaos/shared';
import type {
  CreateAdjustmentSchema,
  CreateAuditSchema,
  CreateCategorySchema,
  CreateConsumptionSchema,
  CreateIssueSchema,
  CreateItemSchema,
  CreatePurchaseRequestSchema,
  CreateStoreSchema,
  CreateTransferSchema,
  CreateUnitSchema,
} from '@tungaos/shared';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private dashboard: InvDashboardService,
    private master: InvMasterService,
    private stock: InvStockService,
    private operations: InvOperationsService,
    private batches: InvBatchService,
    private audits: InvAuditService,
    private purchaseRequests: InvPurchaseRequestService,
    private reports: InvReportService,
    private analytics: InvAnalyticsService,
    private barcode: InvBarcodeService,
  ) {}

  private hotelId(user: JwtPayload) {
    return user.hotelId ?? null;
  }

  @Get('dashboard')
  @RequirePermissions('inventory:stock:read')
  async getDashboard(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.dashboard.getDashboard(hotelId) };
  }

  @Post('seed')
  @RequirePermissions('inventory:stock:manage')
  async seed(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.master.seedDefaults(hotelId, user.sub) };
  }

  @Get('stores')
  @RequirePermissions('inventory:stock:read')
  async listStores(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.master.listStores(hotelId) };
  }

  @Post('stores')
  @RequirePermissions('inventory:stock:manage')
  async createStore(@CurrentUser() user: JwtPayload, @Body() dto: CreateStoreSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.master.createStore(hotelId, dto, user.sub) };
  }

  @Get('categories')
  @RequirePermissions('inventory:stock:read')
  async listCategories(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.master.listCategories(hotelId) };
  }

  @Post('categories')
  @RequirePermissions('inventory:stock:manage')
  async createCategory(@CurrentUser() user: JwtPayload, @Body() dto: CreateCategorySchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.master.createCategory(hotelId, dto, user.sub) };
  }

  @Get('units')
  @RequirePermissions('inventory:stock:read')
  async listUnits(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.master.listUnits(hotelId) };
  }

  @Post('units')
  @RequirePermissions('inventory:stock:manage')
  async createUnit(@CurrentUser() user: JwtPayload, @Body() dto: CreateUnitSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.master.createUnit(hotelId, dto, user.sub) };
  }

  @Get('items')
  @RequirePermissions('inventory:stock:read')
  async listItems(@CurrentUser() user: JwtPayload, @Query('search') search?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.master.listItems(hotelId, search) };
  }

  @Post('items')
  @RequirePermissions('inventory:stock:manage')
  async createItem(@CurrentUser() user: JwtPayload, @Body() dto: CreateItemSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.master.createItem(hotelId, dto, user.sub) };
  }

  @Get('items/:id')
  @RequirePermissions('inventory:stock:read')
  async getItem(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.master.getItem(hotelId, id) };
  }

  @Get('stock')
  @RequirePermissions('inventory:stock:read')
  async listStock(@CurrentUser() user: JwtPayload, @Query('storeId') storeId?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.stock.listBalances(hotelId, storeId) };
  }

  @Get('movements')
  @RequirePermissions('inventory:stock:read')
  async listMovements(
    @CurrentUser() user: JwtPayload,
    @Query('itemId') itemId?: string,
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.stock.listMovements(hotelId, itemId) };
  }

  @Get('transfers')
  @RequirePermissions('inventory:stock:read')
  async listTransfers(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listTransfers(hotelId) };
  }

  @Post('transfers')
  @RequirePermissions('inventory:stock:create')
  async createTransfer(@CurrentUser() user: JwtPayload, @Body() dto: CreateTransferSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createTransfer(hotelId, dto, user.sub) };
  }

  @Patch('transfers/:id/approve')
  @RequirePermissions('inventory:stock:approve')
  async approveTransfer(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.approveTransfer(hotelId, id, user.sub) };
  }

  @Get('issues')
  @RequirePermissions('inventory:stock:read')
  async listIssues(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listIssues(hotelId) };
  }

  @Post('issues')
  @RequirePermissions('inventory:stock:create')
  async createIssue(@CurrentUser() user: JwtPayload, @Body() dto: CreateIssueSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createIssue(hotelId, dto, user.sub) };
  }

  @Patch('issues/:id/approve')
  @RequirePermissions('inventory:stock:approve')
  async approveIssue(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.approveIssue(hotelId, id, user.sub) };
  }

  @Get('consumptions')
  @RequirePermissions('inventory:stock:read')
  async listConsumptions(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listConsumptions(hotelId) };
  }

  @Post('consumptions')
  @RequirePermissions('inventory:stock:create')
  async recordConsumption(@CurrentUser() user: JwtPayload, @Body() dto: CreateConsumptionSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.recordConsumption(hotelId, dto, user.sub) };
  }

  @Get('batches')
  @RequirePermissions('inventory:stock:read')
  async listBatches(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.batches.listBatches(hotelId, status) };
  }

  @Get('expiry')
  @RequirePermissions('inventory:stock:read')
  async expiryAlerts(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.batches.listExpiryAlerts(hotelId) };
  }

  @Get('adjustments')
  @RequirePermissions('inventory:stock:read')
  async listAdjustments(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.operations.listAdjustments(hotelId) };
  }

  @Post('adjustments')
  @RequirePermissions('inventory:stock:create')
  async createAdjustment(@CurrentUser() user: JwtPayload, @Body() dto: CreateAdjustmentSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.createAdjustment(hotelId, dto, user.sub) };
  }

  @Patch('adjustments/:id/approve')
  @RequirePermissions('inventory:stock:approve')
  async approveAdjustment(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.operations.approveAdjustment(hotelId, id, user.sub) };
  }

  @Get('audits')
  @RequirePermissions('inventory:stock:read')
  async listAudits(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.audits.listAudits(hotelId) };
  }

  @Post('audits')
  @RequirePermissions('inventory:stock:create')
  async createAudit(@CurrentUser() user: JwtPayload, @Body() dto: CreateAuditSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.audits.createAudit(hotelId, dto) };
  }

  @Patch('audits/:id/complete')
  @RequirePermissions('inventory:stock:approve')
  async completeAudit(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.audits.completeAudit(hotelId, id, user.sub) };
  }

  @Get('purchase-requests')
  @RequirePermissions('inventory:stock:read')
  async listPurchaseRequests(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    return { data: await this.purchaseRequests.list(hotelId) };
  }

  @Post('purchase-requests')
  @RequirePermissions('inventory:stock:create')
  async createPurchaseRequest(@CurrentUser() user: JwtPayload, @Body() dto: CreatePurchaseRequestSchema) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.purchaseRequests.create(hotelId, dto, user.sub) };
  }

  @Patch('purchase-requests/:id/approve')
  @RequirePermissions('inventory:stock:approve')
  async approvePurchaseRequest(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Query('level') level: 'dept' | 'store' = 'dept',
  ) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.purchaseRequests.approve(hotelId, id, level, user.sub) };
  }

  @Post('auto-reorder')
  @RequirePermissions('inventory:stock:manage')
  async autoReorder(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.purchaseRequests.checkAutoReorder(hotelId) };
  }

  @Get('reports/:type')
  @RequirePermissions('inventory:stock:read')
  async getReport(@CurrentUser() user: JwtPayload, @Param('type') type: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: [] };
    switch (type) {
      case 'stock': return { data: await this.reports.stockReport(hotelId) };
      case 'consumption': return { data: await this.reports.consumptionReport(hotelId) };
      case 'low-stock': return { data: await this.reports.lowStockReport(hotelId) };
      case 'department': return { data: await this.reports.departmentReport(hotelId) };
      default: return { data: [] };
    }
  }

  @Get('analytics')
  @RequirePermissions('inventory:stock:read')
  async getAnalytics(@CurrentUser() user: JwtPayload) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.analytics.getAnalytics(hotelId) };
  }

  @Get('barcode/:code')
  @RequirePermissions('inventory:stock:read')
  async lookupBarcode(@CurrentUser() user: JwtPayload, @Param('code') code: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.barcode.getByBarcode(hotelId, code) };
  }

  @Post('barcode/:itemId/regenerate')
  @RequirePermissions('inventory:stock:manage')
  async regenerateBarcode(@CurrentUser() user: JwtPayload, @Param('itemId') itemId: string) {
    const hotelId = this.hotelId(user);
    if (!hotelId) return { data: null };
    return { data: await this.barcode.regenerateCodes(hotelId, itemId) };
  }
}
