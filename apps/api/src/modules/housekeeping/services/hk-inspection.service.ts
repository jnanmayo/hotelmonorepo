import { Injectable, NotFoundException } from '@nestjs/common';
import { HousekeepingStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { HousekeepingRealtimeGateway } from '@/modules/housekeeping/gateways/housekeeping-realtime.gateway';
import { HkTaskService } from '@/modules/housekeeping/services/hk-task.service';

import type { HkInspectionSchema } from '@tungaos/shared';

@Injectable()
export class HkInspectionService {
  constructor(
    private prisma: PrismaService,
    private tasks: HkTaskService,
    private realtime: HousekeepingRealtimeGateway,
  ) {}

  async list(hotelId: string) {
    const items = await this.prisma.housekeepingInspection.findMany({
      where: { hotelId },
      orderBy: { inspectedAt: 'desc' },
      take: 100,
    });

    const roomIds = [...new Set(items.map((i) => i.roomId))];
    const rooms = await this.prisma.room.findMany({
      where: { id: { in: roomIds } },
      select: { id: true, roomNumber: true },
    });
    const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.roomNumber]));

    return items.map((i) => ({
      id: i.id,
      taskId: i.taskId,
      roomNumber: roomMap[i.roomId] ?? '—',
      qualityScore: i.qualityScore,
      status: i.status,
      remarks: i.remarks,
      inspectedAt: i.inspectedAt.toISOString(),
    }));
  }

  async inspect(hotelId: string, input: HkInspectionSchema, userId?: string) {
    const task = await this.prisma.housekeepingTask.findFirst({
      where: { id: input.taskId, hotelId, deletedAt: null },
    });
    if (!task) throw new NotFoundException('Task not found');

    const inspection = await this.prisma.housekeepingInspection.create({
      data: {
        hotelId,
        taskId: input.taskId,
        roomId: task.roomId,
        supervisorId: userId,
        qualityScore: input.qualityScore,
        status: input.status,
        remarks: input.remarks,
        checklist: input.checklist ?? [],
      },
    });

    await this.prisma.housekeepingTask.update({
      where: { id: input.taskId },
      data: { cleaningScore: input.qualityScore, supervisorId: userId },
    });

    if (input.status === 'APPROVED') {
      await this.tasks.updateStatus(hotelId, input.taskId, { status: 'APPROVED', remarks: input.remarks }, userId);
    } else {
      await this.tasks.updateStatus(hotelId, input.taskId, { status: 'REJECTED', remarks: input.remarks }, userId);
    }

    this.realtime.notifyDashboard(hotelId);
    return inspection;
  }
}
