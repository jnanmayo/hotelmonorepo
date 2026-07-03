/**
 * TungaOS Enterprise Procurement — Shared types
 */

export type ProcPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type ProcPrStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PENDING_APPROVAL'
  | 'DEPT_APPROVED'
  | 'PM_APPROVED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CONVERTED_RFQ'
  | 'CONVERTED_PO'
  | 'CANCELLED';

export type RfqStatus =
  | 'DRAFT'
  | 'SENT'
  | 'QUOTATIONS_RECEIVED'
  | 'COMPARING'
  | 'VENDOR_SELECTED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'EXPIRED';

export type QuotationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SELECTED'
  | 'REJECTED'
  | 'EXPIRED';

export type PaymentTerms =
  | 'ADVANCE'
  | 'NET_15'
  | 'NET_30'
  | 'NET_45'
  | 'NET_60'
  | 'CREDIT'
  | 'PARTIAL';

export interface ProcDashboardStats {
  pendingPurchaseRequests: number;
  pendingRfqs: number;
  pendingQuotations: number;
  pendingPurchaseOrders: number;
  pendingGoodsReceipt: number;
  pendingInvoices: number;
  pendingPayments: number;
  todayPurchases: number;
  monthlyPurchases: number;
  purchaseValue: number;
  budgetUtilization: number;
  lateDeliveries: number;
  rejectedDeliveries: number;
  topVendors: { name: string; value: number }[];
  departmentSpending: { department: string; amount: number }[];
}

export interface ProcVendorItem {
  id: string;
  code: string;
  name: string;
  companyName: string | null;
  categoryName: string | null;
  email: string | null;
  phone: string | null;
  gstNumber: string | null;
  paymentTerms: PaymentTerms;
  rating: number;
  leadTimeDays: number;
  isBlacklisted: boolean;
  vendorStatus: string;
}

export interface ProcPurchaseRequestItem {
  id: string;
  requestNumber: string;
  department: string;
  priority: ProcPriority;
  status: ProcPrStatus;
  itemCount: number;
  requiredDate: string | null;
  createdAt: string;
}

export interface ProcRfqItem {
  id: string;
  rfqNumber: string;
  status: RfqStatus;
  vendorCount: number;
  quotationCount: number;
  expiryDate: string | null;
  createdAt: string;
}

export interface ProcQuotationItem {
  id: string;
  quotationNumber: string;
  vendorName: string;
  rfqNumber: string;
  status: QuotationStatus;
  totalAmount: number;
  leadTimeDays: number;
  isRecommended: boolean;
  submittedAt: string | null;
}

export interface ProcQuotationComparison {
  rfqId: string;
  rfqNumber: string;
  quotations: {
    id: string;
    vendorName: string;
    vendorRating: number;
    totalAmount: number;
    deliveryCharges: number;
    leadTimeDays: number;
    warranty: string | null;
    isRecommended: boolean;
    score: number;
  }[];
  recommendedId: string | null;
}

export interface ProcPurchaseOrderItem {
  id: string;
  poNumber: string;
  vendorName: string;
  status: string;
  totalAmount: number;
  expectedDate: string | null;
  itemCount: number;
  createdAt: string;
}

export interface ProcGrnItem {
  id: string;
  grnNumber: string;
  vendorName: string;
  poNumber: string | null;
  status: string;
  inspectionStatus: string;
  itemCount: number;
  receivedDate: string;
}

export interface ProcReturnItem {
  id: string;
  returnNumber: string;
  vendorName: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface ProcContractItem {
  id: string;
  contractNumber: string;
  vendorName: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface ProcBudgetItem {
  id: string;
  department: string;
  fiscalYear: number;
  budgetAmount: number;
  spentAmount: number;
  remaining: number;
  utilizationPercent: number;
}

export interface ProcInvoiceItem {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  poNumber: string | null;
  status: string;
  totalAmount: number;
  dueDate: string | null;
}

export interface ProcAnalyticsData {
  monthlyPurchases: { month: string; value: number }[];
  vendorPerformance: { name: string; rating: number; onTime: number }[];
  departmentSpending: { department: string; amount: number }[];
  purchaseCycleDays: number;
  costSavings: number;
  priceVariance: number;
  purchaseForecast: { month: string; forecast: number }[];
}

export interface ProcRealtimeEvent {
  type:
    | 'pr:update'
    | 'rfq:update'
    | 'quotation:received'
    | 'po:update'
    | 'grn:update'
    | 'approval:pending'
    | 'dashboard:update'
    | 'vendor:notification';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}
