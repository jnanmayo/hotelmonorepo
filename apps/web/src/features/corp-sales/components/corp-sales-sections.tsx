'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Loader2, Smartphone, Sparkles } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CorpSalesShell } from '@/features/corp-sales/components/corp-sales-shell';
import { CORP_SALES_API } from '@/features/corp-sales/constants/corp-sales-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type {
  CorpAccountItem,
  CorpApprovalItem,
  CorpBillingInvoiceItem,
  CorpBookingItem,
  CorpCommissionItem,
  CorpCompanyItem,
  CorpContractItem,
  CorpCreditItem,
  CorpDocumentItem,
  CorpEmployeeItem,
  CorpMeetingItem,
  CorpPaymentItem,
  CorpPipelineStage,
  CorpRatePlanItem,
  CorpRenewalItem,
  CorpRoomAllocationItem,
  CorpSalesAnalyticsData,
  CorpSalesLeadItem,
  CorpSalesOwnerStats,
  CorpSalesTaskItem,
  CorpSalesTargetItem,
} from '@tungaos/shared';
import { CORP_SALES_ARCHITECTURE_MERMAID, CORP_SALES_WORKFLOW_MERMAID } from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <CorpSalesShell title={title} description={description}>
      <div className="flex justify-center py-16">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    </CorpSalesShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const pending = ['PENDING', 'DRAFT', 'NEW', 'NEGOTIATION'].some((x) => status.includes(x));
  const done = ['ACTIVE', 'APPROVED', 'WON', 'PAID', 'COMPLETED'].some((x) => status.includes(x));
  return (
    <Badge variant={pending ? 'secondary' : done ? 'default' : 'outline'}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-muted-foreground p-4 text-sm">
          No records yet. Initialize from the dashboard.
        </p>
      )}
    </div>
  );
}

