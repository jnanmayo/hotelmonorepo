import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FrontDeskOperationsService } from '@/modules/front-desk/services/front-desk-operations.service';

import type { GxpDashboardData, GxpSessionContext } from '@tungaos/shared';

@Injectable()
export class GxpDashboardService {
  constructor(
    private prisma: PrismaService,
    private folioOps: FrontDeskOperationsService,
  ) {}

  async getDashboard(session: GxpSessionContext): Promise<GxpDashboardData> {
    const [folio, offers, announcements, hotel] = await Promise.all([
      this.folioOps.getFolio(session.hotelId, session.reservationId).catch(() => null),
      this.prisma.gxpOffer.findMany({
        where: { hotelId: session.hotelId, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.gxpAnnouncement.findMany({
        where: { hotelId: session.hotelId, isActive: true },
        orderBy: { startsAt: 'desc' },
        take: 5,
      }),
      this.prisma.hotel.findUnique({ where: { id: session.hotelId }, select: { phone: true } }),
    ]);

    const checkIn = new Date(session.checkInDate);
    const checkOut = new Date(session.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000);

    const token = session.sessionToken;

    return {
      guestName: session.guestName,
      roomNumber: session.roomNumber,
      roomType: session.roomType,
      stayDuration: `${nights} night${nights !== 1 ? 's' : ''}`,
      nightsRemaining: session.nightsRemaining,
      currentBill: folio?.totalAmount ?? 0,
      outstandingBalance: folio?.outstandingBalance ?? 0,
      quickActions: [
        { id: 'dining', label: 'Order Food', icon: 'utensils', href: 'dining' },
        { id: 'concierge', label: 'Concierge', icon: 'concierge', href: 'concierge' },
        { id: 'folio', label: 'View Bill', icon: 'receipt', href: 'folio' },
        { id: 'chat', label: 'Chat', icon: 'message', href: 'chat' },
        { id: 'checkout', label: 'Checkout', icon: 'logout', href: 'checkout' },
      ],
      offers: offers.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        offerType: o.offerType,
        discountPct: o.discountPct ? Number(o.discountPct) : null,
        imageUrl: o.imageUrl,
      })),
      announcements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        priority: a.priority,
      })),
      weather: { temp: 28, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      hotelPhone: hotel?.phone ?? null,
    };
  }
}
