import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { InvAnalyticsData } from '@tungaos/shared';

@Injectable()
export class InvReportService {
  constructor(private prisma: PrismaService) {}

  async stockReport(hotelId: string) {
    return this.prisma.stockBalance.findMany({
      where: { hotelId },
      include: {
        item: { select: { name: true, sku: true, categoryId: true } },
        store: { select: { name: true, storeType: true } },
      },
    });
  }

  async consumptionReport(hotelId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.prisma.stockConsumption.findMany({
      where: { hotelId, consumedAt: { gte: since } },
      include: { item: { select: { name: true } }, store: { select: { name: true } } },
      orderBy: { consumedAt: 'desc' },
    });
  }

  async lowStockReport(hotelId: string) {
    const balances = await this.prisma.stockBalance.findMany({
      where: { hotelId },
      include: { item: { select: { name: true, sku: true, reorderLevel: true, minStock: true } }, store: { select: { name: true } } },
    });
    return balances.filter((b) => {
      const qty = Number(b.quantity);
      const reorder = Number(b.item.reorderLevel || b.item.minStock);
      return qty <= reorder;
    });
  }

  async departmentReport(hotelId: string) {
    const rows = await this.prisma.stockConsumption.groupBy({
      by: ['department'],
      where: { hotelId },
      _sum: { quantity: true },
    });
    return rows;
  }
}

@Injectable()
export class InvAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(hotelId: string): Promise<InvAnalyticsData> {
    const balances = await this.prisma.stockBalance.findMany({
      where: { hotelId },
      include: { item: { select: { name: true, costPrice: true, categoryId: true } } },
    });

    const inventoryValue = balances.reduce(
      (s, b) => s + Number(b.quantity) * Number(b.item.costPrice),
      0,
    );

    const consumptions = await this.prisma.stockConsumption.findMany({
      where: { hotelId },
      include: { item: { select: { name: true } } },
      orderBy: { consumedAt: 'desc' },
      take: 500,
    });

    const consumptionByItem = new Map<string, { name: string; quantity: number }>();
    for (const c of consumptions) {
      const key = c.itemId;
      const existing = consumptionByItem.get(key) ?? { name: c.item.name, quantity: 0 };
      existing.quantity += Number(c.quantity);
      consumptionByItem.set(key, existing);
    }

    const sorted = [...consumptionByItem.values()].sort((a, b) => b.quantity - a.quantity);
    const mostConsumed = sorted.slice(0, 5).map((s) => ({ name: s.name, quantity: s.quantity }));
    const leastUsed = sorted.slice(-5).reverse().map((s) => ({ name: s.name, quantity: s.quantity }));

    const deptCosts = await this.prisma.stockConsumption.groupBy({
      by: ['department'],
      where: { hotelId },
      _sum: { quantity: true },
    });

    const monthlyConsumption: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const sum = await this.prisma.stockConsumption.aggregate({
        where: { hotelId, consumedAt: { gte: start, lt: end } },
        _sum: { quantity: true },
      });
      monthlyConsumption.push({
        month: start.toLocaleString('en', { month: 'short', year: '2-digit' }),
        value: Number(sum._sum.quantity ?? 0),
      });
    }

    const movements = await this.prisma.stockMovement.groupBy({
      by: ['itemId'],
      where: { hotelId, deletedAt: null },
      _count: true,
    });

    const itemNames = await this.prisma.inventoryItem.findMany({
      where: { hotelId, id: { in: movements.map((m) => m.itemId) } },
      select: { id: true, name: true },
    });
    const nameMap = Object.fromEntries(itemNames.map((i) => [i.id, i.name]));

    const movementList = movements
      .map((m) => ({ name: nameMap[m.itemId] ?? 'Unknown', movements: m._count }))
      .sort((a, b) => b.movements - a.movements);

    const expiredValue = await this.prisma.stockBatch.aggregate({
      where: { hotelId, status: 'EXPIRED', remainingQty: { gt: 0 } },
      _sum: { remainingQty: true },
    });

    return {
      inventoryValue: Math.round(inventoryValue * 100) / 100,
      inventoryTurnover: consumptions.length > 0 ? Math.round((consumptions.length / Math.max(balances.length, 1)) * 100) / 100 : 0,
      foodCostPercent: inventoryValue > 0 ? Math.round((Number(deptCosts.find((d) => d.department === 'KITCHEN')?._sum.quantity ?? 0) / inventoryValue) * 10000) / 100 : 0,
      inventoryLoss: 0,
      expiredValue: Number(expiredValue._sum.remainingQty ?? 0),
      mostConsumed,
      leastUsed,
      monthlyConsumption,
      departmentCosts: deptCosts.map((d) => ({
        department: d.department,
        cost: Number(d._sum.quantity ?? 0),
      })),
      abcAnalysis: [
        { category: 'A (High Value)', items: Math.ceil(balances.length * 0.2), value: inventoryValue * 0.7 },
        { category: 'B (Medium)', items: Math.ceil(balances.length * 0.3), value: inventoryValue * 0.2 },
        { category: 'C (Low)', items: Math.ceil(balances.length * 0.5), value: inventoryValue * 0.1 },
      ],
      fastMoving: movementList.slice(0, 5),
      slowMoving: movementList.slice(-5).reverse(),
      deadStock: leastUsed.map((s) => ({ name: s.name, daysIdle: 90 })),
    };
  }
}

@Injectable()
export class InvBarcodeService {
  constructor(private prisma: PrismaService) {}

  async getByBarcode(hotelId: string, code: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: {
        hotelId,
        deletedAt: null,
        OR: [{ barcode: code }, { sku: code }, { itemCode: code }],
      },
    });
    if (!item) throw new NotFoundException('Item not found');

    return {
      itemId: item.id,
      sku: item.sku,
      barcode: item.barcode ?? item.sku,
      qrPayload: item.qrCode ?? JSON.stringify({ hotelId, sku: item.sku }),
    };
  }

  async regenerateCodes(hotelId: string, itemId: string) {
    const item = await this.prisma.inventoryItem.findFirst({ where: { id: itemId, hotelId } });
    if (!item) throw new NotFoundException('Item not found');

    const barcode = `INV-${item.sku}`;
    const qrCode = JSON.stringify({ hotelId, sku: item.sku, itemId: item.id, type: 'inventory' });

    return this.prisma.inventoryItem.update({
      where: { id: itemId },
      data: { barcode, qrCode },
    });
  }
}
