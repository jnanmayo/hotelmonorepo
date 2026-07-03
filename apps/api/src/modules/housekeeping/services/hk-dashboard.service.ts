import { Injectable } from '@nestjs/common';
import { HousekeepingStatus, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { HkDashboardStats } from '@tungaos/shared';

@Injectable()
export class HkDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<HkDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalRooms,
      roomStatusCounts,
      taskStatusCounts,
      completedToday,
      avgDuration,
      staffOnDuty,
      laundryPending,
      lostFound,
      guestRequests,
      complaints,
      avgScore,
      deepCleaning,
    ] = await Promise.all([
      this.prisma.room.count({ where: { hotelId, isActive: true, deletedAt: null } }),
      this.prisma.room.groupBy({
        by: ['status'],
        where: { hotelId, isActive: true, deletedAt: null },
        _count: true,
      }),
      this.prisma.housekeepingTask.groupBy({
        by: ['status'],
        where: { hotelId, isActive: true, deletedAt: null },
        _count: true,
      }),
      this.prisma.housekeepingTask.count({
        where: {
          hotelId,
          deletedAt: null,
          status: { in: [HousekeepingStatus.COMPLETED, HousekeepingStatus.APPROVED, HousekeepingStatus.INSPECTED] },
          completedAt: { gte: today, lt: tomorrow },
        },
      }),
      this.prisma.housekeepingTask.aggregate({
        where: {
          hotelId,
          deletedAt: null,
          startedAt: { not: null },
          completedAt: { gte: today, lt: tomorrow },
        },
        _avg: { estimatedMinutes: true },
      }),
      this.prisma.staff.count({
        where: { hotelId, isActive: true, deletedAt: null, department: { contains: 'Housekeeping', mode: 'insensitive' } },
      }),
      this.prisma.laundryOrder.count({
        where: { hotelId, deletedAt: null, status: { in: ['COLLECTED', 'IN_PROCESS'] } },
      }),
      this.prisma.lostAndFoundItem.count({
        where: { hotelId, deletedAt: null, status: 'FOUND' },
      }),
      this.prisma.guestRequest.count({
        where: { hotelId, deletedAt: null, status: 'PENDING' },
      }),
      this.prisma.complaint.count({
        where: { hotelId, deletedAt: null, status: { notIn: ['RESOLVED', 'CLOSED'] } },
      }),
      this.prisma.housekeepingTask.aggregate({
        where: { hotelId, deletedAt: null, cleaningScore: { not: null } },
        _avg: { cleaningScore: true },
      }),
      this.prisma.housekeepingTask.count({
        where: { hotelId, deletedAt: null, taskType: 'deep', status: { notIn: [HousekeepingStatus.APPROVED, HousekeepingStatus.CANCELLED] } },
      }),
    ]);

    const roomMap = Object.fromEntries(roomStatusCounts.map((s) => [s.status, s._count]));
    const taskMap = Object.fromEntries(taskStatusCounts.map((s) => [s.status, s._count]));

    const dirty =
      (roomMap[RoomStatus.VACANT_DIRTY] ?? 0) + (roomMap[RoomStatus.DIRTY] ?? 0);
    const cleaning = roomMap[RoomStatus.CLEANING] ?? 0;
    const ready =
      (roomMap[RoomStatus.VACANT_CLEAN] ?? 0) + (roomMap[RoomStatus.INSPECTED] ?? 0);
    const maintenance =
      (roomMap[RoomStatus.OUT_OF_ORDER] ?? 0) +
      (roomMap[RoomStatus.UNDER_MAINTENANCE] ?? 0);

    const pendingTasks =
      (taskMap[HousekeepingStatus.PENDING] ?? 0) +
      (taskMap[HousekeepingStatus.ASSIGNED] ?? 0) +
      (taskMap[HousekeepingStatus.ACCEPTED] ?? 0) +
      (taskMap[HousekeepingStatus.IN_PROGRESS] ?? 0) +
      (taskMap[HousekeepingStatus.REOPENED] ?? 0);

    const awaitingInspection =
      (taskMap[HousekeepingStatus.COMPLETED] ?? 0) +
      (taskMap[HousekeepingStatus.INSPECTED] ?? 0);

    return {
      totalRooms,
      dirtyRooms: dirty,
      cleaningRooms: cleaning,
      readyRooms: ready,
      awaitingInspection,
      deepCleaningRooms: deepCleaning,
      maintenanceRooms: maintenance,
      pendingTasks,
      completedToday,
      averageCleaningMinutes: Math.round(avgDuration._avg.estimatedMinutes ?? 30),
      staffOnDuty,
      laundryPending,
      lostFoundItems: lostFound,
      guestRequests,
      complaints,
      cleaningScore: Math.round(avgScore._avg.cleaningScore ?? 0),
    };
  }
}
