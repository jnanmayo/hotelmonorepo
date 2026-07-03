import { Injectable, NotFoundException } from '@nestjs/common';
import { CorpContractStatus, CorpSalesLeadStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CorpSalesRealtimeGateway } from '@/modules/corp-sales/gateways/corp-sales-realtime.gateway';

import type {
  CorpPipelineStage,
  CorpSalesLeadItem,
  CreateCorpSalesLeadSchema,
  UpdateCorpSalesLeadStatusSchema,
} from '@tungaos/shared';

@Injectable()
export class CorpSalesLeadService {
  constructor(
    private prisma: PrismaService,
    private realtime: CorpSalesRealtimeGateway,
  ) {}

  async seedDefaults(hotelId: string) {
    const companyCount = await this.prisma.corporateCompany.count({ where: { hotelId } });
    if (companyCount === 0) {
      const companies = await this.prisma.corporateCompany.createManyAndReturn({
        data: [
          {
            hotelId,
            code: 'TCS-001',
            name: 'Tata Consultancy Services',
            industry: 'IT',
            category: 'IT',
            gstNumber: '27AAACR5055K1Z5',
            creditLimit: 500000,
            paymentTerms: 'Net 30',
            contractStatus: 'ACTIVE',
            website: 'https://tcs.com',
          },
          {
            hotelId,
            code: 'HDFC-001',
            name: 'HDFC Bank',
            industry: 'Banking',
            category: 'Banking',
            creditLimit: 750000,
            paymentTerms: 'Net 45',
            contractStatus: 'ACTIVE',
          },
          {
            hotelId,
            code: 'TMC-001',
            name: 'Global Travel Management Co.',
            industry: 'Travel Agency',
            category: 'Travel Agency',
            creditLimit: 300000,
            paymentTerms: 'Net 15',
            contractStatus: 'NEGOTIATION',
          },
        ],
      });

      for (const company of companies) {
        await this.prisma.corpCreditAccount.create({
          data: {
            hotelId,
            companyId: company.id,
            creditLimit: company.creditLimit,
            availableCredit: company.creditLimit,
          },
        });
        await this.prisma.corpCompanyContact.createMany({
          data: [
            {
              hotelId,
              companyId: company.id,
              contactType: 'PRIMARY',
              name: 'Primary Contact',
              email: `contact@${company.code.toLowerCase()}.com`,
              isPrimary: true,
            },
            {
              hotelId,
              companyId: company.id,
              contactType: 'TRAVEL_DESK',
              name: 'Travel Desk',
              email: `travel@${company.code.toLowerCase()}.com`,
            },
          ],
        });
        await this.prisma.corpAccountTeam.create({
          data: {
            hotelId,
            companyId: company.id,
            role: 'ACCOUNT_MANAGER',
            staffName: 'Key Account Manager',
          },
        });
      }

      const firstCompany = companies[0];
      if (firstCompany) {
        await this.prisma.corporateContract.create({
          data: {
            hotelId,
            companyId: firstCompany.id,
            title: 'Corporate Rate Agreement 2026',
            contractNumber: 'CORP-2026-001',
            rateType: 'negotiated',
            discountPct: 15,
            startsAt: new Date('2026-01-01'),
            endsAt: new Date('2026-12-31'),
            status: CorpContractStatus.ACTIVE,
            autoRenewal: true,
            paymentTerms: 'Net 30',
          },
        });
        await this.prisma.corpRatePlan.create({
          data: {
            hotelId,
            companyId: firstCompany.id,
            code: 'STD-CORP',
            name: 'Standard Corporate Rate',
            rateType: 'STANDARD',
            status: 'ACTIVE',
            baseRate: 5500,
            discountPct: 15,
          },
        });
      }
    }

    const leadCount = await this.prisma.corpSalesLead.count({ where: { hotelId } });
    if (leadCount === 0) {
      await this.prisma.corpSalesLead.createMany({
        data: [
          {
            hotelId,
            leadCode: 'CSL-00001',
            companyName: 'Infosys Limited',
            industry: 'IT',
            source: 'LINKEDIN',
            status: 'QUALIFIED',
            leadScore: 75,
            expectedRevenue: 1200000,
            expectedRoomNights: 200,
            probability: 60,
          },
          {
            hotelId,
            leadCode: 'CSL-00002',
            companyName: 'Ministry of Tourism',
            industry: 'Government',
            source: 'REFERRAL',
            status: 'PROPOSAL_SENT',
            leadScore: 85,
            expectedRevenue: 2500000,
            expectedRoomNights: 500,
            probability: 70,
          },
        ],
      });
    }

    const targetCount = await this.prisma.corpSalesTarget.count({ where: { hotelId } });
    if (targetCount === 0) {
      await this.prisma.corpSalesTarget.create({
        data: {
          hotelId,
          periodType: 'monthly',
          periodLabel: new Date().toISOString().slice(0, 7),
          revenueTarget: 5000000,
          roomNightTarget: 1500,
        },
      });
    }

    this.realtime.notifyDashboard(hotelId);
    return { seeded: true };
  }

