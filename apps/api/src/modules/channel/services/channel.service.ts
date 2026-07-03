import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CHANNEL_PROVIDERS, mapBookingSourceToProvider } from '@/modules/channel/channel.constants';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      connectedChannels,
      failedSync,
      pendingSync,
      todayOtaBookings,
      todayDirectBookings,
      otaRevenue,
      directRevenue,
      commissionOutstanding,
      commissionPaid,
    ] = await Promise.all([
      this.prisma.otaIntegration.count({ where: { hotelId, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.channelSyncLog.count({ where: { hotelId, status: 'FAILED', createdAt: { gte: today } } }),
      this.prisma.channelSyncJob.count({
        where: { hotelId, status: { in: ['PENDING', 'RETRYING', 'PROCESSING'] } },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          createdAt: { gte: today, lt: tomorrow },
          source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT'] },
          deletedAt: null,
        },
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          createdAt: { gte: today, lt: tomorrow },
          source: 'DIRECT_WEBSITE',
          deletedAt: null,
        },
      }),
      this.prisma.reservation.aggregate({
        where: {
          hotelId,
          source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT'] },
          status: { not: 'CANCELLED' },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.reservation.aggregate({
        where: { hotelId, source: 'DIRECT_WEBSITE', status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      this.prisma.channelCommissionLog.aggregate({
        where: { hotelId, isPaid: false },
        _sum: { commissionAmount: true },
      }),
      this.prisma.channelCommissionLog.aggregate({
        where: { hotelId, isPaid: true },
        _sum: { commissionAmount: true },
      }),
    ]);

    const totalBookings = todayOtaBookings + todayDirectBookings || 1;
    const otaRev = Number(otaRevenue._sum.totalAmount ?? 0);
    const directRev = Number(directRevenue._sum.totalAmount ?? 0);
    const totalRev = otaRev + directRev || 1;

    const topOta = await this.getTopOta(hotelId);
    const bookingSourcePct = await this.getBookingSourceBreakdown(hotelId);

    const commissionSaved = directRev * 0.15;

    return {
      connectedChannels,
      failedSync,
      pendingSync,
      todayOtaBookings,
      todayDirectBookings,
      revenueByChannel: { ota: otaRev, direct: directRev },
      topOta,
      commissionPaid: Number(commissionPaid._sum.commissionAmount ?? 0),
      commissionOutstanding: Number(commissionOutstanding._sum.commissionAmount ?? 0),
      commissionSaved: Math.round(commissionSaved),
      bookingSourcePct,
      directBookingPct: Math.round((todayDirectBookings / totalBookings) * 100),
      otaBookingPct: Math.round((todayOtaBookings / totalBookings) * 100),
      occupancy: 0,
      adr: 0,
      revpar: 0,
    };
  }

  async listConnections(hotelId: string) {
    const existing = await this.prisma.otaIntegration.findMany({
      where: { hotelId, deletedAt: null },
      include: { _count: { select: { channelMappings: true, ratePlanMappings: true } } },
    });

    const existingProviders = new Set(existing.map((e) => e.provider));
    const catalog = Object.values(CHANNEL_PROVIDERS).map((p) => {
      const conn = existing.find((e) => e.provider === p.id);
      return {
        provider: p.id,
        name: p.name,
        defaultCommissionPct: p.commissionPct,
        connected: !!conn,
        connection: conn
          ? {
              id: conn.id,
              status: conn.status,
              environment: conn.environment,
              hotelCode: conn.hotelCode,
              commissionPct: Number(conn.commissionPct),
              lastSyncAt: conn.lastSyncAt,
              syncError: conn.syncError,
              webhookUrl: conn.webhookUrl,
              mappingCount: conn._count.channelMappings,
              rateMappingCount: conn._count.ratePlanMappings,
            }
          : null,
      };
    });

    return catalog;
  }

  async connectChannel(
    hotelId: string,
    data: {
      provider: string;
      apiKey?: string;
      apiSecret?: string;
      hotelCode?: string;
      commissionPct?: number;
      environment?: 'SANDBOX' | 'PRODUCTION';
      webhookUrl?: string;
    },
  ) {
    const providerMeta = CHANNEL_PROVIDERS[data.provider as keyof typeof CHANNEL_PROVIDERS];
    if (!providerMeta) throw new NotFoundException('Unknown channel provider');

    const webhookUrl =
      data.webhookUrl ??
      `${process.env.API_PUBLIC_URL ?? 'http://localhost:4000'}/api/v1/public/channels/webhook/${data.provider}`;

    return this.prisma.otaIntegration.upsert({
      where: { hotelId_provider: { hotelId, provider: data.provider } },
      create: {
        hotelId,
        provider: data.provider,
        apiKeyEncrypted: data.apiKey ? Buffer.from(data.apiKey).toString('base64') : null,
        apiSecretEncrypted: data.apiSecret ? Buffer.from(data.apiSecret).toString('base64') : null,
        hotelCode: data.hotelCode,
        commissionPct: data.commissionPct ?? providerMeta.commissionPct,
        environment: data.environment ?? 'SANDBOX',
        webhookUrl,
        status: 'ACTIVE',
      },
      update: {
        apiKeyEncrypted: data.apiKey ? Buffer.from(data.apiKey).toString('base64') : undefined,
        apiSecretEncrypted: data.apiSecret ? Buffer.from(data.apiSecret).toString('base64') : undefined,
        hotelCode: data.hotelCode,
        commissionPct: data.commissionPct,
        environment: data.environment,
        webhookUrl,
        status: 'ACTIVE',
        syncError: null,
      },
    });
  }

  async disconnectChannel(hotelId: string, integrationId: string) {
    return this.prisma.otaIntegration.update({
      where: { id: integrationId, hotelId },
      data: { status: 'INACTIVE', isActive: false },
    });
  }

  async listRoomMappings(hotelId: string, integrationId?: string) {
    return this.prisma.channelMapping.findMany({
      where: { hotelId, ...(integrationId ? { integrationId } : {}), deletedAt: null },
      include: { roomType: true, integration: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async upsertRoomMapping(
    hotelId: string,
    data: {
      integrationId: string;
      roomTypeId: string;
      externalRoomCode: string;
      externalRatePlan?: string;
    },
  ) {
    return this.prisma.channelMapping.upsert({
      where: {
        hotelId_integrationId_externalRoomCode: {
          hotelId,
          integrationId: data.integrationId,
          externalRoomCode: data.externalRoomCode,
        },
      },
      create: {
        hotelId,
        integrationId: data.integrationId,
        roomTypeId: data.roomTypeId,
        externalRoomCode: data.externalRoomCode,
        externalRatePlan: data.externalRatePlan,
        syncStatus: 'PENDING',
      },
      update: {
        roomTypeId: data.roomTypeId,
        externalRatePlan: data.externalRatePlan,
        syncStatus: 'PENDING',
      },
    });
  }

  async listRateMappings(hotelId: string, integrationId?: string) {
    return this.prisma.channelRatePlanMapping.findMany({
      where: { hotelId, ...(integrationId ? { integrationId } : {}), isActive: true },
      include: { ratePlan: true, integration: true },
    });
  }

  async upsertRateMapping(
    hotelId: string,
    data: {
      integrationId: string;
      ratePlanId: string;
      externalRateCode: string;
      externalRateName?: string;
    },
  ) {
    return this.prisma.channelRatePlanMapping.upsert({
      where: {
        hotelId_integrationId_externalRateCode: {
          hotelId,
          integrationId: data.integrationId,
          externalRateCode: data.externalRateCode,
        },
      },
      create: { hotelId, ...data },
      update: { ratePlanId: data.ratePlanId, externalRateName: data.externalRateName },
    });
  }

  async listRestrictions(hotelId: string) {
    return this.prisma.channelRestriction.findMany({
      where: { hotelId, isActive: true },
      include: { roomType: true, integration: true },
      orderBy: { startDate: 'asc' },
    });
  }

  async listSyncLogs(hotelId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.channelSyncLog.findMany({
        where: { hotelId },
        include: { integration: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.channelSyncLog.count({ where: { hotelId } }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async listOtaBookings(hotelId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where: {
          hotelId,
          deletedAt: null,
          source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT', 'TRAVEL_AGENT'] },
        },
        include: { guest: true, roomType: true, commissionLogs: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({
        where: {
          hotelId,
          source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT', 'TRAVEL_AGENT'] },
        },
      }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getCommissionSummary(hotelId: string) {
    const [outstanding, paid, byChannel] = await Promise.all([
      this.prisma.channelCommissionLog.aggregate({
        where: { hotelId, isPaid: false },
        _sum: { commissionAmount: true, bookingAmount: true },
        _count: true,
      }),
      this.prisma.channelCommissionLog.aggregate({
        where: { hotelId, isPaid: true },
        _sum: { commissionAmount: true },
      }),
      this.prisma.channelCommissionLog.groupBy({
        by: ['integrationId'],
        where: { hotelId },
        _sum: { commissionAmount: true, bookingAmount: true },
        _count: true,
      }),
    ]);

    const channels = await Promise.all(
      byChannel.map(async (row) => {
        const integration = await this.prisma.otaIntegration.findUnique({ where: { id: row.integrationId } });
        return {
          provider: integration?.provider,
          commissionAmount: Number(row._sum.commissionAmount ?? 0),
          bookingAmount: Number(row._sum.bookingAmount ?? 0),
          count: row._count,
        };
      }),
    );

    return {
      outstanding: Number(outstanding._sum.commissionAmount ?? 0),
      paid: Number(paid._sum.commissionAmount ?? 0),
      bookingVolume: Number(outstanding._sum.bookingAmount ?? 0),
      count: outstanding._count,
      byChannel: channels,
    };
  }

  async getAnalytics(hotelId: string) {
    const dashboard = await this.getDashboard(hotelId);
    const cancellations = await this.prisma.reservation.count({
      where: {
        hotelId,
        status: 'CANCELLED',
        source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT'] },
      },
    });
    const totalOta = await this.prisma.reservation.count({
      where: { hotelId, source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT'] } },
    });

    return {
      ...dashboard,
      cancellationRate: totalOta ? Math.round((cancellations / totalOta) * 100) : 0,
      channelPerformance: dashboard.bookingSourcePct,
    };
  }

  private async getTopOta(hotelId: string) {
    const groups = await this.prisma.reservation.groupBy({
      by: ['source'],
      where: {
        hotelId,
        source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT'] },
      },
      _count: true,
      orderBy: { _count: { source: 'desc' } },
      take: 1,
    });
    if (!groups[0]) return 'N/A';
    return mapBookingSourceToProvider(groups[0].source);
  }

  private async getBookingSourceBreakdown(hotelId: string) {
    const groups = await this.prisma.reservation.groupBy({
      by: ['source'],
      where: { hotelId, deletedAt: null },
      _count: true,
    });
    const total = groups.reduce((s, g) => s + g._count, 0) || 1;
    return groups.map((g) => ({
      source: g.source,
      label: mapBookingSourceToProvider(g.source),
      count: g._count,
      pct: Math.round((g._count / total) * 100),
    }));
  }
}
