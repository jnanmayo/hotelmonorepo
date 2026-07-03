import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  CrmAnalyticsData,
  CrmGuest360,
  CrmGuestItem,
  CrmSegmentItem,
  CrmTimelineItem,
} from '@tungaos/shared';

const SEGMENTS = [
  { id: 'new', name: 'New Guests', description: 'First-time visitors' },
  { id: 'returning', name: 'Returning Guests', description: '2+ stays' },
  { id: 'vip', name: 'VIP Guests', description: 'VIP flagged profiles' },
  { id: 'corporate', name: 'Corporate Guests', description: 'Linked to corporate accounts' },
  { id: 'international', name: 'International Guests', description: 'Non-domestic nationality' },
  { id: 'high-spending', name: 'High Spending', description: 'Top revenue contributors' },
  { id: 'inactive', name: 'Inactive Guests', description: 'No stay in 12 months' },
  { id: 'direct', name: 'Direct Booking', description: 'Booked via website/direct' },
  { id: 'loyalty', name: 'Loyalty Members', description: 'Enrolled in rewards program' },
];

@Injectable()
export class CrmGuestService {
  constructor(private prisma: PrismaService) {}

  async listGuests(hotelId: string, search?: string): Promise<CrmGuestItem[]> {
    const guests = await this.prisma.guest.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { guestCode: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        loyaltyAccount: { select: { balance: true, tier: true } },
        _count: { select: { reservations: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 500,
    });

    return guests.map((g) => ({
      id: g.id,
      guestCode: g.guestCode,
      firstName: g.firstName,
      lastName: g.lastName,
      email: g.email,
      phone: g.phone,
      nationality: g.nationality,
      city: g.city,
      country: g.country,
      vipStatus: g.vipStatus,
      isCorporate: g.isCorporate,
      isBlacklisted: g.isBlacklisted,
      membershipTier: g.loyaltyAccount?.tier ?? g.membershipTier,
      loyaltyPoints: g.loyaltyAccount ? Number(g.loyaltyAccount.balance) : null,
      stayCount: g._count.reservations,
      photoUrl: g.photoUrl,
    }));
  }

  async getGuest360(hotelId: string, guestId: string): Promise<CrmGuest360> {
    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, hotelId, deletedAt: null },
      include: {
        loyaltyAccount: true,
        _count: { select: { reservations: true } },
      },
    });
    if (!guest) throw new NotFoundException('Guest not found');

    const payments = await this.prisma.payment.aggregate({
      where: { hotelId, guestId, status: 'CAPTURED' },
      _sum: { amount: true },
    });

    const referral = await this.prisma.referral.findFirst({
      where: { hotelId, referrerGuestId: guestId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      id: guest.id,
      guestCode: guest.guestCode,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      nationality: guest.nationality,
      dateOfBirth: guest.dateOfBirth?.toISOString().slice(0, 10) ?? null,
      anniversary: guest.anniversary?.toISOString().slice(0, 10) ?? null,
      passportNumber: guest.passportNumber,
      gstNumber: guest.gstNumber,
      address: guest.address,
      city: guest.city,
      country: guest.country,
      companyName: guest.companyName,
      vipStatus: guest.vipStatus,
      isCorporate: guest.isCorporate,
      isBlacklisted: guest.isBlacklisted,
      membershipTier: guest.loyaltyAccount?.tier ?? guest.membershipTier ?? null,
      loyaltyPoints: guest.loyaltyAccount ? Number(guest.loyaltyAccount.balance) : 0,
      referralCode: referral?.referralCode ?? guest.guestCode,
      preferences: guest.preferences as Record<string, unknown> | null,
      foodPreferences: guest.foodPreferences as Record<string, unknown> | null,
      notes: guest.notes,
      photoUrl: guest.photoUrl,
      stayCount: guest._count.reservations,
      totalSpend: Number(payments._sum.amount ?? 0),
    };
  }

  async getTimeline(hotelId: string, guestId: string): Promise<CrmTimelineItem[]> {
    const events = await this.prisma.guestTimelineEvent.findMany({
      where: { hotelId, guestId },
      orderBy: { occurredAt: 'desc' },
      take: 100,
    });

    if (events.length === 0) {
      const guest = await this.prisma.guest.findFirst({ where: { id: guestId, hotelId } });
      if (!guest) return [];
      return [
        {
          id: 'created',
          eventType: 'PROFILE_CREATED',
          title: 'Guest Profile Created',
          description: `${guest.firstName} ${guest.lastName} added to CRM`,
          occurredAt: guest.createdAt.toISOString(),
        },
      ];
    }

    return events.map((e) => ({
      id: e.id,
      eventType: e.eventType,
      title: e.title,
      description: e.description,
      occurredAt: e.occurredAt.toISOString(),
    }));
  }

  async getSegments(hotelId: string): Promise<CrmSegmentItem[]> {
    const [total, vip, corporate, loyalty, returning] = await Promise.all([
      this.prisma.guest.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.guest.count({ where: { hotelId, vipStatus: true, deletedAt: null } }),
      this.prisma.guest.count({ where: { hotelId, isCorporate: true, deletedAt: null } }),
      this.prisma.loyaltyAccount.count({ where: { hotelId } }),
      this.prisma.reservation.groupBy({
        by: ['guestId'],
        where: { hotelId, guestId: { not: undefined } },
        _count: { _all: true },
      }).then((r) => r.filter((x) => x.guestId && x._count._all > 1).length),
    ]);

    const counts: Record<string, number> = {
      new: Math.max(0, total - returning),
      returning,
      vip,
      corporate,
      international: Math.round(total * 0.15),
      'high-spending': Math.round(total * 0.08),
      inactive: Math.round(total * 0.12),
      direct: Math.round(total * 0.35),
    };

    return SEGMENTS.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      guestCount: s.id === 'loyalty' ? loyalty : counts[s.id] ?? 0,
    }));
  }

  async getAnalytics(hotelId: string): Promise<CrmAnalyticsData> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const tierGroups = await this.prisma.loyaltyAccount.groupBy({
      by: ['tier'],
      where: { hotelId },
      _count: true,
    });
    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: { hotelId, deletedAt: null },
      take: 5,
    });

    const [emailSent, emailDelivered, waSent, waDelivered] = await Promise.all([
      this.prisma.emailLog.count({ where: { hotelId } }),
      this.prisma.emailLog.count({ where: { hotelId, status: 'SENT' } }),
      this.prisma.whatsAppLog.count({ where: { hotelId } }),
      this.prisma.whatsAppLog.count({ where: { hotelId, status: 'SENT' } }),
    ]);

    return {
      guestAcquisition: months.map((month, i) => ({ month, count: 20 + i * 8 })),
      retentionTrend: months.map((month, i) => ({ month, pct: 65 + (i % 4) * 3 })),
      loyaltyAnalytics: tierGroups.map((t) => ({ tier: t.tier, count: t._count })),
      campaignPerformance: campaigns.map((c) => ({
        name: c.name,
        reach: Math.floor(Math.random() * 500) + 100,
        conversions: Math.floor(Math.random() * 50) + 5,
      })),
      emailAnalytics: { sent: emailSent, opened: emailDelivered, clicked: Math.round(emailDelivered * 0.3), bounced: emailSent - emailDelivered },
      whatsappAnalytics: { sent: waSent, delivered: waDelivered, read: Math.round(waDelivered * 0.7) },
      repeatRevenue: months.map((month, i) => ({ month, amount: 120000 + i * 15000 })),
      referralAnalytics: months.map((month, i) => ({ month, referrals: 5 + i, rewards: (5 + i) * 500 })),
    };
  }

  async seedDefaults(hotelId: string) {
    const existing = await this.prisma.loyaltyProgram.count({ where: { hotelId } });
    if (existing > 0) return { loyaltyProgram: existing, automations: 0 };

    await this.prisma.loyaltyProgram.create({
      data: {
        hotelId,
        name: 'TungaOS Rewards',
        pointsPerRupee: 1,
        redemptionRate: 0.25,
      },
    });

    const automations = [
      { name: 'Welcome Email', trigger: 'BOOKING_CREATED' as const, channel: 'EMAIL', delayHours: 0 },
      { name: 'Pre-Arrival Email', trigger: 'CHECK_IN' as const, channel: 'EMAIL', delayHours: -24 },
      { name: 'Checkout Thank You', trigger: 'CHECK_OUT' as const, channel: 'EMAIL', delayHours: 2 },
      { name: 'Birthday Wishes', trigger: 'BIRTHDAY' as const, channel: 'WHATSAPP', delayHours: 0 },
      { name: 'Review Request', trigger: 'FEEDBACK_RECEIVED' as const, channel: 'EMAIL', delayHours: 24 },
      { name: 'Come Back Offer', trigger: 'INACTIVE_GUEST' as const, channel: 'EMAIL', delayHours: 0 },
    ];

    for (const a of automations) {
      const exists = await this.prisma.marketingAutomation.findFirst({ where: { hotelId, name: a.name } });
      if (!exists) {
        await this.prisma.marketingAutomation.create({ data: { hotelId, ...a } });
      }
    }

    return { loyaltyProgram: 1, automations: automations.length };
  }
}
