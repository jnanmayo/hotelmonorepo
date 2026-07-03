/**
 * TungaOS Enterprise Finance & Accounting — Shared types
 */

export type AccountTypeName = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export type JournalEntryStatusType = 'DRAFT' | 'POSTED' | 'REVERSED';

export type FinVoucherTypeName =
  | 'JOURNAL'
  | 'PAYMENT'
  | 'RECEIPT'
  | 'EXPENSE'
  | 'CREDIT_NOTE'
  | 'DEBIT_NOTE'
  | 'CONTRA'
  | 'OPENING'
  | 'CLOSING';

export interface FinDashboardStats {
  todayRevenue: number;
  todayExpenses: number;
  todayProfit: number;
  cashBalance: number;
  bankBalance: number;
  outstandingReceivables: number;
  outstandingPayables: number;
  gstLiability: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  budgetUtilization: number;
  departmentRevenue: { department: string; amount: number }[];
  departmentCost: { department: string; amount: number }[];
  cashFlow: { date: string; inflow: number; outflow: number }[];
}

export interface FinAccountItem {
  id: string;
  code: string;
  name: string;
  type: AccountTypeName;
  subType: string | null;
  parentId: string | null;
  balance: number;
  level: number;
  isSystem: boolean;
  children?: FinAccountItem[];
}

export interface FinJournalEntryItem {
  id: string;
  entryNumber: string;
  status: JournalEntryStatusType;
  voucherType: FinVoucherTypeName;
  entryDate: string;
  description: string | null;
  totalDebit: number;
  totalCredit: number;
  isAutoPosted: boolean;
  sourceModule: string | null;
}

export interface FinJournalLineItem {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string | null;
}

export interface FinReceivableItem {
  id: string;
  type: string;
  partyName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string | null;
  status: string;
  sourceModule: string | null;
}

export interface FinPayableItem {
  id: string;
  type: string;
  partyName: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string | null;
  status: string;
  paymentTerms: string | null;
}

export interface FinExpenseItem {
  id: string;
  expenseNumber: string;
  categoryName: string;
  amount: number;
  gstAmount: number;
  status: string;
  department: string | null;
  vendorName: string | null;
  expenseDate: string;
}

export interface FinIncomeItem {
  id: string;
  incomeNumber: string;
  type: string;
  amount: number;
  description: string | null;
  incomeDate: string;
  reference: string | null;
}

export interface FinBankAccountItem {
  id: string;
  name: string;
  bankName: string | null;
  accountNumber: string | null;
  type: string;
  currentBalance: number;
  currency: string;
}

export interface FinBudgetItem {
  id: string;
  name: string;
  fiscalYear: number;
  budgetAmount: number;
  spentAmount: number;
  utilizationPct: number;
  costCenterName: string | null;
  status: string;
}

export interface FinCostCenterItem {
  id: string;
  code: string;
  name: string;
  department: string | null;
}

export interface FinGstSummary {
  cgstOutput: number;
  sgstOutput: number;
  igstOutput: number;
  cgstInput: number;
  sgstInput: number;
  igstInput: number;
  netLiability: number;
  periodMonth: number;
  periodYear: number;
}

