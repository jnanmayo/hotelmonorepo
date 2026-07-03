import { Injectable, NotFoundException } from '@nestjs/common';
import { VendorStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { ProcurementRealtimeGateway } from '@/modules/procurement/gateways/procurement-realtime.gateway';

import type { CreateVendorSchema } from '@tungaos/shared';

const DEFAULT_CATEGORIES = [
  { name: 'Food Suppliers', code: 'FOOD' },
  { name: 'Vegetable Suppliers', code: 'VEG' },
  { name: 'Milk Suppliers', code: 'MILK' },
  { name: 'Meat Suppliers', code: 'MEAT' },
  { name: 'Seafood Suppliers', code: 'SEAFOOD' },
  { name: 'Laundry Vendors', code: 'LAUNDRY' },
  { name: 'Cleaning Vendors', code: 'CLEAN' },
  { name: 'Electrical Vendors', code: 'ELEC' },
  { name: 'Furniture Vendors', code: 'FURN' },
  { name: 'Stationery Vendors', code: 'STAT' },
  { name: 'Maintenance Vendors', code: 'MAINT' },
  { name: 'IT Vendors', code: 'IT' },
  { name: 'Spa Vendors', code: 'SPA' },
  { name: 'General Vendors', code: 'GEN' },
];

@Injectable()
export class ProcVendorService {
  constructor(
    private prisma: PrismaService,
    private realtime: ProcurementRealtimeGateway,
  ) {}

  async seedCategories(hotelId: string) {
    const existing = await this.prisma.vendorCategory.count({ where: { hotelId } });
    if (existing > 0) return { seeded: false };
    for (const c of DEFAULT_CATEGORIES) {
      await this.prisma.vendorCategory.create({ data: { hotelId, ...c } });
    }
    return { seeded: true };
  }

  async list(hotelId: string, search?: string) {
    const vendors = await this.prisma.vendor.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }] } : {}),
      },
      include: { vendorCategory: { select: { name: true } } },
      orderBy: { name: 'asc' },
      take: 200,
    });
    return vendors.map((v) => ({
      id: v.id,
      code: v.code,
      name: v.name,
      companyName: v.companyName,
      categoryName: v.vendorCategory?.name ?? v.category,
      email: v.email,
      phone: v.phone,
      gstNumber: v.gstNumber,
      paymentTerms: v.paymentTerms,
      rating: Number(v.rating),
      leadTimeDays: v.leadTimeDays,
      isBlacklisted: v.isBlacklisted,
      vendorStatus: v.vendorStatus,
    }));
  }

  async create(hotelId: string, dto: CreateVendorSchema, userId?: string) {
    const vendor = await this.prisma.vendor.create({
      data: {
        hotelId,
        name: dto.name,
        code: dto.code,
        companyName: dto.companyName ?? dto.name,
        categoryId: dto.categoryId,
        email: dto.email,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        address: dto.address,
        gstNumber: dto.gstNumber,
        panNumber: dto.panNumber,
        msmeNumber: dto.msmeNumber,
        productsSupplied: dto.productsSupplied,
        paymentTerms: dto.paymentTerms,
        creditLimit: dto.creditLimit,
        leadTimeDays: dto.leadTimeDays,
        vendorStatus: VendorStatus.ACTIVE,
        createdBy: userId,
      },
    });

    await this.prisma.supplier.upsert({
      where: { hotelId_code: { hotelId, code: dto.code } },
      create: { hotelId, name: dto.name, code: dto.code, email: dto.email, phone: dto.phone, address: dto.address, gstNumber: dto.gstNumber, createdBy: userId },
      update: { name: dto.name, email: dto.email, phone: dto.phone },
    });

    this.realtime.notifyDashboard(hotelId);
    return vendor;
  }

  async get(hotelId: string, id: string) {
    const vendor = await this.prisma.vendor.findFirst({
      where: { id, hotelId, deletedAt: null },
      include: { vendorCategory: true, contacts: true, ratings: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async listCategories(hotelId: string) {
    return this.prisma.vendorCategory.findMany({ where: { hotelId, isActive: true }, orderBy: { name: 'asc' } });
  }
}
