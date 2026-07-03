import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FnbPosService } from '@/modules/restaurant/services/fnb-pos.service';
import { GxpRealtimeGateway } from '@/modules/gxp/gateways/gxp-realtime.gateway';

import type { GxpFoodOrderSchema, GxpMenuCategory, GxpSessionContext } from '@tungaos/shared';

@Injectable()
export class GxpDiningService {
  constructor(
    private prisma: PrismaService,
    private pos: FnbPosService,
    private realtime: GxpRealtimeGateway,
  ) {}

  async getMenu(hotelId: string): Promise<GxpMenuCategory[]> {
    const items = await this.prisma.menuItem.findMany({
      where: { hotelId, isActive: true, isAvailable: true, deletedAt: null },
      include: { category: true },
      orderBy: [{ category: { sortOrder: 'asc' } }, { name: 'asc' }],
    });

    const grouped = items.reduce<Record<string, GxpMenuCategory>>((acc, item) => {
      const name = item.category.name;
      if (!acc[name]) acc[name] = { name, items: [] };
      acc[name]!.items.push({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        imageUrl: item.imageUrl,
        prepTimeMins: item.prepTimeMins,
        itemType: item.itemType,
        isAvailable: item.isAvailable,
      });
      return acc;
    }, {});

    return Object.values(grouped);
  }

  async placeOrder(session: GxpSessionContext, input: GxpFoodOrderSchema) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { hotelId: session.hotelId, isActive: true, deletedAt: null },
    });
    if (!restaurant) throw new BadRequestException('No restaurant outlet configured');

    const bill = await this.pos.roomServiceOrder(
      session.hotelId,
      {
        restaurantId: restaurant.id,
        reservationId: session.reservationId,
        roomId: session.roomId ?? session.reservationId,
        items: input.items,
      },
      undefined,
    );

    await this.prisma.gxpNotification.create({
      data: {
        hotelId: session.hotelId,
        reservationId: session.reservationId,
        title: 'Order Placed',
        body: 'Your order has been sent to the kitchen.',
        type: 'ORDER_PLACED',
      },
    });

    this.realtime.emitToReservation(session.reservationId, {
      type: 'order:updated',
      hotelId: session.hotelId,
      reservationId: session.reservationId,
      payload: { billId: bill.id },
      timestamp: new Date().toISOString(),
    });

    return { billId: bill.id, status: 'ORDERED' };
  }
}
