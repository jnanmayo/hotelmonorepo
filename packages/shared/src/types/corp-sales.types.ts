/**
 * TungaOS Enterprise Corporate Sales & Contract Management — Shared types
 */

export interface CorpSalesDashboardStats {
  corporateLeads: number;
  qualifiedLeads: number;
  proposalsSent: number;
  contractsActive: number;
  contractsExpiring: number;
  corporateRevenue: number;
  averageContractValue: number;
  topCorporateClients: { name: string; revenue: number }[];
  monthlyRoomNights: number;
  corporateOccupancyPct: number;
  corporateAdr: number;
  corporateRevpar: number;
  creditOutstanding: number;
  collectionStatusPct: number;
  salesTarget: number;
  salesAchievementPct: number;
  pipelineByStage: { stage: string; count: number; value: number }[];
}

export interface CorpSalesOwnerStats {
  corporateRevenue: number;
  topCompanies: { name: string; revenue: number; roomNights: number }[];
  topSalesExecutive: { name: string; revenue: number } | null;
  revenueForecast: number;
  contractRenewalRate: number;
  averageContractValue: number;
  roomNightForecast: number;
  corporateOccupancyPct: number;
}

export interface CorpSalesAnalyticsData {
  revenueByMonth: { month: string; revenue: number }[];
  leadConversion: { stage: string; count: number }[];
  salesFunnel: { stage: string; value: number }[];
  industryAnalysis: { industry: string; revenue: number }[];
  roomNightTrend: { month: string; nights: number }[];
  forecast: { month: string; projected: number }[];
}

export interface CorpCompanyItem {
  id: string;
  code: string;
  name: string;
  industry: string | null;
  category: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  email: string | null;
  phone: string | null;
  creditLimit: number;
  contractStatus: string | null;
  employeeCount: number;
  activeContracts: number;
  totalRevenue: number;
}

export interface CorpAccountItem {
  id: string;
  companyName: string;
  accountManager: string | null;
  teamMembers: number;
  lastMeeting: string | null;
  nextAction: string | null;
  contractStatus: string | null;
  revenue: number;
}

export interface CorpSalesLeadItem {
  id: string;
  leadCode: string;
  companyName: string;
  industry: string | null;
  contactName: string | null;
  email: string | null;
  source: string;
  status: string;
  leadScore: number;
  expectedRevenue: number | null;
  expectedRoomNights: number | null;
  probability: number;
  assignedTo: string | null;
  createdAt: string;
}

export interface CorpPipelineStage {
  stage: string;
  count: number;
  value: number;
  leads: CorpSalesLeadItem[];
}

export interface CorpContractItem {
  id: string;
  contractNumber: string;
  companyName: string;
  title: string;
  status: string;
  rateType: string;
  discountPct: number;
  startsAt: string;
  endsAt: string;
  autoRenewal: boolean;
  signedAt: string | null;
}

export interface CorpRatePlanItem {
  id: string;
  code: string;
  name: string;
  companyName: string;
  rateType: string;
  status: string;
  baseRate: number;
  discountPct: number;
  validFrom: string | null;
  validTo: string | null;
}

export interface CorpRoomAllocationItem {
  id: string;
  companyName: string;
  allocationType: string;
  roomCount: number;
  startDate: string;
  endDate: string;
  pmsSynced: boolean;
}

export interface CorpBookingItem {
  id: string;
  bookingCode: string;
  companyName: string;
  totalRooms: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  reservationCount: number;
}

export interface CorpEmployeeItem {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  department: string | null;
}

export interface CorpMeetingItem {
  id: string;
  companyName: string;
  title: string;
  meetingDate: string;
  status: string;
  followUpDate: string | null;
}

export interface CorpSalesTaskItem {
  id: string;
  companyName: string | null;
  taskType: string;
  title: string;
  dueDate: string | null;
  status: string;
}

export interface CorpBillingInvoiceItem {
  id: string;
  invoiceNumber: string;
  companyName: string;
  billingPeriod: string;
  invoiceType: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  dueDate: string | null;
}

export interface CorpCreditItem {
  id: string;
  companyName: string;
  creditLimit: number;
  availableCredit: number;
  outstandingAmount: number;
  overdueAmount: number;
  isBlocked: boolean;
}

export interface CorpPaymentItem {
  id: string;
  companyName: string;
  amount: number;
  reference: string | null;
  paidAt: string;
}

export interface CorpRenewalItem {
  id: string;
  companyName: string;
  contractNumber: string;
  expiryDate: string;
  notifyDays: number;
  status: string;
}

export interface CorpDocumentItem {
  id: string;
  companyName: string;
  documentType: string;
  title: string;
  uploadedAt: string;
}

export interface CorpSalesTargetItem {
  id: string;
  periodType: string;
  periodLabel: string;
  revenueTarget: number;
  roomNightTarget: number;
  achievedRevenue: number;
  achievedRoomNights: number;
  achievementPct: number;
}

export interface CorpCommissionItem {
  id: string;
  recipientName: string;
  companyName: string | null;
  commissionType: string;
  commissionAmount: number;
  status: string;
}

export interface CorpApprovalItem {
  id: string;
  companyName: string;
  approvalType: string;
  title: string;
  status: string;
  createdAt: string;
}

export interface CorpSalesRealtimeEvent {
  type:
    | 'dashboard:update'
    | 'lead:update'
    | 'booking:update'
    | 'credit:update'
    | 'contract:update'
    | 'approval:update';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export const CORP_SALES_WORKFLOW_MERMAID = `flowchart TD
  A[Lead Generated] --> B[Sales Executive Assigned]
  B --> C[First Meeting]
  C --> D[Requirement Analysis]
  D --> E[Proposal]
  E --> F[Negotiation]
  F --> G[Corporate Contract]
  G --> H[Approval]
  H --> I[Rate Configuration]
  I --> J[Corporate Portal Activated]
  J --> K[Bookings]
  K --> L[Monthly Billing]
  L --> M[Renewal]`;

export const CORP_SALES_ARCHITECTURE_MERMAID = `flowchart LR
  subgraph Sales
    L[Leads] --> P[Pipeline]
    P --> C[Contracts]
  end
  subgraph Account
    KAM[Key Accounts] --> M[Meetings]
    R[Rates] --> RA[Room Allocation]
  end
  subgraph Billing
    CR[Credit] --> BI[Monthly Invoices]
    BI --> COL[Collections]
  end
  C --> Account
  Account --> Billing
  Billing --> RN[Renewals]`;