export interface FinTrialBalanceRow {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface FinOwnerDashboardStats {
  revenue: number;
  expenses: number;
  profit: number;
  netProfitMargin: number;
  ebitda: number;
  cashFlow: number;
  gstLiability: number;
  outstandingReceivables: number;
  outstandingPayables: number;
  departmentProfitability: { department: string; revenue: number; cost: number; profit: number }[];
  revenueTrend: { month: string; revenue: number }[];
  expenseTrend: { month: string; expense: number }[];
}

export interface FinAnalyticsData {
  revPar: number;
  adr: number;
  occupancyPct: number;
  foodCostPct: number;
  payrollPct: number;
  avgDailyRevenue: number;
  revenueBySource: { source: string; amount: number }[];
  expenseByCategory: { category: string; amount: number }[];
  cashFlowForecast: { month: string; projected: number }[];
}

export interface FinApprovalItem {
  id: string;
  entityType: string;
  entityId: string;
  level: number;
  status: string;
  createdAt: string;
}

export interface FinRealtimeEvent {
  type:
    | 'dashboard:update'
    | 'journal:update'
    | 'revenue:update'
    | 'cash:update'
    | 'approval:pending';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export const DEFAULT_CHART_OF_ACCOUNTS = [
  { code: '1000', name: 'Assets', type: 'ASSET', subType: 'CURRENT_ASSET', level: 0 },
  { code: '1100', name: 'Current Assets', type: 'ASSET', subType: 'CURRENT_ASSET', level: 1, parentCode: '1000' },
  { code: '1110', name: 'Cash in Hand', type: 'ASSET', subType: 'CURRENT_ASSET', level: 2, parentCode: '1100' },
  { code: '1120', name: 'Bank Accounts', type: 'ASSET', subType: 'CURRENT_ASSET', level: 2, parentCode: '1100' },
  { code: '1130', name: 'Accounts Receivable', type: 'ASSET', subType: 'CURRENT_ASSET', level: 2, parentCode: '1100' },
  { code: '1200', name: 'Fixed Assets', type: 'ASSET', subType: 'FIXED_ASSET', level: 1, parentCode: '1000' },
  { code: '1210', name: 'Property & Equipment', type: 'ASSET', subType: 'FIXED_ASSET', level: 2, parentCode: '1200' },
  { code: '2000', name: 'Liabilities', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', level: 0 },
  { code: '2100', name: 'Current Liabilities', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', level: 1, parentCode: '2000' },
  { code: '2110', name: 'Accounts Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', level: 2, parentCode: '2100' },
  { code: '2120', name: 'GST Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', level: 2, parentCode: '2100' },
  { code: '2130', name: 'TDS Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', level: 2, parentCode: '2100' },
  { code: '3000', name: 'Equity', type: 'EQUITY', subType: 'EQUITY', level: 0 },
  { code: '3100', name: 'Owner Equity', type: 'EQUITY', subType: 'EQUITY', level: 1, parentCode: '3000' },
  { code: '4000', name: 'Revenue', type: 'REVENUE', subType: 'OPERATING_REVENUE', level: 0 },
  { code: '4100', name: 'Room Revenue', type: 'REVENUE', subType: 'OPERATING_REVENUE', level: 1, parentCode: '4000' },
  { code: '4200', name: 'Restaurant Revenue', type: 'REVENUE', subType: 'OPERATING_REVENUE', level: 1, parentCode: '4000' },
  { code: '4210', name: 'Bar Revenue', type: 'REVENUE', subType: 'OPERATING_REVENUE', level: 2, parentCode: '4200' },
  { code: '4300', name: 'Spa Revenue', type: 'REVENUE', subType: 'OPERATING_REVENUE', level: 1, parentCode: '4000' },
  { code: '4400', name: 'Laundry Revenue', type: 'REVENUE', subType: 'OPERATING_REVENUE', level: 1, parentCode: '4000' },
  { code: '4500', name: 'Other Income', type: 'REVENUE', subType: 'OTHER_INCOME', level: 1, parentCode: '4000' },
  { code: '5000', name: 'Expenses', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', level: 0 },
  { code: '5100', name: 'Food Cost', type: 'EXPENSE', subType: 'COST_OF_GOODS', level: 1, parentCode: '5000' },
  { code: '5200', name: 'Salary & Wages', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', level: 1, parentCode: '5000' },
  { code: '5300', name: 'Utilities', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', level: 1, parentCode: '5000' },
  { code: '5310', name: 'Electricity', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', level: 2, parentCode: '5300' },
  { code: '5320', name: 'Water', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', level: 2, parentCode: '5300' },
  { code: '5400', name: 'Maintenance', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', level: 1, parentCode: '5000' },
  { code: '5500', name: 'Marketing', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', level: 1, parentCode: '5000' },
  { code: '5600', name: 'Depreciation', type: 'EXPENSE', subType: 'DEPRECIATION', level: 1, parentCode: '5000' },
] as const;

export const DEFAULT_COST_CENTERS = [
  'Rooms', 'Restaurant', 'Kitchen', 'Bar', 'Spa', 'Laundry',
  'Maintenance', 'Housekeeping', 'HR', 'Marketing', 'IT', 'Banquet',
] as const;

export const FINANCE_WORKFLOW_MERMAID = `flowchart TD
  A[Booking Engine] --> B[Guest Booking]
  B --> C[PMS]
  C --> D[Room Charges]
  D --> E[Restaurant POS]
  E --> F[Room Service]
  F --> G[Laundry]
  G --> H[Inventory]
  H --> I[Purchase]
  I --> J[Vendor Invoice]
  J --> K[Finance]
  K --> L[Journal Entry]
  L --> M[General Ledger]
  M --> N[Financial Statements]
  N --> O[Owner Dashboard]`;