  async listLeads(hotelId: string, status?: string): Promise<CorpSalesLeadItem[]> {
    const rows = await this.prisma.corpSalesLead.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(status ? { status: status as CorpSalesLeadStatus } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => this.mapLead(r));
  }

  async createLead(hotelId: string, dto: CreateCorpSalesLeadSchema, userId: string) {
    const count = await this.prisma.corpSalesLead.count({ where: { hotelId } });
    const lead = await this.prisma.corpSalesLead.create({
      data: {
        hotelId,
        leadCode: `CSL-${String(count + 1).padStart(5, '0')}`,
        companyName: dto.companyName,
        industry: dto.industry,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        source: dto.source,
        expectedRevenue: dto.expectedRevenue,
        expectedRoomNights: dto.expectedRoomNights,
        decisionMaker: dto.decisionMaker,
        probability: dto.probability ?? 20,
        notes: dto.notes,
        createdBy: userId,
      },
    });
    this.realtime.emitLeadUpdate(hotelId, lead.id);
    return lead;
  }

  async updateLeadStatus(hotelId: string, id: string, dto: UpdateCorpSalesLeadStatusSchema) {
    const lead = await this.prisma.corpSalesLead.findFirst({ where: { id, hotelId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.corpSalesLead.update({
      where: { id },
      data: { status: dto.status },
    });
    this.realtime.emitLeadUpdate(hotelId, id);
    return updated;
  }

  async getPipeline(hotelId: string): Promise<CorpPipelineStage[]> {
    const leads = await this.listLeads(hotelId);
    const stages = [
      'NEW', 'QUALIFIED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION',
      'LEGAL_REVIEW', 'CONTRACT_DRAFT', 'APPROVED', 'WON', 'LOST', 'RENEWAL',
    ];

    return stages.map((stage) => {
      const stageLeads = leads.filter((l) => l.status === stage);
      return {
        stage,
        count: stageLeads.length,
        value: stageLeads.reduce((s, l) => s + (l.expectedRevenue ?? 0), 0),
        leads: stageLeads,
      };
    });
  }

  private mapLead(r: {
    id: string;
    leadCode: string;
    companyName: string;
    industry: string | null;
    contactName: string | null;
    email: string | null;
    source: string;
    status: string;
    leadScore: number;
    expectedRevenue: { toNumber?: () => number } | null;
    expectedRoomNights: number | null;
    probability: number;
    assignedTo: string | null;
    createdAt: Date;
  }): CorpSalesLeadItem {
    return {
      id: r.id,
      leadCode: r.leadCode,
      companyName: r.companyName,
      industry: r.industry,
      contactName: r.contactName,
      email: r.email,
      source: r.source,
      status: r.status,
      leadScore: r.leadScore,
      expectedRevenue: r.expectedRevenue ? Number(r.expectedRevenue) : null,
      expectedRoomNights: r.expectedRoomNights,
      probability: r.probability,
      assignedTo: r.assignedTo,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    };
  }
}
