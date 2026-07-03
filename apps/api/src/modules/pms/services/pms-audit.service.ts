import { Injectable } from '@nestjs/common';
import { AuditAction, Prisma } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

@Injectable()
export class PmsAuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    hotelId: string;
    userId?: string;
    action: AuditAction;
    entityType: string;
    entityId?: string;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    await this.prisma.auditLog.create({
      data: {
        hotelId: params.hotelId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: (params.oldValues ?? undefined) as Prisma.InputJsonValue | undefined,
        newValues: (params.newValues ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: params.ipAddress,
        createdBy: params.userId,
      },
    });
  }

  async activity(params: {
    hotelId: string;
    userId?: string;
    action: string;
    description?: string;
    module?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.activityLog.create({
      data: {
        hotelId: params.hotelId,
        userId: params.userId,
        action: params.action,
        description: params.description,
        module: params.module ?? 'pms',
        metadata: (params.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        createdBy: params.userId,
      },
    });
  }
}
