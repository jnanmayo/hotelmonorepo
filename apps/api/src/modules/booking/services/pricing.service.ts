import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { BookingQuote } from '@tungaos/shared';

export interface PricingInput {
  hotelId: string;
  roomTypeId: string;
  ratePlanId?: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  rooms: number;
  addonIds?: string[];
  promoCode?: string;
  corporateCode?: string;
  loyaltyPointsRedeem?: number;
}

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  async calculateQuote(input: PricingInput): Promise<BookingQuote> {
    const nights = this.nightsBetween(input.checkIn, input.checkOut);
    const roomType = await this.prisma.roomType.findFirstOrThrow({
      where: { id: input.roomTypeId, hotelId: input.hotelId },
    });

    let ratePlan = input.ratePlanId
      ? await this.prisma.ratePlan.findFirst({ where: { id: input.ratePlanId, hotelId: input.hotelId } })
      : await this.prisma.ratePlan.findFirst({
          where: { hotelId: input.hotelId, roomTypeId: input.roomTypeId, isActive: true },
          orderBy: { sortOrder: 'asc' },
        });

    const baseNightly = ratePlan ? Number(ratePlan.baseRate) : Number(roomType.baseRate);
    let nightlyTotal = 0;

    for (let i = 0; i < nights; i++) {
      const date = new Date(input.checkIn);
      date.setDate(date.getDate() + i);
      nightlyTotal += await this.getNightlyRate(input.hotelId, input.roomTypeId, date, baseNightly);
    }

    const roomSubtotal = nightlyTotal * input.rooms;
    let addonsSubtotal = 0;
    const breakdown: { label: string; amount: number }[] = [
      { label: `Room (${nights} night${nights > 1 ? 's' : ''} × ${input.rooms} room${input.rooms > 1 ? 's' : ''})`, amount: roomSubtotal },
    ];

    if (input.addonIds?.length) {
      const addons = await this.prisma.bookingAddon.findMany({
        where: { id: { in: input.addonIds }, hotelId: input.hotelId, isActive: true },
      });
      for (const addon of addons) {
        let price = Number(addon.price);
        if (addon.perNight) price *= nights;
        if (addon.perPerson) price *= input.adults + input.children;
        addonsSubtotal += price;
        breakdown.push({ label: addon.name, amount: price });
      }
    }

    let discountAmount = 0;
    let couponApplied: string | undefined;

    if (input.promoCode) {
      const coupon = await this.validateCoupon(input.hotelId, input.promoCode, roomSubtotal + addonsSubtotal);
      if (coupon) {
        discountAmount = coupon.discount;
        couponApplied = input.promoCode;
        breakdown.push({ label: `Promo: ${input.promoCode}`, amount: -discountAmount });
      }
    }

    if (input.loyaltyPointsRedeem && input.loyaltyPointsRedeem > 0) {
      const loyaltyDiscount = input.loyaltyPointsRedeem * 0.25;
      discountAmount += loyaltyDiscount;
      breakdown.push({ label: 'Loyalty Points', amount: -loyaltyDiscount });
    }

    const subtotal = roomSubtotal + addonsSubtotal - discountAmount;
    const taxAmount = await this.calculateTax(input.hotelId, subtotal);
    breakdown.push({ label: 'Taxes & Fees', amount: taxAmount });

    const totalAmount = subtotal + taxAmount;

    return {
      roomTypeId: input.roomTypeId,
      ratePlanId: ratePlan?.id ?? 'default',
      nights,
      roomSubtotal,
      addonsSubtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      currency: 'INR',
      breakdown,
      couponApplied,
    };
  }

  async validateCoupon(hotelId: string, code: string, subtotal: number) {
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        hotelId,
        code: code.toUpperCase(),
        isActive: true,
        deletedAt: null,
        OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] }],
      },
    });
    if (!coupon) return null;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
    if (coupon.minAmount && subtotal < Number(coupon.minAmount)) return null;

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = subtotal * (Number(coupon.value) / 100);
    } else {
      discount = Number(coupon.value);
    }
    return { coupon, discount: Math.min(discount, subtotal) };
  }

  async getRatePlansForRoom(hotelId: string, roomTypeId: string, checkIn: Date, checkOut: Date, rooms: number) {
    const nights = this.nightsBetween(checkIn, checkOut);
    const plans = await this.prisma.ratePlan.findMany({
      where: { hotelId, roomTypeId, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });

    const roomType = await this.prisma.roomType.findFirstOrThrow({ where: { id: roomTypeId } });
    const allPlans = plans.length > 0 ? plans : [{
      id: 'default',
      name: 'Best Available Rate',
      code: 'BAR',
      planType: 'STANDARD' as const,
      baseRate: roomType.baseRate,
      breakfastIncluded: false,
      cancellationPolicy: 'FREE_CANCELLATION' as const,
      description: 'Flexible rate with free cancellation',
    }];

    const results = [];
    for (const plan of allPlans) {
      let nightlyTotal = 0;
      for (let i = 0; i < nights; i++) {
        const date = new Date(checkIn);
        date.setDate(date.getDate() + i);
        nightlyTotal += await this.getNightlyRate(hotelId, roomTypeId, date, Number(plan.baseRate));
      }
      const totalPrice = nightlyTotal * rooms;
      results.push({
        id: plan.id,
        name: plan.name,
        code: plan.code,
        planType: plan.planType,
        pricePerNight: Math.round(nightlyTotal / nights),
        totalPrice,
        nights,
        breakfastIncluded: plan.breakfastIncluded,
        cancellationPolicy: plan.cancellationPolicy,
        description: plan.description ?? undefined,
      });
    }
    return results;
  }

  private async getNightlyRate(hotelId: string, roomTypeId: string, date: Date, baseRate: number) {
    const dayOfWeek = date.getDay();
    const rules = await this.prisma.dynamicPriceRule.findMany({
      where: {
        hotelId,
        isActive: true,
        deletedAt: null,
        OR: [{ roomTypeId: null }, { roomTypeId }],
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: date } }] },
          { OR: [{ endDate: null }, { endDate: { gte: date } }] },
          { OR: [{ dayOfWeek: null }, { dayOfWeek }] },
        ],
      },
      orderBy: { priority: 'desc' },
      take: 1,
    });

    const rule = rules[0];
    if (!rule) return baseRate;
    if (rule.fixedRate) return Number(rule.fixedRate);
    return baseRate * (1 + Number(rule.adjustmentPct) / 100);
  }

  private async calculateTax(hotelId: string, subtotal: number) {
    const taxes = await this.prisma.tax.findMany({
      where: { hotelId, isActive: true, deletedAt: null },
    });
    let total = 0;
    for (const tax of taxes) {
      if (tax.appliesTo === 'room' || !tax.appliesTo) {
        total += subtotal * (Number(tax.rate) / 100);
      }
    }
    return Math.round(total * 100) / 100;
  }

  private nightsBetween(checkIn: Date, checkOut: Date) {
    const ms = checkOut.getTime() - checkIn.getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }
}
