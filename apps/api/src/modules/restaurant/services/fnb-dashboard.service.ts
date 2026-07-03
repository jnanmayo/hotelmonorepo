import { Injectable } from '@nestjs/common';
import { BillStatus, KitchenOrderStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { FnbDashboardStats } from '@tungaos/shared';

@Injectable()
export class FnbDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<FnbDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayBills,
      openBills,
      tables,
      kitchenOrders,
      roomServiceCount,
      topItems,
      outlets,
    ] = await Promise.all([
      this.prisma.bill.findMany({
        where: { hotelId, deletedAt: null, createdAt: { gte: today, lt: tomorrow }, status: { in: [BillStatus.OPEN, BillStatus.CLOSED] } },
        include: { restaurant: true, items: true },
      }),
      this.prisma.bill.count({ where: { hotelId, deletedAt: null, status: BillStatus.OPEN } }),
      this.prisma.restaurantTable.findMany({ where: { hotelId, isActive: true, deletedAt: null } }),
      this.prisma.kitchenOrder.findMany({
        where: { hotelId, deletedAt: null, status: { in: [KitchenOrderStatus.PENDING, KitchenOrderStatus.PREPARING, KitchenOrderStatus.READY] } },
      }),
      this.prisma.bill.count({
        where: { hotelId, deletedAt: null, orderType: 'ROOM_SERVICE', status: BillStatus.OPEN, createdAt: { gte: today } },
      }),
      this.prisma.billItem.groupBy({
        by: ['description'],
        where: { hotelId, deletedAt: null, bill: { createdAt: { gte: today, lt: tomorrow } } },
        _sum: { quantity: true, totalAmount: true },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 5,
      }),
      this.prisma.restaurant.findMany({ where: { hotelId, isActive: true, deletedAt: null } }),
    ]);

    const todaySales = todayBills.reduce((s, b) => s + Number(b.totalAmount), 0);
    const todayOrders = todayBills.length;
    const occupied = tables.filter((t) => t.isOccupied || t.tableStatus === 'OCCUPIED').length;

    const revenueByOutlet = (type: string) =>
      todayBills.filter((b) => b.restaurant?.outletType === type).reduce((s, b) => s + Number(b.totalAmount), 0);

    const now = Date.now();
    const delayed = kitchenOrders.filter((o) => {
      const age = (now - o.createdAt.getTime()) / 60000;
      return age > 20 && o.status !== KitchenOrderStatus.READY;
    }).length;

    return {
      todaySales,
      todayOrders,
      averageOrderValue: todayOrders > 0 ? Math.round((todaySales / todayOrders) * 100) / 100 : 0,
      topSellingItems: topItems.map((i) => ({
        name: i.description,
        quantity: i._sum.quantity ?? 0,
        revenue: Number(i._sum.totalAmount ?? 0),
      })),
      runningTables: tables.filter((t) => t.tableStatus === 'OCCUPIED').length,
      occupiedTables: occupied,
      availableTables: tables.filter((t) => t.tableStatus === 'AVAILABLE').length,
      kitchenQueue: kitchenOrders.filter((o) => o.status === KitchenOrderStatus.PENDING).length,
      ordersReady: kitchenOrders.filter((o) => o.status === KitchenOrderStatus.READY).length,
      ordersDelayed: delayed,
      roomServiceOrders: roomServiceCount,
      pendingBills: openBills,
      revenueToday: todaySales,
      restaurantRevenue: revenueByOutlet('RESTAURANT'),
      cafeRevenue: revenueByOutlet('CAFE'),
      barRevenue: revenueByOutlet('BAR'),
      takeawayRevenue: todayBills.filter((b) => b.orderType === 'TAKEAWAY').reduce((s, b) => s + Number(b.totalAmount), 0),
    };
  }
}
