import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryStoreType, StockMovementType } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { InventoryRealtimeGateway } from '@/modules/inventory/gateways/inventory-realtime.gateway';

import type {
  CreateCategorySchema,
  CreateItemSchema,
  CreateStoreSchema,
  CreateUnitSchema,
} from '@tungaos/shared';

const DEFAULT_STORES: { name: string; code: string; storeType: InventoryStoreType }[] = [
  { name: 'Main Store', code: 'MAIN', storeType: 'MAIN' },
  { name: 'Kitchen Store', code: 'KITCHEN', storeType: 'KITCHEN' },
  { name: 'Restaurant Store', code: 'RESTAURANT', storeType: 'RESTAURANT' },
  { name: 'Bar Store', code: 'BAR', storeType: 'BAR' },
  { name: 'Housekeeping Store', code: 'HK', storeType: 'HOUSEKEEPING' },
  { name: 'Laundry Store', code: 'LAUNDRY', storeType: 'LAUNDRY' },
  { name: 'Maintenance Store', code: 'MAINT', storeType: 'MAINTENANCE' },
  { name: 'Engineering Store', code: 'ENG', storeType: 'ENGINEERING' },
  { name: 'Spa Store', code: 'SPA', storeType: 'SPA' },
  { name: 'Banquet Store', code: 'BANQUET', storeType: 'BANQUET' },
  { name: 'Office Store', code: 'OFFICE', storeType: 'OFFICE' },
];

const DEFAULT_CATEGORIES: { name: string; code: string; children?: { name: string; code: string }[] }[] = [
  { name: 'Food', code: 'FOOD', children: [
    { name: 'Vegetables', code: 'VEG' }, { name: 'Fruits', code: 'FRUIT' },
    { name: 'Milk & Dairy', code: 'DAIRY' }, { name: 'Oil', code: 'OIL' },
    { name: 'Rice', code: 'RICE' }, { name: 'Spices', code: 'SPICE' },
  ]},
  { name: 'Beverages', code: 'BEV', children: [
    { name: 'Soft Drinks', code: 'SOFT' }, { name: 'Alcohol', code: 'ALC' },
  ]},
  { name: 'Cleaning Supplies', code: 'CLEAN' },
  { name: 'Toiletries', code: 'TOILET' },
  { name: 'Linen', code: 'LINEN' },
  { name: 'Uniforms', code: 'UNIFORM' },
  { name: 'Electrical', code: 'ELEC' },
  { name: 'Furniture', code: 'FURN' },
  { name: 'Stationery', code: 'STAT' },
  { name: 'Medicine', code: 'MED' },
  { name: 'Spa Products', code: 'SPA' },
];

const DEFAULT_UNITS = [
  { name: 'Kilogram', symbol: 'Kg' }, { name: 'Gram', symbol: 'g' },
  { name: 'Litre', symbol: 'L' }, { name: 'Millilitre', symbol: 'ML' },
  { name: 'Piece', symbol: 'Pc' }, { name: 'Packet', symbol: 'Pkt' },
  { name: 'Bottle', symbol: 'Btl' }, { name: 'Carton', symbol: 'Ctn' },
  { name: 'Box', symbol: 'Box' }, { name: 'Dozen', symbol: 'Dzn' },
  { name: 'Meter', symbol: 'M' }, { name: 'Roll', symbol: 'Roll' },
];

@Injectable()
export class InvMasterService {
  constructor(
    private prisma: PrismaService,
    private realtime: InventoryRealtimeGateway,
  ) {}

  async seedDefaults(hotelId: string, userId?: string) {
    const existing = await this.prisma.inventoryStore.count({ where: { hotelId } });
    if (existing > 0) return { seeded: false, message: 'Already initialized' };

    await this.prisma.$transaction(async (tx) => {
      for (const s of DEFAULT_STORES) {
        await tx.inventoryStore.create({ data: { hotelId, ...s, createdBy: userId } });
      }
      for (const u of DEFAULT_UNITS) {
        await tx.unitOfMeasure.create({ data: { hotelId, ...u, createdBy: userId } });
      }
      for (const cat of DEFAULT_CATEGORIES) {
        const parent = await tx.inventoryCategory.create({
          data: { hotelId, name: cat.name, code: cat.code, createdBy: userId },
        });
        for (const child of cat.children ?? []) {
          await tx.inventoryCategory.create({
            data: { hotelId, name: child.name, code: child.code, parentId: parent.id, createdBy: userId },
          });
        }
      }
    });

    this.realtime.notifyDashboard(hotelId);
    return { seeded: true };
  }

