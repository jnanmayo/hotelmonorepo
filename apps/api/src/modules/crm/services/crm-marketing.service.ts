import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  CreateCampaignSchema,
  CreateCouponSchema,
  CreateGiftCardSchema,
  CreateReferralSchema,
  CrmAutomationItem,
  CrmCampaignItem,
  CrmCommunicationLogItem,
  CrmCouponItem,
  CrmCorporateItem,
  CrmFeedbackItem,
  CrmGiftCardItem,
  CrmReferralItem,
  CrmReviewItem,
  CrmTravelAgentItem,
} from '@tungaos/shared';

@Injectable()
export class CrmMarketingService {
  constructor(private prisma: PrismaService) {}

  async listCampaigns(hotelId: string): Promise<CrmCampaignItem[]> {
    const rows = await this.prisma.marketingCampaign.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      status: r.status,
      channel: r.channel,
      startsAt: r.startsAt?.toISOString() ?? null,
      endsAt: r.endsAt?.toISOString() ?? null,
      budget: r.budget ? Number(r.budget) : null,
    }));
  }

  async createCampaign(hotelId: string, dto: CreateCampaignSchema, userId: string) {
    return this.prisma.marketingCampaign.create({
      data: {
        hotelId,
        name: dto.name,
        code: dto.code,
        channel: dto.channel,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
        budget: dto.budget,
        content: dto.content,
        createdBy: userId,
      },
    });
  }

  async listAutomations(hotelId: string): Promise<CrmAutomationItem[]> {
    const rows = await this.prisma.marketingAutomation.findMany({
      where: { hotelId },
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      trigger: r.trigger,
      channel: r.channel,
      isActive: r.isActive,
      delayHours: r.delayHours,
    }));
  }

  async listEmailLogs(hotelId: string): Promise<CrmCommunicationLogItem[]> {
    const rows = await this.prisma.emailLog.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      channel: 'EMAIL',
      recipient: r.recipient,
      subject: r.subject,
      status: r.status,
      sentAt: r.sentAt?.toISOString() ?? null,
    }));
  }

  async listWhatsAppLogs(hotelId: string): Promise<CrmCommunicationLogItem[]> {
    const rows = await this.prisma.whatsAppLog.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      channel: 'WHATSAPP',
      recipient: r.recipient,
      subject: r.templateId,
      status: r.status,
      sentAt: r.sentAt?.toISOString() ?? null,
    }));
  }

  async listSmsLogs(hotelId: string): Promise<CrmCommunicationLogItem[]> {
    const rows = await this.prisma.smsLog.findMany({
      where: { hotelId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      channel: 'SMS',
      recipient: r.recipient,
      subject: null,
      status: r.status,
      sentAt: r.sentAt?.toISOString() ?? null,
    }));
  }

  async listCoupons(hotelId: string): Promise<CrmCouponItem[]> {
    const rows = await this.prisma.coupon.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      type: r.type,
      value: Number(r.value),
      usedCount: r.usedCount,
      maxUses: r.maxUses,
      endsAt: r.endsAt?.toISOString() ?? null,
    }));
  }

  async createCoupon(hotelId: string, dto: CreateCouponSchema, userId: string) {
    return this.prisma.coupon.create({
      data: {
        hotelId,
        code: dto.code,
        name: dto.name,
        type: dto.type,
        value: dto.value,
        maxUses: dto.maxUses,
        minAmount: dto.minAmount,
        createdBy: userId,
      },
    });
  }

  async listGiftCards(hotelId: string): Promise<CrmGiftCardItem[]> {
    const rows = await this.prisma.giftCard.findMany({
      where: { hotelId },
      include: { guest: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      guestName: r.guest ? `${r.guest.firstName} ${r.guest.lastName}` : null,
      initialValue: Number(r.initialValue),
      balance: Number(r.balance),
      status: r.status,
      expiresAt: r.expiresAt?.toISOString() ?? null,
    }));
  }

  async createGiftCard(hotelId: string, dto: CreateGiftCardSchema) {
    return this.prisma.giftCard.create({
      data: {
        hotelId,
        code: dto.code,
        guestId: dto.guestId,
        initialValue: dto.initialValue,
        balance: dto.initialValue,
        isDigital: dto.isDigital,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async listReferrals(hotelId: string): Promise<CrmReferralItem[]> {
    const rows = await this.prisma.referral.findMany({
      where: { hotelId },
      include: { referrer: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      referrerName: `${r.referrer.firstName} ${r.referrer.lastName}`,
      referredEmail: r.referredEmail,
      referralCode: r.referralCode,
      status: r.status,
      rewardPoints: Number(r.rewardPoints),
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }));
  }

  async createReferral(hotelId: string, dto: CreateReferralSchema) {
    const code = `REF-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.referral.create({
      data: {
        hotelId,
        referrerGuestId: dto.referrerGuestId,
        referredEmail: dto.referredEmail,
        referredName: dto.referredName,
        referralCode: code,
        rewardPoints: 500,
      },
    });
  }

  async listCorporate(hotelId: string): Promise<CrmCorporateItem[]> {
    const rows = await this.prisma.corporateCompany.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        _count: { select: { employees: true, contracts: true } },
      },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      industry: r.industry,
      creditLimit: Number(r.creditLimit),
      employeeCount: r._count.employees,
      contractCount: r._count.contracts,
    }));
  }

  async listTravelAgents(hotelId: string): Promise<CrmTravelAgentItem[]> {
    const rows = await this.prisma.travelAgent.findMany({
      where: { hotelId, deletedAt: null },
      include: { _count: { select: { reservations: true } } },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      email: r.email,
      commissionPct: Number(r.commissionPct),
      bookingCount: r._count.reservations,
    }));
  }

  async listFeedback(hotelId: string): Promise<CrmFeedbackItem[]> {
    const rows = await this.prisma.feedback.findMany({
      where: { hotelId },
      include: { guest: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map((r) => ({
      id: r.id,
      guestName: r.guest ? `${r.guest.firstName} ${r.guest.lastName}` : null,
      type: r.type,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async listReviews(hotelId: string): Promise<CrmReviewItem[]> {
    const rows = await this.prisma.review.findMany({
      where: { hotelId },
      include: { guest: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map((r) => ({
      id: r.id,
      guestName: r.guest ? `${r.guest.firstName} ${r.guest.lastName}` : null,
      source: r.source,
      rating: r.rating,
      title: r.title,
      content: r.content,
      isPublished: r.isPublished,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async getReport(hotelId: string, type: string) {
    const [guests, leads, loyalty, campaigns, feedback] = await Promise.all([
      this.prisma.guest.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.crmLead.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.loyaltyAccount.count({ where: { hotelId } }),
      this.prisma.marketingCampaign.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.feedback.count({ where: { hotelId } }),
    ]);
    return { type, generatedAt: new Date().toISOString(), summary: { guests, leads, loyalty, campaigns, feedback } };
  }
}
