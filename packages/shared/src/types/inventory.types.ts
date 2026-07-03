/**
 * TungaOS Enterprise Inventory & Store Management — Shared types
 */

export type InventoryStoreType =
  | 'MAIN'
  | 'KITCHEN'
  | 'RESTAURANT'
  | 'BAR'
  | 'HOUSEKEEPING'
  | 'LAUNDRY'
  | 'MAINTENANCE'
  | 'ENGINEERING'
  | 'SPA'
  | 'BANQUET'
  | 'OFFICE'
  | 'CUSTOM';

export type InventoryDepartment =
  | 'RESTAURANT'
  | 'KITCHEN'
  | 'HOUSEKEEPING'
  | 'LAUNDRY'
  | 'MAINTENANCE'
  | 'SPA'
  | 'RECEPTION'
  | 'BANQUET'
  | 'BAR'
  | 'OFFICE'
  | 'STORES';

export type TransferStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'REJECTED'
  | 'CANCELLED';

export type IssueStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ISSUED'
  | 'RECEIVED'
  | 'REJECTED'
  | 'CANCELLED';

export type PurchaseRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DEPT_APPROVED'
  | 'STORE_APPROVED'
  | 'PURCHASE_APPROVED'
  | 'REJECTED'
  | 'FULFILLED'
  | 'CANCELLED';

export interface InvDashboardStats {
  totalItems: number;
  availableStock: number;
  lowStock: number;
  outOfStock: number;
  expiredItems: number;
  nearExpiry: number;
  todayConsumption: number;
  todayReceipts: number;
  pendingPurchaseRequests: number;
  pendingApprovals: number;
  storeTransfers: number;
  stockValue: number;
  inventoryCost: number;
  foodCost: number;
  barStock: number;
  laundryStock: number;
  housekeepingStock: number;
  maintenanceStock: number;
}

export interface InvStoreItem {
  id: string;
  name: string;
  code: string;
  storeType: InventoryStoreType;
  location: string | null;
  capacity: number | null;
  managerId: string | null;
  managerName: string | null;
  itemCount: number;
  stockValue: number;
  isActive: boolean;
}

export interface InvCategoryItem {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  itemCount: number;
}

export interface InvUnitItem {
  id: string;
  name: string;
  symbol: string;
}

export interface InvItemMaster {
  id: string;
  itemCode: string | null;
  sku: string;
  barcode: string | null;
  qrCode: string | null;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  subCategoryId: string | null;
  subCategoryName: string | null;
  brand: string | null;
  defaultStoreId: string | null;
  defaultStoreName: string | null;
  hsnCode: string | null;
  gstRate: number;
  unitId: string;
  unitSymbol: string;
  purchaseUnitId: string | null;
  consumptionUnitId: string | null;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  minStock: number;
  maxStock: number;
  expiryRequired: boolean;
  batchTracking: boolean;
  imageUrl: string | null;
  itemStatus: string;
  isActive: boolean;
}

export interface InvStockBalance {
  id: string;
  storeId: string;
  storeName: string;
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  reservedQty: number;
  averageCost: number;
  stockValue: number;
  reorderLevel: number;
  status: 'ok' | 'low' | 'out';
}

export interface InvMovementItem {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  storeId: string | null;
  storeName: string | null;
  type: string;
  quantity: number;
  balanceAfter: number;
  unitCost: number;
  department: InventoryDepartment | null;
  reference: string | null;
  notes: string | null;
  movementDate: string;
  createdBy: string | null;
}

export interface InvTransferItem {
  id: string;
  transferNumber: string;
  fromStoreName: string;
  toStoreName: string;
  status: TransferStatus;
  itemCount: number;
  transferDate: string;
  notes: string | null;
}

export interface InvIssueItem {
  id: string;
  issueNumber: string;
  storeName: string;
  department: InventoryDepartment;
  status: IssueStatus;
  itemCount: number;
  issueDate: string;
}

export interface InvConsumptionItem {
  id: string;
  itemName: string;
  sku: string;
  storeName: string;
  department: InventoryDepartment;
  quantity: number;
  unitCost: number;
  totalCost: number;
  sourceModule: string | null;
  consumedAt: string;
}

export interface InvBatchItem {
  id: string;
  itemName: string;
  sku: string;
  storeName: string;
  batchNumber: string;
  remainingQty: number;
  expiryDate: string | null;
  status: string;
}

export interface InvAdjustmentItem {
  id: string;
  adjustNumber: string;
  itemName: string;
  storeName: string;
  type: string;
  status: string;
  quantity: number;
  reason: string | null;
  createdAt: string;
}

export interface InvAuditItem {
  id: string;
  auditNumber: string;
  storeName: string;
  status: string;
  auditType: string;
  itemCount: number;
  varianceTotal: number;
  scheduledAt: string | null;
}

export interface InvPurchaseRequestItem {
  id: string;
  requestNumber: string;
  department: InventoryDepartment;
  status: PurchaseRequestStatus;
  itemCount: number;
  createdAt: string;
}

export interface InvAnalyticsData {
  inventoryValue: number;
  inventoryTurnover: number;
  foodCostPercent: number;
  inventoryLoss: number;
  expiredValue: number;
  mostConsumed: { name: string; quantity: number }[];
  leastUsed: { name: string; quantity: number }[];
  monthlyConsumption: { month: string; value: number }[];
  departmentCosts: { department: string; cost: number }[];
  abcAnalysis: { category: string; items: number; value: number }[];
  fastMoving: { name: string; movements: number }[];
  slowMoving: { name: string; movements: number }[];
  deadStock: { name: string; daysIdle: number }[];
}

export interface InvBarcodeData {
  itemId: string;
  sku: string;
  barcode: string;
  qrPayload: string;
}

export interface InvRealtimeEvent {
  type:
    | 'stock:update'
    | 'consumption:recorded'
    | 'transfer:update'
    | 'issue:update'
    | 'alert:low_stock'
    | 'alert:expiry'
    | 'dashboard:update'
    | 'approval:pending';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
