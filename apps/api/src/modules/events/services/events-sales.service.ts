import { Injectable, NotFoundException } from '@nestjs/common';
import { EventLeadStatus, EventQuotationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { EventsRealtimeGateway } from '@/modules/events/gateways/events-realtime.gateway';

import type {
  CreateEventLeadSchema,
  CreateEventQuotationSchema,
  EventsClientItem,
  EventsContractItem,
  EventsLeadItem,
  EventsPaymentItem,
  EventsQuotationItem,
  UpdateEventLeadStatusSchema,
} from '@tungaos/shared';

@Injectable()
export class EventsSalesService {
  constructor(
    private prisma: PrismaService,
    private realtime: EventsRealtimeGateway,
  ) {}

  async seedDefaults(hotelId: string) {
    const hallCount = await this.prisma.banquetHall.count({ where: { hotelId } });
    if (hallCount === 0) {
      await this.prisma.banquetHall.createMany({
        data: [
          {
            hotelId,
            hallCode: 'GRAND-01',
            name: 'Grand Ballroom',
            capacity: 500,
            minGuests: 50,
            maxGuests: 500,
            theatreCapacity: 600,
            roundTableCapacity: 400,
            baseRate: 150000,
            amenities: ['Stage', 'LED Wall', 'Sound System', 'Air Conditioning', 'WiFi'],
          },
          {
            hotelId,
            hallCode: 'PEARL-01',
            name: 'Pearl Hall',
            capacity: 200,
            minGuests: 30,
            maxGuests: 200,
            roundTableCapacity: 180,
            baseRate: 75000,
            amenities: ['Projector', 'Sound System', 'Parking', 'WiFi'],
          },
          {
            hotelId,
            hallCode: 'JADE-01',
            name: 'Jade Boardroom',
            capacity: 40,
            minGuests: 10,
            maxGuests: 40,
            boardRoomCapacity: 40,
            uShapeCapacity: 35,
            baseRate: 25000,
            amenities: ['Projector', 'WiFi', 'Power Backup'],
          },
        ],
      });
    }

    const packageCount = await this.prisma.eventPackage.count({ where: { hotelId } });
    if (packageCount === 0) {
      await this.prisma.eventPackage.createMany({
        data: [
          { hotelId, code: 'WED-PREMIUM', name: 'Premium Wedding Package', eventType: 'Wedding', basePrice: 850000, inclusions: ['Hall', 'Decoration', 'Catering', 'Photography'] },
          { hotelId, code: 'CONF-STD', name: 'Conference Standard', eventType: 'Conference', basePrice: 120000, inclusions: ['Hall', 'AV Setup', 'High Tea', 'Stationery'] },
          { hotelId, code: 'BDAY-FUN', name: 'Birthday Celebration', eventType: 'Birthday', basePrice: 45000, inclusions: ['Hall', 'Theme Decor', 'Cake', 'DJ'] },
          { hotelId, code: 'CORP-EXEC', name: 'Corporate Executive', eventType: 'Corporate Meeting', basePrice: 95000, inclusions: ['Boardroom', 'Lunch', 'Projector'] },
        ],
      });
    }

    const vendorCount = await this.prisma.eventVendor.count({ where: { hotelId } });
    if (vendorCount === 0) {
      await this.prisma.eventVendor.createMany({
        data: [
          { hotelId, name: 'Elite Decorators', category: 'DECORATOR', contactName: 'Rajesh', phone: '+919876543210', rating: 4.5, isPreferred: true },
          { hotelId, name: 'Lens Studio', category: 'PHOTOGRAPHER', contactName: 'Priya', phone: '+919876543211', rating: 4.8, isPreferred: true },
          { hotelId, name: 'Beat Masters DJ', category: 'DJ', contactName: 'Arjun', phone: '+919876543212', rating: 4.3 },
        ],
      });
    }

    const checklistCount = await this.prisma.eventChecklist.count({ where: { hotelId, isTemplate: true } });
    if (checklistCount === 0) {
      const wedding = await this.prisma.eventChecklist.create({
        data: {
          hotelId,
          name: 'Wedding Checklist',
          eventType: 'Wedding',
          isTemplate: true,
          items: {
            create: [
              { title: 'Confirm menu with client', category: 'Kitchen', sortOrder: 1 },
              { title: 'Stage and mandap setup', category: 'Decoration', sortOrder: 2 },
              { title: 'Sound check', category: 'Audio', sortOrder: 3 },
              { title: 'VIP room readiness', category: 'Housekeeping', sortOrder: 4 },
            ],
          },
        },
      });
      void wedding;

      await this.prisma.eventChecklist.create({
        data: {
          hotelId,
          name: 'Conference Checklist',
          eventType: 'Conference',
          isTemplate: true,
          items: {
            create: [
              { title: 'AV and projector test', category: 'Audio', sortOrder: 1 },
              { title: 'Registration desk setup', category: 'Reception', sortOrder: 2 },
              { title: 'Buffet layout', category: 'Kitchen', sortOrder: 3 },
            ],
          },
        },
      });
    }

    const resourceCount = await this.prisma.eventResource.count({ where: { hotelId } });
    if (resourceCount === 0) {
      await this.prisma.eventResource.createMany({
        data: [
          { hotelId, code: 'TBL-ROUND', name: 'Round Tables', category: 'Tables', totalQty: 50, availableQty: 50 },
          { hotelId, code: 'CHR-BANQ', name: 'Banquet Chairs', category: 'Chairs', totalQty: 500, availableQty: 500 },
          { hotelId, code: 'STG-MAIN', name: 'Main Stage', category: 'Stage', totalQty: 3, availableQty: 3 },
          { hotelId, code: 'LED-WALL', name: 'LED Wall Panel', category: 'AV', totalQty: 2, availableQty: 2 },
        ],
      });
    }

    this.realtime.notifyDashboard(hotelId);
    return { seeded: true };
  }

  async listLeads(hotelId: string, status?: string): Promise<EventsLeadItem[]> {
    const rows = await this.prisma.eventLead.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(status ? { status: status as EventLeadStatus } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      leadCode: r.leadCode,
      clientName: r.clientName,
      company: r.company,
      email: r.email,
      phone: r.phone,
      eventType: r.eventType,
      source: r.source,
      status: r.status,
      expectedDate: r.expectedDate?.toISOString().slice(0, 10) ?? null,
      expectedGuests: r.expectedGuests,
      expectedRevenue: r.expectedRevenue ? Number(r.expectedRevenue) : null,
      probability: r.probability,
      assignedTo: r.assignedTo,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }));
  }

  async createLead(hotelId: string, dto: CreateEventLeadSchema, userId: string) {
    const count = await this.prisma.eventLead.count({ where: { hotelId } });
    const lead = await this.prisma.eventLead.create({
      data: {
        hotelId,
        leadCode: `EL-${String(count + 1).padStart(5, '0')}`,
        clientName: dto.clientName,
        company: dto.company,
        email: dto.email,
        phone: dto.phone,
        eventType: dto.eventType,
        source: dto.source,
        expectedDate: dto.expectedDate ? new Date(dto.expectedDate) : undefined,
        expectedGuests: dto.expectedGuests,
        expectedRevenue: dto.expectedRevenue,
        probability: dto.probability ?? 30,
        preferredHallId: dto.preferredHallId,
        notes: dto.notes,
        createdBy: userId,
      },
    });
    this.realtime.emitLeadUpdate(hotelId, lead.id);
    return lead;
  }

  async updateLeadStatus(hotelId: string, id: string, dto: UpdateEventLeadStatusSchema) {
    const lead = await this.prisma.eventLead.findFirst({ where: { id, hotelId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.eventLead.update({
      where: { id },
      data: { status: dto.status },
    });
    this.realtime.emitLeadUpdate(hotelId, id);
    return updated;
  }

  async listClients(hotelId: string): Promise<EventsClientItem[]> {
    const rows = await this.prisma.eventClient.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        events: { select: { id: true } },
        payments: { select: { amount: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      clientCode: r.clientCode,
      name: r.name,
      company: r.company,
      gstNumber: r.gstNumber,
      phone: r.phone,
      email: r.email,
      eventCount: r.events.length,
      totalSpend: r.payments.reduce((sum, p) => sum + Number(p.amount), 0),
    }));
  }

  async listQuotations(hotelId: string): Promise<EventsQuotationItem[]> {
    const rows = await this.prisma.eventQuotation.findMany({
      where: { hotelId },
      include: { client: true, lead: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      quoteNumber: r.quoteNumber,
      clientName: r.client?.name ?? r.lead?.clientName ?? null,
      eventType: r.lead?.eventType ?? null,
      status: r.status,
      eventDate: r.eventDate?.toISOString().slice(0, 10) ?? null,
      guestCount: r.guestCount,
      totalAmount: Number(r.totalAmount),
      validUntil: r.validUntil?.toISOString().slice(0, 10) ?? null,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }));
  }

  async createQuotation(hotelId: string, dto: CreateEventQuotationSchema) {
    const count = await this.prisma.eventQuotation.count({ where: { hotelId } });
    const lines = dto.lines.map((l) => ({
      category: l.category,
      description: l.description,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      amount: l.quantity * l.unitPrice,
    }));
    const subtotal = lines.reduce((s, l) => s + Number(l.amount), 0);
    const discount = dto.discount ?? 0;
    const taxAmount = Math.round((subtotal - discount) * 0.18);
    const totalAmount = subtotal - discount + taxAmount;

    const quote = await this.prisma.eventQuotation.create({
      data: {
        hotelId,
        quoteNumber: `EQ-${String(count + 1).padStart(5, '0')}`,
        leadId: dto.leadId,
        clientId: dto.clientId,
        hallId: dto.hallId,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
        guestCount: dto.guestCount,
        subtotal,
        taxAmount,
        discount,
        totalAmount,
        terms: dto.terms,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        status: EventQuotationStatus.DRAFT,
        lines: { create: lines },
      },
    });

    this.realtime.notifyDashboard(hotelId);
    return quote;
  }

  async listPayments(hotelId: string): Promise<EventsPaymentItem[]> {
    const rows = await this.prisma.eventPayment.findMany({
      where: { hotelId },
      include: { event: true, client: true },
      orderBy: { paidAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      eventName: r.event.name,
      clientName: r.client?.name ?? null,
      paymentType: r.paymentType,
      amount: Number(r.amount),
      gstAmount: Number(r.gstAmount),
      paidAt: r.paidAt.toISOString(),
    }));
  }

  async listContracts(hotelId: string): Promise<EventsContractItem[]> {
    const rows = await this.prisma.eventContract.findMany({
      where: { hotelId },
      include: { event: true, client: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      contractNumber: r.contractNumber,
      eventName: r.event.name,
      clientName: r.client?.name ?? null,
      version: r.version,
      signedAt: r.signedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }));
  }
}