  async listStores(hotelId: string) {
    const stores = await this.prisma.inventoryStore.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        manager: { include: { user: { select: { firstName: true, lastName: true } } } },
        _count: { select: { stockBalances: true } },
      },
      orderBy: { name: 'asc' },
    });

    return stores.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      storeType: s.storeType,
      location: s.location,
      capacity: s.capacity ? Number(s.capacity) : null,
      managerId: s.managerId,
      managerName: s.manager
        ? `${s.manager.user.firstName} ${s.manager.user.lastName}`.trim()
        : null,
      itemCount: s._count.stockBalances,
      stockValue: 0,
      isActive: s.isActive,
    }));
  }

  async createStore(hotelId: string, dto: CreateStoreSchema, userId?: string) {
    const store = await this.prisma.inventoryStore.create({
      data: { hotelId, ...dto, capacity: dto.capacity, createdBy: userId },
    });
    this.realtime.notifyDashboard(hotelId);
    return store;
  }

  async listCategories(hotelId: string) {
    const cats = await this.prisma.inventoryCategory.findMany({
      where: { hotelId, deletedAt: null },
      include: { _count: { select: { items: true } } },
      orderBy: { name: 'asc' },
    });
    return cats.map((c) => ({
      id: c.id, name: c.name, code: c.code, parentId: c.parentId, itemCount: c._count.items,
    }));
  }

  async createCategory(hotelId: string, dto: CreateCategorySchema, userId?: string) {
    return this.prisma.inventoryCategory.create({
      data: { hotelId, ...dto, createdBy: userId },
    });
  }

  async listUnits(hotelId: string) {
    return this.prisma.unitOfMeasure.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async createUnit(hotelId: string, dto: CreateUnitSchema, userId?: string) {
    return this.prisma.unitOfMeasure.create({
      data: { hotelId, ...dto, createdBy: userId },
    });
  }

  async listItems(hotelId: string, search?: string) {
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }] } : {}),
      },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
        unit: { select: { symbol: true } },
        defaultStore: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
      take: 200,
    });

    return items.map((i) => ({
      id: i.id,
      itemCode: i.itemCode,
      sku: i.sku,
      barcode: i.barcode,
      qrCode: i.qrCode,
      name: i.name,
      description: i.description,
      categoryId: i.categoryId,
      categoryName: i.category.name,
      subCategoryId: i.subCategoryId,
      subCategoryName: i.subCategory?.name ?? null,
      brand: i.brand,
      defaultStoreId: i.defaultStoreId,
      defaultStoreName: i.defaultStore?.name ?? null,
      hsnCode: i.hsnCode,
      gstRate: Number(i.gstRate),
      unitId: i.unitId,
      unitSymbol: i.unit.symbol,
      purchaseUnitId: i.purchaseUnitId,
      consumptionUnitId: i.consumptionUnitId,
      costPrice: Number(i.costPrice),
      sellingPrice: Number(i.sellingPrice),
      currentStock: Number(i.currentStock),
      reorderLevel: Number(i.reorderLevel),
      minStock: Number(i.minStock),
      maxStock: Number(i.maxStock),
      expiryRequired: i.expiryRequired,
      batchTracking: i.batchTracking,
      imageUrl: i.imageUrl,
      itemStatus: i.itemStatus,
      isActive: i.isActive,
    }));
  }

  async createItem(hotelId: string, dto: CreateItemSchema, userId?: string) {
    const barcode = `INV-${dto.sku}`;
    const qrCode = JSON.stringify({ hotelId, sku: dto.sku, type: 'inventory' });

    const item = await this.prisma.inventoryItem.create({
      data: {
        hotelId,
        name: dto.name,
        sku: dto.sku,
        itemCode: dto.itemCode ?? dto.sku,
        barcode,
        qrCode,
        categoryId: dto.categoryId,
        subCategoryId: dto.subCategoryId,
        unitId: dto.unitId,
        purchaseUnitId: dto.purchaseUnitId,
        consumptionUnitId: dto.consumptionUnitId,
        defaultStoreId: dto.defaultStoreId,
        description: dto.description,
        brand: dto.brand,
        hsnCode: dto.hsnCode,
        gstRate: dto.gstRate,
        costPrice: dto.costPrice,
        sellingPrice: dto.sellingPrice,
        reorderLevel: dto.reorderLevel,
        minStock: dto.minStock,
        maxStock: dto.maxStock,
        expiryRequired: dto.expiryRequired,
        batchTracking: dto.batchTracking,
        currentStock: dto.initialStock ?? 0,
        createdBy: userId,
      },
    });

    if (dto.defaultStoreId && dto.initialStock && dto.initialStock > 0) {
      await this.prisma.stockBalance.create({
        data: {
          hotelId,
          storeId: dto.defaultStoreId,
          itemId: item.id,
          quantity: dto.initialStock,
          averageCost: dto.costPrice,
          lastMovement: new Date(),
        },
      });
      await this.prisma.stockMovement.create({
        data: {
          hotelId,
          itemId: item.id,
          storeId: dto.defaultStoreId,
          type: StockMovementType.RECEIPT,
          quantity: dto.initialStock,
          balanceAfter: dto.initialStock,
          unitCost: dto.costPrice,
          reference: 'INITIAL_STOCK',
          createdBy: userId,
        },
      });
    }

    this.realtime.emitStockUpdate(hotelId, item.id);
    return item;
  }

  async getItem(hotelId: string, id: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id, hotelId, deletedAt: null },
      include: {
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
        unit: { select: { symbol: true } },
        defaultStore: { select: { name: true } },
      },
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }
}
