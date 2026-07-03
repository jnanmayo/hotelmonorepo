import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, Prisma } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PmsAuditService } from '@/modules/pms/services/pms-audit.service';
import { PmsEncryptionService } from '@/modules/pms/services/pms-encryption.service';

import type { GuestProfileSchema, PmsGuestProfile } from '@tungaos/shared';

@Injectable()
export class PmsGuestService {
  constructor(
    private prisma: PrismaService,
    private audit: PmsAuditService,
    private encryption: PmsEncryptionService,
  ) {}

  async list(hotelId: string, params: { page?: number; limit?: number; search?: string; vipOnly?: boolean }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const where = {
      hotelId,
      deletedAt: null,
      isActive: true,
      ...(params.vipOnly ? { vipStatus: true } : {}),
      ...(params.search
        ? {
            OR: [
              { firstName: { contains: params.search, mode: 'insensitive' as const } },
              { lastName: { contains: params.search, mode: 'insensitive' as const } },
              { email: { contains: params.search, mode: 'insensitive' as const } },
              { phone: { contains: params.search } },
              { guestCode: { contains: params.search, mode: 'insensitive' as const } },
              { companyName: { contains: params.search, mode: 'insensitive' as const } },
              { passportNumber: { contains: params.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.guest.findMany({
        where,
        orderBy: { lastName: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.guest.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProfile(hotelId: string, guestId: string): Promise<PmsGuestProfile> {
    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, hotelId, deletedAt: null },
      include: {
        documents: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        reservations: {
          where: { deletedAt: null },
          include: { room: true },
          orderBy: { checkInDate: 'desc' },
          take: 20,
        },
      },
    });
    if (!guest) throw new NotFoundException('Guest not found');

    const previousRooms = [
      ...new Set(
        guest.reservations.map((r) => r.room?.roomNumber).filter((n): n is string => !!n),
      ),
    ];

    return {
      id: guest.id,
      guestCode: guest.guestCode,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      nationality: guest.nationality,
      photoUrl: guest.photoUrl,
      companyName: guest.companyName,
      gstNumber: guest.gstNumber,
      vipStatus: guest.vipStatus,
      isCorporate: guest.isCorporate,
      isBlacklisted: guest.isBlacklisted,
      membershipTier: guest.membershipTier,
      preferences: guest.preferences as Record<string, unknown> | null,
      foodPreferences: guest.foodPreferences as Record<string, unknown> | null,
      previousStays: guest.reservations.length,
      previousRooms,
      documents: guest.documents.map((d) => ({
        id: d.id,
        docType: d.docType,
        docNumber: d.docNumber,
        expiryDate: d.expiryDate?.toISOString().split('T')[0] ?? null,
        createdAt: d.createdAt.toISOString(),
      })),
      reservations: guest.reservations.map((r) => ({
        id: r.id,
        reservationCode: r.reservationCode,
        status: r.status,
        checkInDate: r.checkInDate.toISOString().split('T')[0]!,
        checkOutDate: r.checkOutDate.toISOString().split('T')[0]!,
        roomNumber: r.room?.roomNumber ?? null,
        totalAmount: Number(r.totalAmount),
      })),
    };
  }

  async create(hotelId: string, data: GuestProfileSchema, userId?: string) {
    const count = await this.prisma.guest.count({ where: { hotelId } });
    const aadhaarHash = data.passportNumber
      ? undefined
      : undefined;

    const guest = await this.prisma.guest.create({
      data: {
        hotelId,
        guestCode: `GST-${String(count + 1).padStart(5, '0')}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        nationality: data.nationality ?? undefined,
        companyName: data.companyName ?? undefined,
        gstNumber: data.gstNumber ?? undefined,
        passportNumber: data.passportNumber ?? undefined,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        anniversary: data.anniversary ? new Date(data.anniversary) : undefined,
        vipStatus: data.vipStatus ?? false,
        isCorporate: data.isCorporate ?? false,
        isBlacklisted: data.isBlacklisted ?? false,
        blacklistReason: data.blacklistReason ?? undefined,
        membershipTier: data.membershipTier ?? undefined,
        foodPreferences: data.foodPreferences as Prisma.InputJsonValue | undefined,
        preferences: data.preferences as Prisma.InputJsonValue | undefined,
        notes: data.notes ?? undefined,
        aadhaarHash,
        createdBy: userId,
      },
    });

    await this.audit.log({
      hotelId,
      userId,
      action: AuditAction.CREATE,
      entityType: 'Guest',
      entityId: guest.id,
    });

    return guest;
  }

  async update(hotelId: string, guestId: string, data: Partial<GuestProfileSchema>, userId?: string) {
    const existing = await this.prisma.guest.findFirst({
      where: { id: guestId, hotelId, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Guest not found');

    const guest = await this.prisma.guest.update({
      where: { id: guestId },
      data: {
        ...(data.firstName ? { firstName: data.firstName } : {}),
        ...(data.lastName ? { lastName: data.lastName } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.nationality !== undefined ? { nationality: data.nationality } : {}),
        ...(data.companyName !== undefined ? { companyName: data.companyName } : {}),
        ...(data.gstNumber !== undefined ? { gstNumber: data.gstNumber } : {}),
        ...(data.passportNumber !== undefined ? { passportNumber: data.passportNumber } : {}),
        ...(data.vipStatus !== undefined ? { vipStatus: data.vipStatus } : {}),
        ...(data.isCorporate !== undefined ? { isCorporate: data.isCorporate } : {}),
        ...(data.isBlacklisted !== undefined ? { isBlacklisted: data.isBlacklisted } : {}),
        ...(data.blacklistReason !== undefined ? { blacklistReason: data.blacklistReason } : {}),
        ...(data.membershipTier !== undefined ? { membershipTier: data.membershipTier } : {}),
        ...(data.foodPreferences !== undefined
          ? { foodPreferences: data.foodPreferences as Prisma.InputJsonValue }
          : {}),
        ...(data.preferences !== undefined ? { preferences: data.preferences as Prisma.InputJsonValue } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        updatedBy: userId,
      },
    });

    await this.audit.log({
      hotelId,
      userId,
      action: AuditAction.UPDATE,
      entityType: 'Guest',
      entityId: guestId,
      oldValues: { vipStatus: existing.vipStatus },
      newValues: { vipStatus: guest.vipStatus },
    });

    return guest;
  }

  async storeAadhaar(hotelId: string, guestId: string, aadhaarNumber: string, userId?: string) {
    const hash = this.encryption.hashSensitive(aadhaarNumber);
    await this.prisma.guest.update({
      where: { id: guestId },
      data: { aadhaarHash: hash, updatedBy: userId },
    });
    return { stored: true };
  }
}
