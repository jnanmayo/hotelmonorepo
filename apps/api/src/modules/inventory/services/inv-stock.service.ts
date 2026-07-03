import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

@Injectable()
export class InvStockService {
  constructor(private prisma: PrismaService) {}

  async listBalances(hotelId: string, storeId?: string) {
    const balances = await this.prisma.stockBalance.findMany({
      where: { hotelId, ...(storeId ? { storeId } : {}) },
      include: {
        store: { select: { name: true } },
        item: { select: { name: true, sku: true, reorderLevel: true, minStock: true } },
      },
      orderBy: { item: { name: 'asc' } },
      take: 500,
    });

    return balances.map((b) => {
      const qty = Number(b.quantity);
      const reorder = Number(b.item.reorderLevel || b.item.minStock);
      let status: 'ok' | 'low' | 'out' = 'ok';
      if (qty <= 0) status = 'out';
      else if (qty <= reorder) status = 'low';

      return {
        id: b.id,
        storeId: b.storeId,
        storeName: b.store.name,
        itemId: b.itemId,
        itemName: b.item.name,
        sku: b.item.sku,
        quantity: qty,
        reservedQty: Number(b.reservedQty),
        averageCost: Number(b.averageCost),
        stockValue: qty * Number(b.averageCost),
        reorderLevel: reorder,
        status,
      };
    });
  }

  async listMovements(hotelId: string, itemId?: string, limit = 100) {
    const movements = await this.prisma.stockMovement.findMany({
      where: { hotelId, deletedAt: null, ...(itemId ? { itemId } : {}) },
      include: { item: { select: { name: true, sku: true } } },
      orderBy: { movementDate: 'desc' },
      take: limit,
    });

    const storeIds = [...new Set(movements.map((m) => m.storeId).filter(Boolean))] as string[];
    const stores = storeIds.length
      ? await this.prisma.inventoryStore.findMany({ where: { id: { in: storeIds } }, select: { id: true, name: true } })
      : [];
    const storeMap = Object.fromEntries(stores.map((s) => [s.id, s.name]));

    return movements.map((m) => ({
      id: m.id,
      itemId: m.itemId,
      itemName: m.item.name,
      sku: m.item.sku,
      storeId: m.storeId,
      storeName: m.storeId ? storeMap[m.storeId] ?? null : null,
      type: m.type,
      quantity: Number(m.quantity),
      balanceAfter: Number(m.balanceAfter),
      unitCost: Number(m.unitCost),
      department: m.department,
      reference: m.reference,
      notes: m.notes,
      movementDate: m.movementDate.toISOString(),
      createdBy: m.createdBy,
    }));
  }
}