export function CorpSalesCompaniesPage() {
  const [rows, setRows] = useState<CorpCompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpCompanyItem[] }>(CORP_SALES_API.companies)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Company Master"
        description="Corporate company database with GST, credit limits, and contacts"
      />
    );
  return (
    <CorpSalesShell
      title="Company Master"
      description="IT, Banking, Pharma, Government, TMC, and custom categories"
    >
      <DataTable
        headers={[
          'Code',
          'Company',
          'Industry',
          'GST',
          'Credit Limit',
          'Contracts',
          'Employees',
          'Revenue',
          'Status',
        ]}
        rows={rows.map((r) => [
          r.code,
          r.name,
          r.industry ?? r.category ?? '—',
          r.gstNumber ?? '—',
          `₹${r.creditLimit.toLocaleString('en-IN')}`,
          r.activeContracts,
          r.employeeCount,
          `₹${r.totalRevenue.toLocaleString('en-IN')}`,
          r.contractStatus ?? '—',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesAccountsPage() {
  const [rows, setRows] = useState<CorpAccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpAccountItem[] }>(CORP_SALES_API.accounts)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Key Account Management"
        description="Account managers, meetings, call logs, and follow-ups"
      />
    );
  return (
    <CorpSalesShell
      title="Key Account Management"
      description="Assign account managers, track meetings, and manage relationships"
    >
      <DataTable
        headers={[
          'Company',
          'Account Manager',
          'Team',
          'Last Meeting',
          'Next Action',
          'Revenue',
          'Status',
        ]}
        rows={rows.map((r) => [
          r.companyName,
          r.accountManager ?? '—',
          r.teamMembers,
          r.lastMeeting ?? '—',
          r.nextAction ?? '—',
          `₹${r.revenue.toLocaleString('en-IN')}`,
          r.contractStatus ?? '—',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesLeadsPage() {
  const [rows, setRows] = useState<CorpSalesLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpSalesLeadItem[] }>(CORP_SALES_API.leads)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Corporate Lead Management"
        description="Enterprise B2B lead capture and scoring"
      />
    );
  return (
    <CorpSalesShell
      title="Corporate Leads"
      description="Track lead score, expected revenue, room nights, and decision makers"
    >
      <pre className="bg-muted mb-4 overflow-x-auto rounded-lg p-3 text-xs">
        {CORP_SALES_WORKFLOW_MERMAID}
      </pre>
      <DataTable
        headers={[
          'Code',
          'Company',
          'Industry',
          'Source',
          'Status',
          'Score',
          'Revenue',
          'Room Nights',
          'Probability',
        ]}
        rows={rows.map((r) => [
          r.leadCode,
          r.companyName,
          r.industry ?? '—',
          r.source,
          <StatusBadge key="s" status={r.status} />,
          r.leadScore,
          r.expectedRevenue ? `₹${r.expectedRevenue.toLocaleString('en-IN')}` : '—',
          r.expectedRoomNights ?? '—',
          `${r.probability}%`,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesPipelinePage() {
  const [stages, setStages] = useState<CorpPipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpPipelineStage[] }>(CORP_SALES_API.pipeline)
      .then((r) => setStages(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return <Loading title="Sales Pipeline" description="Kanban board for corporate sales stages" />;
  return (
    <CorpSalesShell
      title="Sales Pipeline"
      description="New Lead → Qualified → Proposal → Contract → Won"
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <Card key={stage.stage} className="min-w-[220px] shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{stage.stage.replace(/_/g, ' ')}</span>
                <Badge variant="secondary">{stage.count}</Badge>
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                ₹{stage.value.toLocaleString('en-IN')}
              </p>
            </CardHeader>
            <CardContent className="max-h-64 space-y-2 overflow-y-auto">
              {stage.leads.map((l) => (
                <div key={l.id} className="rounded border p-2 text-xs">
                  <div className="font-medium">{l.companyName}</div>
                  <div className="text-muted-foreground">
                    {l.leadCode} · {l.probability}%
                  </div>
                </div>
              ))}
              {stage.leads.length === 0 && (
                <p className="text-muted-foreground text-xs">No leads</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </CorpSalesShell>
  );
}

export function CorpSalesContractsPage() {
  const [rows, setRows] = useState<CorpContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpContractItem[] }>(CORP_SALES_API.contracts)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Contract Management"
        description="Corporate contracts with rates, terms, and digital signature"
      />
    );
  return (
    <CorpSalesShell
      title="Corporate Contracts"
      description="Rate agreements, seasonal rates, blackout dates, SLA, and auto-renewal"
    >
      <DataTable
        headers={[
          'Contract #',
          'Company',
          'Title',
          'Status',
          'Rate Type',
          'Discount',
          'Start',
          'End',
          'Auto Renew',
        ]}
        rows={rows.map((r) => [
          r.contractNumber,
          r.companyName,
          r.title,
          <StatusBadge key="s" status={r.status} />,
          r.rateType,
          `${r.discountPct}%`,
          r.startsAt,
          r.endsAt,
          r.autoRenewal ? 'Yes' : 'No',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesRatesPage() {
  const [rows, setRows] = useState<CorpRatePlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpRatePlanItem[] }>(CORP_SALES_API.rates)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Corporate Rate Engine"
        description="Standard, long stay, project, crew, government, and volume rates"
      />
    );
  return (
    <CorpSalesShell
      title="Corporate Rate Management"
      description="Rate plans with approval workflow integrated with PMS"
    >
      <DataTable
        headers={[
          'Code',
          'Plan',
          'Company',
          'Type',
          'Status',
          'Base Rate',
          'Discount',
          'Valid From',
          'Valid To',
        ]}
        rows={rows.map((r) => [
          r.code,
          r.name,
          r.companyName,
          r.rateType.replace(/_/g, ' '),
          <StatusBadge key="s" status={r.status} />,
          `₹${r.baseRate.toLocaleString('en-IN')}`,
          `${r.discountPct}%`,
          r.validFrom ?? '—',
          r.validTo ?? '—',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesRoomAllocationPage() {
  const [rows, setRows] = useState<CorpRoomAllocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpRoomAllocationItem[] }>(CORP_SALES_API.roomAllocation)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Room Allocation"
        description="Reserve inventory for corporate, long stay, VIP, and conference"
      />
    );
  return (
    <CorpSalesShell
      title="Corporate Room Allocation"
      description="Realtime PMS integration for blocked corporate inventory"
    >
      <DataTable
        headers={['Company', 'Type', 'Rooms', 'Start', 'End', 'PMS Sync']}
        rows={rows.map((r) => [
          r.companyName,
          r.allocationType.replace(/_/g, ' '),
          r.roomCount,
          r.startDate,
          r.endDate,
          r.pmsSynced ? <Badge key="p">Synced</Badge> : 'Pending',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesBookingsPage() {
  const [rows, setRows] = useState<CorpBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpBookingItem[] }>(CORP_SALES_API.bookings)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Corporate Bookings"
        description="Employee, travel desk, bulk, recurring, and long stay bookings"
      />
    );
  return (
    <CorpSalesShell
      title="Corporate Bookings"
      description="Integrated with PMS reservations and corporate portal"
    >
      <DataTable
        headers={['Code', 'Company', 'Rooms', 'Check-in', 'Check-out', 'Amount', 'Reservations']}
        rows={rows.map((r) => [
          r.bookingCode,
          r.companyName,
          r.totalRooms,
          r.checkInDate,
          r.checkOutDate,
          `₹${r.totalAmount.toLocaleString('en-IN')}`,
          r.reservationCount,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesPortalPage() {
  return (
    <CorpSalesShell
      title="Corporate Portal"
      description="Dedicated B2B portal for company login, bookings, invoices, and approvals"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          'Company Dashboard',
          'Book Rooms',
          'Corporate Rates',
          'Booking History',
          'Invoices & Statements',
          'Credit Balance',
          'Employee Management',
          'Travel Desk',
          'Approval Workflow',
          'Download Reports',
        ].map((f) => (
          <Card key={f}>
            <CardContent className="p-4">
              <div className="font-medium">{f}</div>
              <div className="text-muted-foreground mt-1 text-sm">
                Corporate self-service portal integrated with PMS and Finance
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CorpSalesShell>
  );
}

export function CorpSalesEmployeesPage() {
  const [rows, setRows] = useState<CorpEmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpEmployeeItem[] }>(CORP_SALES_API.employees)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Corporate Employee Management"
        description="Employees, departments, travel policy, and cost centres"
      />
    );
  return (
    <CorpSalesShell
      title="Corporate Employees"
      description="Managed by corporate admin with approval matrix"
    >
      <DataTable
        headers={['Company', 'Name', 'Email', 'Phone', 'Department']}
        rows={rows.map((r) => [
          r.companyName,
          `${r.firstName} ${r.lastName}`,
          r.email ?? '—',
          r.phone ?? '—',
          r.department ?? '—',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesTravelDeskPage() {
  return (
    <CorpSalesShell
      title="Travel Desk Integration"
      description="Corporate transport integrated with Enterprise Travel Desk & Fleet Management"
    >
      <div className="mb-4">
        <Button asChild>
          <Link href={asRoute('/app/travel-desk')}>Open Travel Desk & Fleet Platform</Link>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          'Book Room',
          'Airport Pickup',
          'Airport Drop',
          'Meeting Room',
          'Restaurant Booking',
          'Banquet Booking',
          'Corporate Transport',
        ].map((s) => (
          <Card key={s}>
            <CardContent className="p-4">
              <div className="font-medium">{s}</div>
              <div className="text-muted-foreground mt-1 text-sm">
                Integrated with PMS, Events, Restaurant & Travel Desk TMS
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CorpSalesShell>
  );
}

export function CorpSalesApprovalsPage() {
  const [rows, setRows] = useState<CorpApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpApprovalItem[] }>(CORP_SALES_API.approvals)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Approval Workflow"
        description="Travel desk, department, finance, company, and hotel approvals"
      />
    );
  return (
    <CorpSalesShell
      title="Approval Workflow"
      description="Multi-level approval for rates, contracts, and bookings"
    >
      <DataTable
        headers={['Company', 'Type', 'Title', 'Status', 'Created']}
        rows={rows.map((r) => [
          r.companyName,
          r.approvalType.replace(/_/g, ' '),
          r.title,
          <StatusBadge key="s" status={r.status} />,
          r.createdAt,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesBillingPage() {
  const [rows, setRows] = useState<CorpBillingInvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpBillingInvoiceItem[] }>(CORP_SALES_API.billing)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Monthly Billing"
        description="Consolidated, GST, department, employee, and cost centre invoices"
      />
    );
  return (
    <CorpSalesShell
      title="Monthly Billing"
      description="Integrated with Finance for GST invoices and statements"
    >
      <DataTable
        headers={['Invoice #', 'Company', 'Period', 'Type', 'Total', 'Paid', 'Status', 'Due']}
        rows={rows.map((r) => [
          r.invoiceNumber,
          r.companyName,
          r.billingPeriod,
          r.invoiceType,
          `₹${r.totalAmount.toLocaleString('en-IN')}`,
          `₹${r.paidAmount.toLocaleString('en-IN')}`,
          <StatusBadge key="s" status={r.status} />,
          r.dueDate ?? '—',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesCreditPage() {
  const [rows, setRows] = useState<CorpCreditItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpCreditItem[] }>(CORP_SALES_API.credit)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Credit Management"
        description="Credit limits, outstanding, ageing, and blocking"
      />
    );
  return (
    <CorpSalesShell
      title="Credit Management"
      description="Track available credit, overdue amounts, and credit blocking"
    >
      <DataTable
        headers={['Company', 'Limit', 'Available', 'Outstanding', 'Overdue', 'Blocked']}
        rows={rows.map((r) => [
          r.companyName,
          `₹${r.creditLimit.toLocaleString('en-IN')}`,
          `₹${r.availableCredit.toLocaleString('en-IN')}`,
          `₹${r.outstandingAmount.toLocaleString('en-IN')}`,
          `₹${r.overdueAmount.toLocaleString('en-IN')}`,
          r.isBlocked ? (
            <Badge key="b" variant="danger">
              Blocked
            </Badge>
          ) : (
            'No'
          ),
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesCollectionsPage() {
  const [rows, setRows] = useState<CorpPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpPaymentItem[] }>(CORP_SALES_API.collections)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Payment Collection"
        description="Invoices, receipts, reminders, and follow-ups"
      />
    );
  return (
    <CorpSalesShell
      title="Payment Collection"
      description="Track receipts, outstanding, and payment follow-up"
    >
      <DataTable
        headers={['Company', 'Amount', 'Reference', 'Paid At']}
        rows={rows.map((r) => [
          r.companyName,
          `₹${r.amount.toLocaleString('en-IN')}`,
          r.reference ?? '—',
          new Date(r.paidAt).toLocaleString(),
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesMeetingsPage() {
  const [rows, setRows] = useState<CorpMeetingItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpMeetingItem[] }>(CORP_SALES_API.meetings)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Meeting Management"
        description="Meeting dates, participants, agenda, minutes, and action items"
      />
    );
  return (
    <CorpSalesShell
      title="Sales Meetings"
      description="Track client meetings, minutes, and follow-up dates"
    >
      <DataTable
        headers={['Company', 'Title', 'Date', 'Status', 'Follow-up']}
        rows={rows.map((r) => [
          r.companyName,
          r.title,
          new Date(r.meetingDate).toLocaleString(),
          <StatusBadge key="s" status={r.status} />,
          r.followUpDate ?? '—',
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesTasksPage() {
  const [rows, setRows] = useState<CorpSalesTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpSalesTaskItem[] }>(CORP_SALES_API.tasks)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Task Management"
        description="Call, visit, proposal, renewal, and payment reminders"
      />
    );
  return (
    <CorpSalesShell
      title="Sales Tasks"
      description="Automated reminders for calls, visits, renewals, and payments"
    >
      <DataTable
        headers={['Company', 'Type', 'Task', 'Due', 'Status']}
        rows={rows.map((r) => [
          r.companyName ?? '—',
          r.taskType.replace(/_/g, ' '),
          r.title,
          r.dueDate ? new Date(r.dueDate).toLocaleString() : '—',
          <StatusBadge key="s" status={r.status} />,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesRenewalsPage() {
  const [rows, setRows] = useState<CorpRenewalItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpRenewalItem[] }>(CORP_SALES_API.renewals)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Renewal Management"
        description="90/60/30/15/7 day expiry notifications and renewal pipeline"
      />
    );
  return (
    <CorpSalesShell
      title="Contract Renewals"
      description="Automated renewal notifications and pipeline"
    >
      <DataTable
        headers={['Company', 'Contract', 'Expiry', 'Notify Days', 'Status']}
        rows={rows.map((r) => [
          r.companyName,
          r.contractNumber,
          r.expiryDate,
          r.notifyDays,
          r.status,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesDocumentsPage() {
  const [rows, setRows] = useState<CorpDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpDocumentItem[] }>(CORP_SALES_API.documents)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Document Management"
        description="Contracts, NDA, GST, PAN, PO, rate agreements, and emails"
      />
    );
  return (
    <CorpSalesShell
      title="Document Vault"
      description="Encrypted storage for corporate sales documents"
    >
      <DataTable
        headers={['Company', 'Type', 'Title', 'Uploaded']}
        rows={rows.map((r) => [
          r.companyName,
          r.documentType.replace(/_/g, ' '),
          r.title,
          r.uploadedAt,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesTargetsPage() {
  const [rows, setRows] = useState<CorpSalesTargetItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpSalesTargetItem[] }>(CORP_SALES_API.targets)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Sales Targets"
        description="Monthly, quarterly, and annual revenue and room night targets"
      />
    );
  return (
    <CorpSalesShell
      title="Sales Targets"
      description="Revenue and room night targets with achievement tracking"
    >
      <DataTable
        headers={['Period', 'Type', 'Revenue Target', 'Achieved', 'Room Nights', 'Achievement']}
        rows={rows.map((r) => [
          r.periodLabel,
          r.periodType,
          `₹${r.revenueTarget.toLocaleString('en-IN')}`,
          `₹${r.achievedRevenue.toLocaleString('en-IN')}`,
          `${r.achievedRoomNights}/${r.roomNightTarget}`,
          `${r.achievementPct}%`,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesCommissionsPage() {
  const [rows, setRows] = useState<CorpCommissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpCommissionItem[] }>(CORP_SALES_API.commissions)
      .then((r) => setRows(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Commission Management"
        description="Sales executive, referral, and travel agent commissions"
      />
    );
  return (
    <CorpSalesShell
      title="Sales Commissions"
      description="Track commissions and performance bonuses"
    >
      <DataTable
        headers={['Recipient', 'Company', 'Type', 'Amount', 'Status']}
        rows={rows.map((r) => [
          r.recipientName,
          r.companyName ?? '—',
          r.commissionType,
          `₹${r.commissionAmount.toLocaleString('en-IN')}`,
          r.status,
        ])}
      />
    </CorpSalesShell>
  );
}

export function CorpSalesOwnerPage() {
  const [stats, setStats] = useState<CorpSalesOwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpSalesOwnerStats }>(CORP_SALES_API.ownerDashboard)
      .then((r) => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Owner Dashboard"
        description="Corporate revenue, forecast, renewal rate, and occupancy"
      />
    );
  const s = stats!;
  return (
    <CorpSalesShell
      title="Owner Sales Dashboard"
      description="Executive B2B revenue and forecast overview"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">Corporate Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{s.corporateRevenue.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{s.revenueForecast.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">Renewal Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.contractRenewalRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">Avg Contract Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{s.averageContractValue.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">Room Night Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.roomNightForecast}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">Corporate Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.corporateOccupancyPct}%</div>
          </CardContent>
        </Card>
      </div>
    </CorpSalesShell>
  );
}

export function CorpSalesAnalyticsPage() {
  const [data, setData] = useState<CorpSalesAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient
      .get<{ data: CorpSalesAnalyticsData }>(CORP_SALES_API.analytics)
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Loading
        title="Corporate Analytics"
        description="Revenue, funnel, industry, and forecast analysis"
      />
    );
  const d = data!;
  return (
    <CorpSalesShell
      title="Analytics"
      description="Corporate revenue, lead conversion, and sales performance"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.revenueByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales Funnel</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.salesFunnel}>
                <XAxis dataKey="stage" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.forecast}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="projected" stroke="hsl(var(--primary))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </CorpSalesShell>
  );
}

export function CorpSalesReportsPage() {
  const [report, setReport] = useState<{ type: string; summary: Record<string, number> } | null>(
    null,
  );
  useEffect(() => {
    apiClient.get(CORP_SALES_API.report('summary')).then((r) => setReport(r.data.data));
  }, []);
  return (
    <CorpSalesShell
      title="Corporate Sales Reports"
      description="Register, contracts, leads, revenue, outstanding, credit, renewals"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {['companies', 'contracts', 'leads', 'outstanding', 'credit', 'renewals', 'meetings'].map(
          (t) => (
            <Button
              key={t}
              variant="outline"
              size="sm"
              onClick={() =>
                apiClient.get(CORP_SALES_API.report(t)).then((r) => setReport(r.data.data))
              }
            >
              {t}
            </Button>
          ),
        )}
      </div>
      {report && (
        <Card>
          <CardContent className="space-y-1 p-4 text-sm">
            <div className="font-medium capitalize">{report.type} Report</div>
            {Object.entries(report.summary).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </CorpSalesShell>
  );
}

export function CorpSalesNotificationsPage() {
  return (
    <CorpSalesShell
      title="Notifications"
      description="Lead assigned, meeting reminders, contract expiry, payment overdue"
    >
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Bell className="text-muted-foreground h-16 w-16" />
        <div className="text-muted-foreground grid max-w-lg gap-2 text-left text-sm">
          <p>• Lead assigned to sales executive</p>
          <p>• Meeting reminder notifications</p>
          <p>• Proposal sent confirmation</p>
          <p>• Contract expiring (90/60/30/15/7 days)</p>
          <p>• Payment overdue and credit limit alerts</p>
          <p>• Corporate booking and renewal due notifications</p>
        </div>
      </div>
    </CorpSalesShell>
  );
}

export function CorpSalesMobilePage() {
  return (
    <CorpSalesShell
      title="Corporate Sales Mobile Apps"
      description="Sales Executive, KAM, Corporate Portal, and Owner Dashboard"
    >
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Smartphone className="text-muted-foreground h-16 w-16" />
        <p className="text-muted-foreground max-w-md text-sm">
          Native mobile apps for field sales, key account management, corporate self-service, and
          executive dashboards.
        </p>
      </div>
    </CorpSalesShell>
  );
}

export function CorpSalesAiPage() {
  return (
    <CorpSalesShell
      title="AI Sales Intelligence"
      description="Predict conversion, revenue, churn, and contract renewals"
    >
      <pre className="bg-muted mb-4 overflow-x-auto rounded-lg p-3 text-xs">
        {CORP_SALES_ARCHITECTURE_MERMAID}
      </pre>
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <Sparkles className="text-muted-foreground h-16 w-16" />
        <div className="text-muted-foreground grid max-w-lg gap-2 text-sm">
          <p>• Predict lead conversion probability</p>
          <p>• Forecast corporate revenue and room nights</p>
          <p>• Identify high-value accounts for upselling</p>
          <p>• Contract renewal prediction</p>
          <p>• Corporate churn prediction and sales forecasting</p>
        </div>
      </div>
    </CorpSalesShell>
  );
}
