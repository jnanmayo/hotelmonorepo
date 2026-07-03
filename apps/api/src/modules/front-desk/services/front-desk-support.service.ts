import { Injectable, NotFoundException } from '@nestjs/common';
import { FrontDeskLogAction, KeyCardStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FrontDeskDashboardService } from '@/modules/front-desk/services/front-desk-dashboard.service';
import { FrontDeskLogService } from '@/modules/front-desk/services/front-desk-log.service';
import { FrontDeskRealtimeGateway } from '@/modules/front-desk/gateways/front-desk-realtime.gateway';

import type { FrontDeskSearchResult, SendCommunicationInput } from '@tungaos/shared';
import type { ComplaintSchema, GuestRequestSchema, KeyCardSchema, LostFoundSchema } from '@tungaos/shared';

@Injectable()
export class FrontDeskSupportService {
  constructor(
    private prisma: PrismaService,
    private log: FrontDeskLogService,
    private realtime: FrontDeskRealtimeGateway,
    private dashboard: FrontDeskDashboardService,
  ) {}

  async listComplaints(hotelId: string) {
    return this.prisma.complaint.findMany({
      where: { hotelId, deletedAt: null },
      include: { guest: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComplaint(hotelId: string, input: ComplaintSchema, userId?: string) {
    const complaint = await this.prisma.complaint.create({
      data: {
        hotelId,
        guestId: input.guestId,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority ?? 'MEDIUM',
        createdBy: userId,
      },
    });

    await this.log.log({ hotelId, userId, action: FrontDeskLogAction.COMPLAINT, entityId: complaint.id, description: input.title });
    this.realtime.emit(hotelId, {
      type: 'complaint:new',
      hotelId,
      payload: { complaintId: complaint.id },
      timestamp: new Date().toISOString(),
    });
    this.dashboard.refresh(hotelId);
    return complaint;
  }

  async listGuestRequests(hotelId: string) {
    return this.prisma.guestRequest.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGuestRequest(hotelId: string, input: GuestRequestSchema, userId?: string) {
    return this.prisma.guestRequest.create({
      data: {
        hotelId,
        reservationId: input.reservationId,
        guestId: input.guestId,
        roomId: input.roomId,
        requestType: input.requestType,
        description: input.description,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        chargeAmount: input.chargeAmount ?? 0,
        createdBy: userId,
      },
    });
  }

  async listTasks(hotelId: string) {
    return this.prisma.frontDeskTask.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: [{ status: 'asc' }, { dueAt: 'asc' }],
    });
  }

  async createTask(
    hotelId: string,
    data: {
      taskType: string;
      title: string;
      description?: string;
      reservationId?: string;
      guestId?: string;
      roomId?: string;
      assignedTo?: string;
      dueAt?: string;
    },
    userId?: string,
  ) {
    return this.prisma.frontDeskTask.create({
      data: {
        hotelId,
        taskType: data.taskType as never,
        title: data.title,
        description: data.description,
        reservationId: data.reservationId,
        guestId: data.guestId,
        roomId: data.roomId,
        assignedTo: data.assignedTo,
        dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
        createdBy: userId,
      },
    });
  }

  async listLostFound(hotelId: string) {
    return this.prisma.lostAndFoundItem.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { foundAt: 'desc' },
    });
  }

  async createLostFound(hotelId: string, input: LostFoundSchema, userId?: string) {
    return this.prisma.lostAndFoundItem.create({
      data: {
        hotelId,
        itemName: input.itemName,
        description: input.description,
        photoUrl: input.photoUrl,
        roomId: input.roomId,
        guestId: input.guestId,
        guestName: input.guestName,
        foundBy: input.foundBy,
        location: input.location,
        createdBy: userId,
      },
    });
  }

  async listCommunications(hotelId: string) {
    return this.prisma.guestCommunication.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async sendCommunication(hotelId: string, input: SendCommunicationInput, userId?: string) {
    const comm = await this.prisma.guestCommunication.create({
      data: {
        hotelId,
        guestId: input.guestId,
        reservationId: input.reservationId,
        channel: input.channel,
        messageType: input.messageType as never,
        recipient: input.recipient,
        subject: input.subject,
        body: input.body,
        status: 'SENT',
        sentAt: new Date(),
        createdBy: userId,
      },
    });

    await this.log.log({
      hotelId,
      userId,
      action: FrontDeskLogAction.COMMUNICATION,
      entityId: comm.id,
      description: `${input.channel} to ${input.recipient}`,
    });

    return comm;
  }

  async issueKeyCard(hotelId: string, input: KeyCardSchema, userId?: string) {
    const count = await this.prisma.keyCard.count({ where: { hotelId } });
    const card = await this.prisma.keyCard.create({
      data: {
        hotelId,
        reservationId: input.reservationId,
        roomId: input.roomId,
        guestId: input.guestId,
        cardNumber: `KC-${String(count + 1).padStart(6, '0')}`,
        isDuplicate: input.isDuplicate ?? false,
        createdBy: userId,
      },
    });

    await this.prisma.keyCardAccessLog.create({
      data: { hotelId, keyCardId: card.id, roomId: input.roomId, action: 'ISSUED' },
    });

    await this.log.log({
      hotelId,
      userId,
      action: FrontDeskLogAction.KEY_ISSUE,
      reservationId: input.reservationId,
      description: `Key card ${card.cardNumber}`,
    });

    return card;
  }

  async deactivateKeyCard(hotelId: string, keyCardId: string, reason: string, userId?: string) {
    const card = await this.prisma.keyCard.findFirst({ where: { id: keyCardId, hotelId } });
    if (!card) throw new NotFoundException('Key card not found');

    return this.prisma.keyCard.update({
      where: { id: keyCardId },
      data: {
        status: reason === 'LOST' ? KeyCardStatus.LOST : KeyCardStatus.DEACTIVATED,
        deactivatedAt: new Date(),
        notes: reason,
        updatedBy: userId,
      },
    });
  }

  async listKeyCards(hotelId: string, reservationId?: string) {
    return this.prisma.keyCard.findMany({
      where: { hotelId, deletedAt: null, ...(reservationId ? { reservationId } : {}) },
      include: { accessLogs: { take: 5, orderBy: { createdAt: 'desc' } } },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async search(hotelId: string, query: string, limit = 20): Promise<FrontDeskSearchResult[]> {
    if (!query || query.length < 2) return [];

    const [guests, reservations, rooms, invoices] = await Promise.all([
      this.prisma.guest.findMany({
        where: {
          hotelId,
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
            { email: { contains: query, mode: 'insensitive' } },
            { passportNumber: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
      this.prisma.reservation.findMany({
        where: { hotelId, reservationCode: { contains: query, mode: 'insensitive' } },
        include: { guest: true },
        take: limit,
      }),
      this.prisma.room.findMany({
        where: { hotelId, roomNumber: { contains: query, mode: 'insensitive' } },
        take: limit,
      }),
      this.prisma.invoice.findMany({
        where: { hotelId, invoiceNumber: { contains: query, mode: 'insensitive' } },
        take: limit,
      }),
    ]);

    return [
      ...guests.map((g) => ({
        type: 'guest' as const,
        id: g.id,
        title: `${g.firstName} ${g.lastName}`,
        subtitle: g.phone ?? g.email ?? '',
        href: `/app/front-desk/guests/${g.id}`,
      })),
      ...reservations.map((r) => ({
        type: 'reservation' as const,
        id: r.id,
        title: r.reservationCode,
        subtitle: `${r.guest.firstName} ${r.guest.lastName}`,
        href: `/app/front-desk/folio/${r.id}`,
      })),
      ...rooms.map((r) => ({
        type: 'room' as const,
        id: r.id,
        title: `Room ${r.roomNumber}`,
        subtitle: r.status,
        href: `/app/front-desk/room-assignment?room=${r.id}`,
      })),
      ...invoices.map((i) => ({
        type: 'invoice' as const,
        id: i.id,
        title: i.invoiceNumber,
        subtitle: i.status,
        href: `/app/front-desk/folio/${i.reservationId}`,
      })),
    ].slice(0, limit);
  }
}
