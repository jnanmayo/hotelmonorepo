import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CorpSalesRealtimeGateway } from '@/modules/corp-sales/gateways/corp-sales-realtime.gateway';

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
  CorpRatePlanItem,
  CorpRenewalItem,
  CorpRoomAllocationItem,
  CorpSalesTaskItem,
  CorpSalesTargetItem,
  CreateCorpCompanySchema,
  CreateCorpMeetingSchema,
} from '@tungaos/shared';

@Injectable()
export class CorpSalesOperationsService {
  constructor(
    private prisma: PrismaService,
    private realtime: CorpSalesRealtimeGateway,
  ) {}

  async listCompanies(hotelId: string): Promise<CorpCompanyItem[]> {
    const rows = await this.prisma.corporateCompany.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        employees: { where: { deletedAt: null } },
        contracts: { where: { deletedAt: null, status: 'ACTIVE' } },
        bookings: { where: { deletedAt: null }, select: { totalAmount: true } },
      },
      orderBy: { name: 'asc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      industry: r.industry,
      category: r.category,
      gstNumber: r.gstNumber,
      panNumber: r.panNumber,
      email: r.email,
      phone: r.phone,
      creditLimit: Number(r.creditLimit),
      contractStatus: r.contractStatus,
      employeeCount: r.employees.length,
      activeContracts: r.contracts.length,
      totalRevenue: r.bookings.reduce((s, b) => s + Number(b.totalAmount), 0),
    }));
  }

  async createCompany(hotelId: string, dto: CreateCorpCompanySchema) {
    const company = await this.prisma.corporateCompany.create({
      data: {
        hotelId,
        code: dto.code,
        name: dto.name,
        industry: dto.industry,
        category: dto.category,
        gstNumber: dto.gstNumber,
        panNumber: dto.panNumber,
        email: dto.email,
        phone: dto.phone,
        website: dto.website,
        creditLimit: dto.creditLimit ?? 0,
        paymentTerms: dto.paymentTerms,
      },
    });
    await this.prisma.corpCreditAccount.create({
      data: {
        hotelId,
        companyId: company.id,
        creditLimit: dto.creditLimit ?? 0,
        availableCredit: dto.creditLimit ?? 0,
      },
    });
    this.realtime.notifyDashboard(hotelId);
    return company;
  }

  async listAccounts(hotelId: string): Promise<CorpAccountItem[]> {
    const rows = await this.prisma.corporateCompany.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        accountTeam: true,
        meetings: { orderBy: { meetingDate: 'desc' }, take: 1 },
        activities: { orderBy: { occurredAt: 'desc' }, take: 1 },
        bookings: { where: { deletedAt: null }, select: { totalAmount: true } },
      },
      take: 100,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.name,
      accountManager: r.accountTeam.find((t) => t.role === 'ACCOUNT_MANAGER')?.staffName ?? null,
      teamMembers: r.accountTeam.length,
      lastMeeting: r.meetings[0]?.meetingDate.toISOString().slice(0, 10) ?? null,
      nextAction: r.activities[0]?.nextAction ?? null,
      contractStatus: r.contractStatus,
      revenue: r.bookings.reduce((s, b) => s + Number(b.totalAmount), 0),
    }));
  }

  async listContracts(hotelId: string): Promise<CorpContractItem[]> {
    const rows = await this.prisma.corporateContract.findMany({
      where: { hotelId, deletedAt: null },
      include: { company: true },
      orderBy: { endsAt: 'asc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      contractNumber: r.contractNumber,
      companyName: r.company.name,
      title: r.title,
      status: r.status,
      rateType: r.rateType,
      discountPct: Number(r.discountPct),
      startsAt: r.startsAt.toISOString().slice(0, 10),
      endsAt: r.endsAt.toISOString().slice(0, 10),
      autoRenewal: r.autoRenewal,
      signedAt: r.signedAt?.toISOString() ?? null,
    }));
  }

  async listRatePlans(hotelId: string): Promise<CorpRatePlanItem[]> {
    const rows = await this.prisma.corpRatePlan.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      companyName: r.company.name,
      rateType: r.rateType,
      status: r.status,
      baseRate: Number(r.baseRate),
      discountPct: Number(r.discountPct),
      validFrom: r.validFrom?.toISOString().slice(0, 10) ?? null,
      validTo: r.validTo?.toISOString().slice(0, 10) ?? null,
    }));
  }

  async listRoomAllocations(hotelId: string): Promise<CorpRoomAllocationItem[]> {
    const rows = await this.prisma.corpRoomAllocation.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { startDate: 'asc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      allocationType: r.allocationType,
      roomCount: r.roomCount,
      startDate: r.startDate.toISOString().slice(0, 10),
      endDate: r.endDate.toISOString().slice(0, 10),
      pmsSynced: r.pmsSynced,
    }));
  }

  async listBookings(hotelId: string): Promise<CorpBookingItem[]> {
    const rows = await this.prisma.corporateBooking.findMany({
      where: { hotelId, deletedAt: null },
      include: { company: true, reservations: true },
      orderBy: { checkInDate: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      bookingCode: r.bookingCode,
      companyName: r.company.name,
      totalRooms: r.totalRooms,
      checkInDate: r.checkInDate.toISOString().slice(0, 10),
      checkOutDate: r.checkOutDate.toISOString().slice(0, 10),
      totalAmount: Number(r.totalAmount),
      reservationCount: r.reservations.length,
    }));
  }

  async listEmployees(hotelId: string): Promise<CorpEmployeeItem[]> {
    const rows = await this.prisma.corporateEmployee.findMany({
      where: { hotelId, deletedAt: null },
      include: { company: true },
      orderBy: { lastName: 'asc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      phone: r.phone,
      department: r.department,
    }));
  }

  async listMeetings(hotelId: string): Promise<CorpMeetingItem[]> {
    const rows = await this.prisma.corpSalesMeeting.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { meetingDate: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      title: r.title,
      meetingDate: r.meetingDate.toISOString(),
      status: r.status,
      followUpDate: r.followUpDate?.toISOString().slice(0, 10) ?? null,
    }));
  }

  async createMeeting(hotelId: string, dto: CreateCorpMeetingSchema) {
    const meeting = await this.prisma.corpSalesMeeting.create({
      data: {
        hotelId,
        companyId: dto.companyId,
        title: dto.title,
        meetingDate: new Date(dto.meetingDate),
        agenda: dto.agenda,
        followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : undefined,
      },
    });
    this.realtime.notifyDashboard(hotelId);
    return meeting;
  }

  async listTasks(hotelId: string): Promise<CorpSalesTaskItem[]> {
    const rows = await this.prisma.corpSalesTask.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { dueDate: 'asc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company?.name ?? null,
      taskType: r.taskType,
      title: r.title,
      dueDate: r.dueDate?.toISOString() ?? null,
      status: r.status,
    }));
  }

  async listInvoices(hotelId: string): Promise<CorpBillingInvoiceItem[]> {
    const rows = await this.prisma.corpBillingInvoice.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      invoiceNumber: r.invoiceNumber,
      companyName: r.company.name,
      billingPeriod: r.billingPeriod,
      invoiceType: r.invoiceType,
      totalAmount: Number(r.totalAmount),
      paidAmount: Number(r.paidAmount),
      status: r.status,
      dueDate: r.dueDate?.toISOString().slice(0, 10) ?? null,
    }));
  }

  async listCredit(hotelId: string): Promise<CorpCreditItem[]> {
    const rows = await this.prisma.corpCreditAccount.findMany({
      where: { hotelId },
      include: { company: true },
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      creditLimit: Number(r.creditLimit),
      availableCredit: Number(r.availableCredit),
      outstandingAmount: Number(r.outstandingAmount),
      overdueAmount: Number(r.overdueAmount),
      isBlocked: r.isBlocked,
    }));
  }

  async listPayments(hotelId: string): Promise<CorpPaymentItem[]> {
    const rows = await this.prisma.corpBillingPayment.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { paidAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      amount: Number(r.amount),
      reference: r.reference,
      paidAt: r.paidAt.toISOString(),
    }));
  }

  async listRenewals(hotelId: string): Promise<CorpRenewalItem[]> {
    const rows = await this.prisma.corpContractRenewal.findMany({
      where: { hotelId },
      include: { company: true, contract: true },
      orderBy: { expiryDate: 'asc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      contractNumber: r.contract.contractNumber,
      expiryDate: r.expiryDate.toISOString().slice(0, 10),
      notifyDays: r.notifyDays,
      status: r.status,
    }));
  }

  async listDocuments(hotelId: string): Promise<CorpDocumentItem[]> {
    const rows = await this.prisma.corpSalesDocument.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { uploadedAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      documentType: r.documentType,
      title: r.title,
      uploadedAt: r.uploadedAt.toISOString().slice(0, 10),
    }));
  }

  async listTargets(hotelId: string): Promise<CorpSalesTargetItem[]> {
    const rows = await this.prisma.corpSalesTarget.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return rows.map((r) => ({
      id: r.id,
      periodType: r.periodType,
      periodLabel: r.periodLabel,
      revenueTarget: Number(r.revenueTarget),
      roomNightTarget: r.roomNightTarget,
      achievedRevenue: Number(r.achievedRevenue),
      achievedRoomNights: r.achievedRoomNights,
      achievementPct: Number(r.revenueTarget) > 0
        ? Math.round((Number(r.achievedRevenue) / Number(r.revenueTarget)) * 100)
        : 0,
    }));
  }

  async listCommissions(hotelId: string): Promise<CorpCommissionItem[]> {
    const rows = await this.prisma.corpSalesCommission.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      recipientName: r.recipientName,
      companyName: r.company?.name ?? null,
      commissionType: r.commissionType,
      commissionAmount: Number(r.commissionAmount),
      status: r.status,
    }));
  }

  async listApprovals(hotelId: string): Promise<CorpApprovalItem[]> {
    const rows = await this.prisma.corpApprovalRequest.findMany({
      where: { hotelId },
      include: { company: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      companyName: r.company.name,
      approvalType: r.approvalType,
      title: r.title,
      status: r.status,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }));
  }
}
