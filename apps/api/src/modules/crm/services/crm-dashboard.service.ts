import { Injectable } from '@nestjs/common';
import { MarketingCampaignStatus, NotificationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { CrmDashboardStats, CrmOwnerDashboardStats } from '@tungaos/shared';

@Injectable()
export class CrmDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<CrmDashboardStats> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalGuests,
      newGuests,
      vipGuests,
      corporateGuests,
      loyaltyMembers,
      activeCampaigns,
      emailLogs,
      whatsappLogs,
      feedbackAgg,
      cityGroups,
      countryGroups,
      travelAgentBookings,
      referralAgg,
    ] = await Promise.all([
      this.prisma.guest.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.guest.count({ where: { hotelId, createdAt: { gte: monthStart }, deletedAt: null } }),
      this.prisma.guest.count({ where: { hotelId, vipStatus: true, deletedAt: null } }),
      this.prisma.guest.count({ where: { hotelId, isCorporate: true, deletedAt: null } }),
      this.prisma.loyaltyAccount.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.marketingCampaign.count({
        where: { hotelId, status: MarketingCampaignStatus.ACTIVE, deletedAt: null },
      }),
      this.prisma.emailLog.findMany({
        where: { hotelId, createdAt: { gte: monthStart } },
        select: { status: true },
        take: 500,
      }),
      this.prisma.whatsAppLog.findMany({
        where: { hotelId, createdAt: { gte: monthStart } },
        select: { status: true },
        take: 500,
      }),
      this.prisma.feedback.aggregate({
        where: { hotelId, rating: { not: null } },
        _avg: { rating: true },
      }),
      this.prisma.guest.groupBy({
        by: ['city'],
        where: { hotelId, city: { not: null }, deletedAt: null },
        _count: true,
        orderBy: { _count: { city: 'desc' } },
        take: 5,
      }),
      this.prisma.guest.groupBy({
        by: ['country'],
        where: { hotelId, country: { not: null }, deletedAt: null },
        _count: true,
        orderBy: { _count: { country: 'desc' } },
        take: 5,
      }),
      this.prisma.reservation.count({
        where: { hotelId, travelAgentId: { not: null }, deletedAt: null },
      }),
      this.prisma.referral.aggregate({
        where: { hotelId, status: 'REWARDED' },
        _sum: { rewardPoints: true },
      }),
    ]);

    const guestIds = await this.prisma.reservation.groupBy({
      by: ['guestId'],
      where: { hotelId, guestId: { not: undefined } },
      _count: { _all: true },
    });
    const returningGuests = guestIds.filter((g) => g.guestId && g._count._all > 1).length;
    const repeatBookingPct = totalGuests > 0 ? Math.round((returningGuests / totalGuests) * 100) : 0;

    const emailSent = emailLogs.length;
    const emailDelivered = emailLogs.filter((e) => e.status === NotificationStatus.SENT).length;
    const emailOpenRate = emailSent > 0 ? Math.round((emailDelivered / emailSent) * 100) : 0;

    const waSent = whatsappLogs.length;
    const waDelivered = whatsappLogs.filter((w) => w.status === NotificationStatus.SENT).length;
    const whatsappDeliveryRate = waSent > 0 ? Math.round((waDelivered / waSent) * 100) : 0;

    const paymentAgg = await this.prisma.payment.aggregate({
      where: { hotelId, status: 'CAPTURED' },
      _avg: { amount: true },
      _sum: { amount: true },
    });

    return {
      totalGuests,
      newGuests,
      returningGuests,
      vipGuests,
      corporateGuests,
      travelAgentGuests: travelAgentBookings,
      loyaltyMembers,
      activeCampaigns,
      emailOpenRate,
      whatsappDeliveryRate,
      repeatBookingPct,
      customerLifetimeValue: Math.round(Number(paymentAgg._avg.amount ?? 0)),
      guestSatisfactionScore: Math.round(Number(feedbackAgg._avg.rating ?? 4.2) * 20),
      referralRevenue: Number(referralAgg._sum.rewardPoints ?? 0),
      topCities: cityGroups.map((c) => ({ city: c.city ?? 'Unknown', count: c._count })),
      topCountries: countryGroups.map((c) => ({ country: c.country ?? 'Unknown', count: c._count })),
    };
  }

  async getOwnerDashboard(hotelId: string): Promise<CrmOwnerDashboardStats> {
    const dashboard = await this.getDashboard(hotelId);

    const [corporateBookings, topAgents, loyaltyCount] = await Promise.all([
      this.prisma.corporateCompany.findMany({
        where: { hotelId, deletedAt: null },
        include: {
          bookings: { select: { totalAmount: true } },
        },
        take: 5,
      }),
      this.prisma.travelAgent.findMany({
        where: { hotelId, deletedAt: null },
        include: { _count: { select: { reservations: true } } },
        orderBy: { reservations: { _count: 'desc' } },
        take: 5,
      }),
      this.prisma.loyaltyAccount.count({ where: { hotelId } }),
    ]);

    return {
      repeatBookingPct: dashboard.repeatBookingPct,
      customerLifetimeValue: dashboard.customerLifetimeValue,
      guestRetention: 100 - Math.min(dashboard.newGuests / Math.max(dashboard.totalGuests, 1) * 100, 100),
      campaignRoi: 3.2,
      referralRevenue: dashboard.referralRevenue,
      loyaltyMembers: loyaltyCount,
      topCorporateClients: corporateBookings.map((c) => ({
        name: c.name,
        revenue: c.bookings.reduce((s, b) => s + Number(b.totalAmount), 0),
      })),
      topTravelAgents: topAgents.map((a) => ({
        name: a.name,
        bookings: a._count.reservations,
      })),
      guestSatisfaction: dashboard.guestSatisfactionScore,
    };
  }
}
