import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetLifecycleStage } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import { DEFAULT_ASSET_CATEGORIES } from '@tungaos/shared';
import type { CreateAssetSchema, UpdateAssetLifecycleSchema } from '@tungaos/shared';
import type { EamAssetItem } from '@tungaos/shared';

@Injectable()
export class EamAssetService {
  constructor(private prisma: PrismaService) {}

  private mapAsset(a: {
    id: string;
    code: string;
    name: string;
    category: string | null;
    department: string | null;
    location: string | null;
    serialNumber: string | null;
    manufacturer: string | null;
    model: string | null;
    status: string;
    lifecycleStage: AssetLifecycleStage;
    purchaseCost: { toNumber(): number } | null;
    currentValue: { toNumber(): number } | null;
    warrantyEnd: Date | null;
    amcEnd: Date | null;
    qrCode: string | null;
    barcode: string | null;
    assetCategory?: { name: string } | null;
    room?: { roomNumber: string } | null;
  }): EamAssetItem {
    return {
      id: a.id,
      code: a.code,
      name: a.name,
      category: a.category,
      categoryName: a.assetCategory?.name ?? a.category,
      department: a.department,
      location: a.location,
      roomNumber: a.room?.roomNumber ?? null,
      serialNumber: a.serialNumber,
      manufacturer: a.manufacturer,
      model: a.model,
      status: a.status,
      lifecycleStage: a.lifecycleStage,
      purchaseCost: a.purchaseCost ? Number(a.purchaseCost) : null,
      currentValue: a.currentValue ? Number(a.currentValue) : null,
      warrantyEnd: a.warrantyEnd?.toISOString() ?? null,
      amcEnd: a.amcEnd?.toISOString() ?? null,
      qrCode: a.qrCode,
      barcode: a.barcode,
    };
  }

  async seedCategories(hotelId: string) {
    const existing = await this.prisma.assetCategory.count({ where: { hotelId } });
    if (existing > 0) return existing;

    await this.prisma.assetCategory.createMany({
      data: DEFAULT_ASSET_CATEGORIES.map((name, i) => ({
        hotelId,
        name,
        code: name.toUpperCase().replace(/\s+/g, '_').slice(0, 30),
        sortOrder: i,
      })),
    });
    return DEFAULT_ASSET_CATEGORIES.length;
  }

  async list(hotelId: string, search?: string): Promise<EamAssetItem[]> {
    const rows = await this.prisma.asset.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }] } : {}),
      },
      include: { assetCategory: true, room: true },
      orderBy: { name: 'asc' },
      take: 200,
    });
    return rows.map((r) => this.mapAsset(r));
  }

  async get(hotelId: string, id: string) {
    const row = await this.prisma.asset.findFirst({
      where: { id, hotelId },
      include: { assetCategory: true, room: true, history: { orderBy: { createdAt: 'desc' }, take: 20 }, documents: true },
    });
    if (!row) throw new NotFoundException('Asset not found');
    return { ...this.mapAsset(row), history: row.history, documents: row.documents };
  }

  async create(hotelId: string, dto: CreateAssetSchema, userId?: string) {
    const asset = await this.prisma.asset.create({
      data: {
        hotelId,
        name: dto.name,
        code: dto.code,
        categoryId: dto.categoryId,
        category: dto.category,
        department: dto.department,
        location: dto.location,
        building: dto.building,
        floor: dto.floor,
        roomId: dto.roomId,
        serialNumber: dto.serialNumber,
        manufacturer: dto.manufacturer,
        model: dto.model,
        vendorName: dto.vendorName,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        installationDate: dto.installationDate ? new Date(dto.installationDate) : undefined,
        warrantyStart: dto.warrantyStart ? new Date(dto.warrantyStart) : undefined,
        warrantyEnd: dto.warrantyEnd ? new Date(dto.warrantyEnd) : undefined,
        amcStart: dto.amcStart ? new Date(dto.amcStart) : undefined,
        amcEnd: dto.amcEnd ? new Date(dto.amcEnd) : undefined,
        purchaseCost: dto.purchaseCost,
        currentValue: dto.currentValue ?? dto.purchaseCost,
        usefulLifeYears: dto.usefulLifeYears,
        barcode: dto.barcode,
        qrCode: dto.qrCode ?? dto.code,
        lifecycleStage: AssetLifecycleStage.PURCHASED,
        createdBy: userId,
      },
      include: { assetCategory: true, room: true },
    });

    await this.prisma.assetHistory.create({
      data: { hotelId, assetId: asset.id, event: AssetLifecycleStage.PURCHASED, createdBy: userId },
    });

    return this.mapAsset(asset);
  }

  async updateLifecycle(hotelId: string, id: string, dto: UpdateAssetLifecycleSchema, userId?: string) {
    const asset = await this.prisma.asset.update({
      where: { id },
      data: { lifecycleStage: dto.lifecycleStage, updatedBy: userId },
      include: { assetCategory: true, room: true },
    });
    if (asset.hotelId !== hotelId) throw new NotFoundException('Asset not found');

    await this.prisma.assetHistory.create({
      data: { hotelId, assetId: id, event: dto.lifecycleStage, notes: dto.notes, createdBy: userId },
    });

    return this.mapAsset(asset);
  }

  async listCategories(hotelId: string) {
    return this.prisma.assetCategory.findMany({
      where: { hotelId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
