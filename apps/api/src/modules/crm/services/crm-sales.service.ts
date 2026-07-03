import { Injectable, NotFoundException } from '@nestjs/common';
import { CrmLeadStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CrmRealtimeGateway } from '@/modules/crm/gateways/crm-realtime.gateway';

import type { CreateLeadSchema, CrmLeadItem, UpdateLeadStatusSchema } from '@tungaos/shared';

@Injectable()
export class CrmSalesService {
  constructor(
    private prisma: PrismaService,
    private realtime: CrmRealtimeGateway,
  ) {}

  async listLeads(hotelId: string, status?: string): Promise<CrmLeadItem[]> {
    const rows = await this.prisma.crmLead.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(status ? { status: status as CrmLeadStatus } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      company: r.company,
      status: r.status,
      source: r.source,
      estimatedValue: r.estimatedValue ? Number(r.estimatedValue) : null,
      assignedTo: r.assignedTo,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }));
  }

  async createLead(hotelId: string, dto: CreateLeadSchema, userId: string) {
    const lead = await this.prisma.crmLead.create({
      data: {
        hotelId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        source: dto.source,
        estimatedValue: dto.estimatedValue,
        notes: dto.notes,
        createdBy: userId,
      },
    });
    this.realtime.emitLeadUpdate(hotelId, lead.id);
    return lead;
  }

  async updateLeadStatus(hotelId: string, id: string, dto: UpdateLeadStatusSchema, userId: string) {
    const lead = await this.prisma.crmLead.findFirst({ where: { id, hotelId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.crmLead.update({
      where: { id },
      data: { status: dto.status, updatedBy: userId },
    });
    this.realtime.emitLeadUpdate(hotelId, id);
    return updated;
  }

  async getPipeline(hotelId: string) {
    const groups = await this.prisma.crmLead.groupBy({
      by: ['status'],
      where: { hotelId, deletedAt: null },
      _count: true,
      _sum: { estimatedValue: true },
    });

    const stages = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
    return stages.map((stage) => {
      const g = groups.find((x) => x.status === stage);
      return {
        stage,
        count: g?._count ?? 0,
        value: Number(g?._sum.estimatedValue ?? 0),
      };
    });
  }
}
