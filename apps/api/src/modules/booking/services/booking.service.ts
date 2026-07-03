import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookingSource, PaymentMethod, ReservationStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AvailabilityService } from '@/modules/booking/services/availability.service';
import { PaymentService } from '@/modules/booking/services/payment.service';
import { PricingService } from '@/modules/booking/services/pricing.service';

import type { CreateBookingInput } from '@tungaos/shared';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private availability: AvailabilityService,
    private pricing: PricingService,
    private payment: PaymentService,
  ) {}

  async getHotelBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug, deletedAt: null, isActive: true },
    });
    if (!hotel) throw new NotFoundException(`Hotel not found: ${slug}`);
    return hotel;
  }

  async searchAvailability(params: {
    hotelSlug: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
    sessionId?: string;
  }) {
    const hotel = await this.getHotelBySlug(params.hotelSlug);
    const checkIn = new Date(params.checkIn);
    const checkOut = new Date(params.checkOut);
    if (checkOut <= checkIn) throw new BadRequestException('Check-out must be after check-in');

    const rooms = await this.availability.search({
      hotelId: hotel.id,
      checkIn,
      checkOut,
      adults: params.adults,
      children: params.children,
      rooms: params.rooms,
      sessionId: params.sessionId,
    });

    const enriched = await Promise.all(
      rooms.map(async (room) => {
        const ratePlans = await this.pricing.getRatePlansForRoom(
          hotel.id,
          room.roomTypeId,
          checkIn,
          checkOut,
          params.rooms,
        );
        const lowestPrice = ratePlans[0]?.totalPrice ?? room.baseRate;
        return {
          ...room,
          ratePlans,
          lowestPrice,
          breakfastIncluded: ratePlans[0]?.breakfastIncluded ?? false,
          cancellationPolicy: ratePlans[0]?.cancellationPolicy ?? 'FREE_CANCELLATION',
        };
      }),
    );

    return { hotel: { id: hotel.id, name: hotel.name, slug: hotel.slug }, rooms: enriched };
  }

  async getRoomDetail(hotelSlug: string, roomTypeId: string, checkIn: string, checkOut: string, rooms: number) {
    const hotel = await this.getHotelBySlug(hotelSlug);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const roomType = await this.prisma.roomType.findFirst({
      where: { id: roomTypeId, hotelId: hotel.id, isActive: true },
      include: {
        amenities: { include: { amenity: true } },
        images: { include: { file: true }, orderBy: { sortOrder: 'asc' } },
        cmsWebsiteRooms: { where: { deletedAt: null }, take: 1 },
      },
    });
    if (!roomType) throw new NotFoundException('Room not found');

    const cms = roomType.cmsWebsiteRooms[0];
    const availableCount = await this.availability.getAvailableCount(
      hotel.id,
      roomTypeId,
      checkInDate,
      checkOutDate,
    );
    const ratePlans = await this.pricing.getRatePlansForRoom(
      hotel.id,
      roomTypeId,
      checkInDate,
      checkOutDate,
      rooms,
    );
    const addons = await this.prisma.bookingAddon.findMany({
      where: { hotelId: hotel.id, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });

    return {
      roomTypeId: roomType.id,
      name: cms?.name ?? roomType.name,
      description: cms?.description ?? roomType.description,
      shortDescription: cms?.shortDescription,
      images: cms?.images ?? roomType.images.map((i) => ({ url: i.file.fileUrl })),
      images360: cms?.images360 ?? [],
      virtualTourUrl: cms?.virtualTourUrl,
      amenities: roomType.amenities.map((a) => a.amenity.name),
      sizeSqm: roomType.sizeSqm ? Number(roomType.sizeSqm) : null,
      maxOccupancy: roomType.maxOccupancy,
      bedType: cms?.bedType ?? roomType.bedType,
      viewType: roomType.viewType,
      availableCount,
      ratePlans,
      addons: addons.map((a) => ({
        id: a.id,
        name: a.name,
        code: a.code,
        category: a.category,
        description: a.description,
        price: Number(a.price),
        perNight: a.perNight,
        perPerson: a.perPerson,
        imageUrl: a.imageUrl,
      })),
    };
  }

  async getAddons(hotelSlug: string) {
    const hotel = await this.getHotelBySlug(hotelSlug);
    return this.prisma.bookingAddon.findMany({
      where: { hotelId: hotel.id, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createBooking(input: CreateBookingInput) {
    const hotel = await this.getHotelBySlug(input.hotelSlug);
    const checkIn = new Date(input.checkIn);
    const checkOut = new Date(input.checkOut);

    const quote = await this.pricing.calculateQuote({
      hotelId: hotel.id,
      roomTypeId: input.roomTypeId,
      ratePlanId: input.ratePlanId,
      checkIn,
      checkOut,
      adults: input.adults,
      children: input.children,
      rooms: input.rooms,
      addonIds: input.addonIds,
      promoCode: input.promoCode,
      corporateCode: input.corporateCode,
      loyaltyPointsRedeem: input.loyaltyPointsRedeem,
    });

    const available = await this.availability.getAvailableCount(
      hotel.id,
      input.roomTypeId,
      checkIn,
      checkOut,
      input.sessionId,
    );
    if (available < input.rooms) {
      throw new BadRequestException('Selected rooms are no longer available');
    }

    const reservationCode = await this.generateReservationCode(hotel.id);

    const guest = await this.prisma.guest.upsert({
      where: {
        hotelId_guestCode: {
          hotelId: hotel.id,
          guestCode: `WEB-${input.guest.email.toLowerCase()}`,
        },
      },
      create: {
        hotelId: hotel.id,
        guestCode: `WEB-${input.guest.email.toLowerCase()}`,
        firstName: input.guest.firstName,
        lastName: input.guest.lastName,
        email: input.guest.email,
        phone: input.guest.phone,
        nationality: input.guest.nationality,
        address: input.guest.address,
        city: input.guest.city,
        state: input.guest.state,
        postalCode: input.guest.postalCode,
      },
      update: {
        firstName: input.guest.firstName,
        lastName: input.guest.lastName,
        phone: input.guest.phone,
        nationality: input.guest.nationality,
        address: input.guest.address,
      },
    });

    const roomType = await this.prisma.roomType.findFirstOrThrow({ where: { id: input.roomTypeId } });

    const reservation = await this.prisma.$transaction(async (tx) => {
      const res = await tx.reservation.create({
        data: {
          hotelId: hotel.id,
          guestId: guest.id,
          roomTypeId: input.roomTypeId,
          reservationCode,
          status: ReservationStatus.PENDING,
          source: BookingSource.DIRECT_WEBSITE,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adults: input.adults,
          children: input.children,
          roomRate: quote.roomSubtotal / quote.nights,
          totalAmount: quote.totalAmount,
          taxAmount: quote.taxAmount,
          discountAmount: quote.discountAmount,
          paidAmount: 0,
          balanceAmount: quote.totalAmount,
          currency: quote.currency,
          specialRequests: input.guest.specialRequests,
        },
      });

      if (input.addonIds?.length) {
        const addons = await tx.bookingAddon.findMany({ where: { id: { in: input.addonIds } } });
        for (const addon of addons) {
          let price = Number(addon.price);
          if (addon.perNight) price *= quote.nights;
          if (addon.perPerson) price *= input.adults + input.children;
          await tx.bookingAddonSelection.create({
            data: {
              hotelId: hotel.id,
              reservationId: res.id,
              addonId: addon.id,
              quantity: 1,
              unitPrice: Number(addon.price),
              totalPrice: price,
            },
          });
        }
      }

      await tx.reservationHistory.create({
        data: {
          hotelId: hotel.id,
          reservationId: res.id,
          toStatus: ReservationStatus.PENDING,
          changeReason: 'Direct website booking created',
        },
      });

      await tx.bookingEvent.create({
        data: {
          hotelId: hotel.id,
          reservationId: res.id,
          sessionId: input.sessionId,
          eventType: 'BOOKING_CREATED',
          description: `Booking ${reservationCode} created`,
          metadata: { quote: JSON.parse(JSON.stringify(quote)) },
        },
      });

      await tx.inventoryHold.updateMany({
        where: { sessionId: input.sessionId, status: 'ACTIVE' },
        data: { status: 'CONVERTED' },
      });

      return res;
    });

    const paymentResult = await this.payment.processPayment({
      hotelId: hotel.id,
      reservationId: reservation.id,
      guestId: guest.id,
      amount: quote.totalAmount,
      currency: quote.currency,
      method: input.paymentMethod as PaymentMethod,
      guestEmail: input.guest.email,
      guestName: `${input.guest.firstName} ${input.guest.lastName}`,
      reservationCode,
    });

    const updated = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: paymentResult.status === 'CAPTURED' ? ReservationStatus.CONFIRMED : ReservationStatus.PENDING,
        paidAmount: paymentResult.paidAmount,
        balanceAmount: quote.totalAmount - paymentResult.paidAmount,
      },
    });

    await this.prisma.reservationHistory.create({
      data: {
        hotelId: hotel.id,
        reservationId: reservation.id,
        fromStatus: ReservationStatus.PENDING,
        toStatus: updated.status,
        changeReason: paymentResult.status === 'CAPTURED' ? 'Payment captured' : 'Awaiting payment',
      },
    });

    const invoice = await this.prisma.invoice.create({
      data: {
        hotelId: hotel.id,
        guestId: guest.id,
        reservationId: reservation.id,
        invoiceNumber: `INV-${reservationCode}`,
        status: paymentResult.status === 'CAPTURED' ? 'PAID' : 'ISSUED',
        subtotal: quote.roomSubtotal + quote.addonsSubtotal,
        taxAmount: quote.taxAmount,
        discountAmount: quote.discountAmount,
        totalAmount: quote.totalAmount,
        paidAmount: paymentResult.paidAmount,
        balanceAmount: quote.totalAmount - paymentResult.paidAmount,
        currency: quote.currency,
        issuedAt: new Date(),
      },
    });

    return {
      reservationCode: updated.reservationCode,
      status: updated.status,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guestName: `${input.guest.firstName} ${input.guest.lastName}`,
      guestEmail: input.guest.email,
      roomName: roomType.name,
      totalAmount: Number(updated.totalAmount),
      paidAmount: Number(updated.paidAmount),
      currency: updated.currency,
      qrCodeData: `TUNGAOS:${reservationCode}`,
      invoiceNumber: invoice.invoiceNumber,
      payment: paymentResult,
    };
  }

  async getBooking(hotelSlug: string, reservationCode: string) {
    const hotel = await this.getHotelBySlug(hotelSlug);
    const reservation = await this.prisma.reservation.findFirst({
      where: { hotelId: hotel.id, reservationCode, deletedAt: null },
      include: {
        guest: true,
        roomType: true,
        addonSelections: { include: { addon: true } },
        invoices: true,
        payments: true,
      },
    });
    if (!reservation) throw new NotFoundException('Booking not found');
    return reservation;
  }

  async cancelBooking(hotelSlug: string, reservationCode: string, reason?: string) {
    const hotel = await this.getHotelBySlug(hotelSlug);
    const reservation = await this.prisma.reservation.findFirst({
      where: { hotelId: hotel.id, reservationCode, deletedAt: null },
    });
    if (!reservation) throw new NotFoundException('Booking not found');
    if (reservation.status === 'CANCELLED') throw new BadRequestException('Already cancelled');

    const updated = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.CANCELLED },
    });

    await this.prisma.reservationHistory.create({
      data: {
        hotelId: hotel.id,
        reservationId: reservation.id,
        fromStatus: reservation.status,
        toStatus: ReservationStatus.CANCELLED,
        changeReason: reason ?? 'Guest cancellation',
      },
    });

    return updated;
  }

  async getDashboardStats(hotelId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayBookings, todayRevenue, directCount, otaCount, cancelled, allBookings] = await Promise.all([
      this.prisma.reservation.count({
        where: { hotelId, createdAt: { gte: today, lt: tomorrow }, deletedAt: null },
      }),
      this.prisma.reservation.aggregate({
        where: { hotelId, createdAt: { gte: today, lt: tomorrow }, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      this.prisma.reservation.count({
        where: { hotelId, source: 'DIRECT_WEBSITE', deletedAt: null },
      }),
      this.prisma.reservation.count({
        where: { hotelId, source: { in: ['OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT'] }, deletedAt: null },
      }),
      this.prisma.reservation.count({
        where: { hotelId, status: 'CANCELLED', deletedAt: null },
      }),
      this.prisma.reservation.aggregate({
        where: { hotelId, status: { not: 'CANCELLED' }, deletedAt: null },
        _avg: { totalAmount: true },
        _count: true,
      }),
    ]);

    const total = directCount + otaCount || 1;
    const topRoom = await this.prisma.reservation.groupBy({
      by: ['roomTypeId'],
      where: { hotelId, deletedAt: null },
      _count: true,
      orderBy: { _count: { roomTypeId: 'desc' } },
      take: 1,
    });

    let topRoomName = 'N/A';
    if (topRoom[0]) {
      const rt = await this.prisma.roomType.findUnique({ where: { id: topRoom[0].roomTypeId } });
      topRoomName = rt?.name ?? 'N/A';
    }

    return {
      todayBookings,
      todayRevenue: Number(todayRevenue._sum.totalAmount ?? 0),
      directBookingPct: Math.round((directCount / total) * 100),
      otaBookingPct: Math.round((otaCount / total) * 100),
      conversionRate: 3.8,
      cancelledBookings: cancelled,
      averageBookingValue: Number(allBookings._avg.totalAmount ?? 0),
      topRoom: topRoomName,
      topOffer: 'Weekend Escape',
      corporateRevenue: 0,
    };
  }

  async listBookings(hotelId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where: { hotelId, deletedAt: null },
        include: { guest: true, roomType: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({ where: { hotelId, deletedAt: null } }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  private async generateReservationCode(hotelId: string) {
    const count = await this.prisma.reservation.count({ where: { hotelId } });
    const code = `TUN${String(count + 1).padStart(6, '0')}`;
    return code;
  }
}
