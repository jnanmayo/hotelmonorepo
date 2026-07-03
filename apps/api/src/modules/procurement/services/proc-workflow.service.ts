import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ProcPrStatus,
  QuotationStatus,
  RfqStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { ProcurementRealtimeGateway } from '@/modules/procurement/gateways/procurement-realtime.gateway';

import type {
  CreateProcPrSchema,
  CreateQuotationSchema,
  CreateRfqSchema,
} from '@tungaos/shared';

@Injectable()
export class ProcWorkflowService {
  constructor(
    private prisma: PrismaService,
    private realtime: ProcurementRealtimeGateway,
  ) {}

  private async nextNum(hotelId: string, prefix: string, model: 'procPurchaseRequest' | 'rfq' | 'vendorQuotation') {
    let count = 0;
    if (model === 'procPurchaseRequest') count = await this.prisma.procPurchaseRequest.count({ where: { hotelId } });
    else if (model === 'rfq') count = await this.prisma.rfq.count({ where: { hotelId } });
    else count = await this.prisma.vendorQuotation.count({ where: { hotelId } });
    return `${prefix}-${String(count + 1).padStart(5, '0')}`;
  }

  async listPurchaseRequests(hotelId: string) {
    const rows = await this.prisma.procPurchaseRequest.findMany({
      where: { hotelId },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      requestNumber: r.requestNumber,
      department: r.department,
      priority: r.priority,
      status: r.status,
      itemCount: r._count.items,
      requiredDate: r.requiredDate?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createPurchaseRequest(hotelId: string, dto: CreateProcPrSchema, userId?: string) {
    const requestNumber = await this.nextNum(hotelId, 'PR', 'procPurchaseRequest');
    const pr = await this.prisma.procPurchaseRequest.create({
      data: {
        hotelId,
        requestNumber,
        department: dto.department,
        priority: dto.priority,
        status: ProcPrStatus.SUBMITTED,
        requiredDate: dto.requiredDate ? new Date(dto.requiredDate) : undefined,
        reason: dto.reason,
        remarks: dto.remarks,
        requestedById: userId,
        items: {
          create: dto.items.map((i) => ({
            itemId: i.itemId,
            itemName: i.itemName,
            quantity: i.quantity,
            unit: i.unit,
            notes: i.notes,
          })),
        },
      },
    });
    this.realtime.emitPrUpdate(hotelId, pr.id);
    return pr;
  }

  async approvePurchaseRequest(hotelId: string, id: string, level: 'dept' | 'pm', userId?: string) {
    const pr = await this.prisma.procPurchaseRequest.findFirst({ where: { id, hotelId } });
    if (!pr) throw new NotFoundException('Purchase request not found');

    const status = level === 'dept' ? ProcPrStatus.DEPT_APPROVED : ProcPrStatus.PM_APPROVED;
    return this.prisma.procPurchaseRequest.update({
      where: { id },
      data: {
        status,
        ...(level === 'dept' ? { deptApprovedById: userId } : { pmApprovedById: userId, status: ProcPrStatus.APPROVED }),
      },
    });
  }

  async listRfqs(hotelId: string) {
    const rows = await this.prisma.rfq.findMany({
      where: { hotelId },
      include: { _count: { select: { vendors: true, quotations: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      rfqNumber: r.rfqNumber,
      status: r.status,
      vendorCount: r._count.vendors,
      quotationCount: r._count.quotations,
      expiryDate: r.expiryDate?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async createRfq(hotelId: string, dto: CreateRfqSchema, userId?: string) {
    const rfqNumber = await this.nextNum(hotelId, 'RFQ', 'rfq');
    const rfq = await this.prisma.rfq.create({
      data: {
        hotelId,
        rfqNumber,
        purchaseRequestId: dto.purchaseRequestId,
        status: RfqStatus.SENT,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        notes: dto.notes,
        items: { create: dto.items.map((i) => ({ itemId: i.itemId, itemName: i.itemName, quantity: i.quantity, unit: i.unit })) },
        vendors: { create: dto.vendorIds.map((vendorId) => ({ vendorId, sentAt: new Date(), emailSent: true })) },
      },
    });

    if (dto.purchaseRequestId) {
      await this.prisma.procPurchaseRequest.update({
        where: { id: dto.purchaseRequestId },
        data: { status: ProcPrStatus.CONVERTED_RFQ },
      });
    }

    this.realtime.emitRfqUpdate(hotelId, rfq.id);
    return rfq;
  }

  async listQuotations(hotelId: string, rfqId?: string) {
    const rows = await this.prisma.vendorQuotation.findMany({
      where: { hotelId, ...(rfqId ? { rfqId } : {}) },
      include: { vendor: { select: { name: true } }, rfq: { select: { rfqNumber: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((q) => ({
      id: q.id,
      quotationNumber: q.quotationNumber,
      vendorName: q.vendor.name,
      rfqNumber: q.rfq.rfqNumber,
      status: q.status,
      totalAmount: Number(q.totalAmount),
      leadTimeDays: q.leadTimeDays,
      isRecommended: q.isRecommended,
      submittedAt: q.submittedAt?.toISOString() ?? null,
    }));
  }

  async createQuotation(hotelId: string, dto: CreateQuotationSchema) {
    const quotationNumber = await this.nextNum(hotelId, 'QT', 'vendorQuotation');
    let total = dto.deliveryCharges;

    const items = dto.items.map((i) => {
      const lineTotal = i.quantity * i.unitPrice - i.discount + (i.quantity * i.unitPrice * i.gstRate) / 100;
      total += lineTotal;
      return { ...i, totalAmount: lineTotal };
    });

    const quotation = await this.prisma.vendorQuotation.create({
      data: {
        hotelId,
        rfqId: dto.rfqId,
        vendorId: dto.vendorId,
        quotationNumber,
        status: QuotationStatus.SUBMITTED,
        deliveryCharges: dto.deliveryCharges,
        leadTimeDays: dto.leadTimeDays,
        warranty: dto.warranty,
        validityDate: dto.validityDate ? new Date(dto.validityDate) : undefined,
        totalAmount: total,
        remarks: dto.remarks,
        submittedAt: new Date(),
        items: { create: items },
      },
    });

    await this.prisma.rfq.update({ where: { id: dto.rfqId }, data: { status: RfqStatus.QUOTATIONS_RECEIVED } });
    this.realtime.emitQuotationReceived(hotelId, quotation.id);
    return quotation;
  }

  async compareQuotations(hotelId: string, rfqId: string) {
    const rfq = await this.prisma.rfq.findFirst({
      where: { id: rfqId, hotelId },
      include: {
        quotations: {
          include: { vendor: { select: { name: true, rating: true } } },
        },
      },
    });
    if (!rfq) throw new NotFoundException('RFQ not found');

    const scored = rfq.quotations.map((q) => {
      const priceScore = 100 - Math.min(Number(q.totalAmount) / 1000, 99);
      const ratingScore = Number(q.vendor.rating) * 20;
      const leadScore = Math.max(0, 30 - q.leadTimeDays);
      const score = priceScore * 0.4 + ratingScore * 0.35 + leadScore * 0.25;
      return {
        id: q.id,
        vendorName: q.vendor.name,
        vendorRating: Number(q.vendor.rating),
        totalAmount: Number(q.totalAmount),
        deliveryCharges: Number(q.deliveryCharges),
        leadTimeDays: q.leadTimeDays,
        warranty: q.warranty,
        isRecommended: q.isRecommended,
        score: Math.round(score * 100) / 100,
      };
    }).sort((a, b) => b.score - a.score);

    const recommendedId = scored[0]?.id ?? null;
    if (recommendedId) {
      await this.prisma.vendorQuotation.updateMany({ where: { rfqId }, data: { isRecommended: false } });
      await this.prisma.vendorQuotation.update({ where: { id: recommendedId }, data: { isRecommended: true } });
    }

    return {
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
      quotations: scored,
      recommendedId,
    };
  }

  async selectQuotation(hotelId: string, quotationId: string) {
    const q = await this.prisma.vendorQuotation.findFirst({ where: { id: quotationId, hotelId } });
    if (!q) throw new NotFoundException('Quotation not found');

    await this.prisma.vendorQuotation.updateMany({ where: { rfqId: q.rfqId }, data: { status: QuotationStatus.REJECTED } });
    await this.prisma.vendorQuotation.update({ where: { id: quotationId }, data: { status: QuotationStatus.SELECTED, isRecommended: true } });
    await this.prisma.rfq.update({ where: { id: q.rfqId }, data: { status: RfqStatus.VENDOR_SELECTED } });

    return { selected: true, quotationId, vendorId: q.vendorId };
  }
}
