import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { GxpRequestStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  GxpAdminDashboardStats,
  GxpAnnouncementSchema,
  GxpOfferSchema,
  GxpQrCodeItem,
} from '@tungaos/shared';

@Injectable()
export class GxpAdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<GxpAdminDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRequestsRaw = await this.prisma.gxpRequest.findMany({
      where: { hotelId, createdAt: { gte: today } },
      select: { subType: true },
    });
    const serviceCounts = todayRequestsRaw.reduce<Record<string, number>>((acc, r) => {
      acc[r.subType] = (acc[r.subType] ?? 0) + 1;
      return acc;
    }, {});
    const topServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));

    const [activeSessions, pendingRequests, todayRequests, feedbacks, chats] = await Promise.all([
      this.prisma.guestPortalSession.count({ where: { hotelId, isActive: true, expiresAt: { gt: new Date() } } }),
      this.prisma.gxpRequest.count({ where: { hotelId, status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] } } }),
      this.prisma.gxpRequest.count({ where: { hotelId, createdAt: { gte: today } } }),
      this.prisma.gxpFeedback.findMany({ where: { hotelId, createdAt: { gte: today } }, select: { overallRating: true } }),
      this.prisma.gxpChatMessage.count({ where: { hotelId, createdAt: { gte: today } } }),
    ]);

    const avgRating = feedbacks.length
      ? feedbacks.reduce((s, f) => s + (f.overallRating ?? 0), 0) / feedbacks.length
      : 4.5;

    return {
      activeSessions,
      pendingRequests,
      todayRequests,
      avgResponseMinutes: 12,
      guestSatisfaction: Math.round(avgRating * 10) / 10,
      topServices,
      foodOrdersToday: todayRequests,
      chatMessagesToday: chats,
    };
  }

  async listQrCodes(hotelId: string): Promise<GxpQrCodeItem[]> {
    const codes = await this.prisma.roomQrCode.findMany({
      where: { hotelId, isActive: true },
      include: { hotel: { select: { slug: true } } },
    });

    const rooms = await this.prisma.room.findMany({
      where: { hotelId, id: { in: codes.map((c) => c.roomId) } },
      select: { id: true, roomNumber: true },
    });
    const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));

    return codes.map((c) => ({
      id: c.id,
      roomId: c.roomId,
      roomNumber: roomMap[c.roomId] ?? '—',
      token: c.token,
      qrData: c.qrData,
      scanCount: c.scanCount,
      portalUrl: `/stay/scan?q=${encodeURIComponent(c.qrData)}`,
    }));
  }

  async generateQrCodes(hotelId: string) {
    const rooms = await this.prisma.room.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
      select: { id: true, roomNumber: true },
    });

    for (const room of rooms) {
      const existing = await this.prisma.roomQrCode.findFirst({ where: { hotelId, roomId: room.id } });
      if (existing) continue;

      const token = randomBytes(16).toString('hex');
      await this.prisma.roomQrCode.create({
        data: {
          hotelId,
          roomId: room.id,
          token,
          qrData: `TUNGAOS:STAY:${token}`,
        },
      });
    }

    return this.listQrCodes(hotelId);
  }

  async seedDefaults(hotelId: string) {
    const offerCount = await this.prisma.gxpOffer.count({ where: { hotelId } });
    if (offerCount === 0) {
      await this.prisma.gxpOffer.createMany({
        data: [
          { hotelId, title: 'Happy Hour — Sky Bar', description: '50% off cocktails 5–7 PM', offerType: 'HAPPY_HOUR', discountPct: 50 },
          { hotelId, title: 'Spa Weekend', description: '20% off spa treatments', offerType: 'SPA', discountPct: 20 },
          { hotelId, title: 'Late Checkout', description: 'Extend stay until 2 PM', offerType: 'LATE_CHECKOUT' },
        ],
      });
    }

    const annCount = await this.prisma.gxpAnnouncement.count({ where: { hotelId } });
    if (annCount === 0) {
      await this.prisma.gxpAnnouncement.create({
        data: {
          hotelId,
          title: 'Welcome to TungaOS',
          body: 'Scan the room QR for room service, concierge, dining, and checkout — no app required.',
          priority: 'HIGH',
        },
      });
    }

    return { offers: offerCount === 0, announcements: annCount === 0 };
  }

  async createOffer(hotelId: string, input: GxpOfferSchema) {
    return this.prisma.gxpOffer.create({ data: { hotelId, ...input } });
  }

  async createAnnouncement(hotelId: string, input: GxpAnnouncementSchema) {
    return this.prisma.gxpAnnouncement.create({
      data: {
        hotelId,
        title: input.title,
        body: input.body,
        priority: input.priority,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
      },
    });
  }

  async listRequests(hotelId: string) {
    return this.prisma.gxpRequest.findMany({
      where: { hotelId, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async updateRequestStatus(hotelId: string, id: string, status: GxpRequestStatus) {
    return this.prisma.gxpRequest.update({
      where: { id },
      data: { status, completedAt: status === 'COMPLETED' ? new Date() : undefined },
    });
  }
}
