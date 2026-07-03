import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HousekeepingStatus, MaintenancePriority, RoomStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { HousekeepingRealtimeGateway } from '@/modules/housekeeping/gateways/housekeeping-realtime.gateway';
import { CLEANING_TYPE_ESTIMATES, DEFAULT_CHECKLIST_ITEMS } from '@/modules/housekeeping/housekeeping.constants';
import { HkDashboardService } from '@/modules/housekeeping/services/hk-dashboard.service';
import { PmsHousekeepingIntegrationService } from '@/modules/pms/services/pms-checkin.service';
import { PmsRealtimeGateway } from '@/modules/pms/gateways/pms-realtime.gateway';
import { PmsRoomService } from '@/modules/pms/services/pms-room.service';

import type {
  AssignHkTaskSchema,
  CreateHkTaskSchema,
  HkRealtimeEvent,
  HkStaffSummary,
  HkTaskItem,
  UpdateHkTaskStatusSchema,
} from '@tungaos/shared';

@Injectable()
export class HkTaskService {
  constructor(
    private prisma: PrismaService,
    private hkIntegration: PmsHousekeepingIntegrationService,
    private pmsRooms: PmsRoomService,
    private pmsRealtime: PmsRealtimeGateway,
    private hkRealtime: HousekeepingRealtimeGateway,
    private dashboard: HkDashboardService,
  ) {}

  async listTasks(hotelId: string, filters?: { status?: HousekeepingStatus; staffId?: string; roomId?: string }) {
    const tasks = await this.prisma.housekeepingTask.findMany({
      where: {
        hotelId,
        isActive: true,
        deletedAt: null,
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.staffId ? { assignedStaffId: filters.staffId } : {}),
        ...(filters?.roomId ? { roomId: filters.roomId } : {}),
      },
      include: {
        room: { include: { floor: { include: { building: true } } } },
        assignedStaff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      take: 200,
    });

    return tasks.map((t) => this.mapTask(t));
  }

  async getTask(hotelId: string, taskId: string) {
    const task = await this.prisma.housekeepingTask.findFirst({
      where: { id: taskId, hotelId, deletedAt: null },
      include: {
        room: { include: { floor: { include: { building: true } } } },
        assignedStaff: { include: { user: { select: { firstName: true, lastName: true } } } },
        checklistItems: { where: { isActive: true, deletedAt: null }, orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return { ...this.mapTask(task), checklist: task.checklistItems };
  }

  async createTask(hotelId: string, input: CreateHkTaskSchema, userId?: string) {
    const room = await this.prisma.room.findFirst({ where: { id: input.roomId, hotelId, deletedAt: null } });
    if (!room) throw new NotFoundException('Room not found');

    const estimate = input.estimatedMinutes ?? CLEANING_TYPE_ESTIMATES[input.taskType] ?? 30;

    const task = await this.prisma.housekeepingTask.create({
      data: {
        hotelId,
        roomId: input.roomId,
        taskType: input.taskType,
        priority: (input.priority ?? 'MEDIUM') as MaintenancePriority,
        status: input.assignedStaffId ? HousekeepingStatus.ASSIGNED : HousekeepingStatus.PENDING,
        assignedStaffId: input.assignedStaffId,
        estimatedMinutes: estimate,
        notes: input.notes,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        createdBy: userId,
      },
    });

    await this.seedChecklist(hotelId, task.id, userId);
    await this.pmsRooms.updateStatus(hotelId, input.roomId, RoomStatus.VACANT_DIRTY, `Cleaning task: ${input.taskType}`, userId);

    this.notify(hotelId, 'task:created', { taskId: task.id, roomId: input.roomId });
    return this.getTask(hotelId, task.id);
  }

  async assignTask(hotelId: string, taskId: string, input: AssignHkTaskSchema, userId?: string) {
    const task = await this.requireTask(hotelId, taskId);
    await this.prisma.housekeepingTask.update({
      where: { id: taskId },
      data: { assignedStaffId: input.staffId, status: HousekeepingStatus.ASSIGNED, updatedBy: userId },
    });
    await this.pmsRooms.updateStatus(hotelId, task.roomId, RoomStatus.CLEANING, 'Staff assigned', userId);
    this.notify(hotelId, 'task:updated', { taskId, status: 'ASSIGNED' });
    return this.getTask(hotelId, taskId);
  }

  async autoAssign(hotelId: string, taskId: string, userId?: string) {
    await this.requireTask(hotelId, taskId);

    const staff = await this.prisma.staff.findMany({
      where: {
        hotelId,
        isActive: true,
        deletedAt: null,
        department: { contains: 'Housekeeping', mode: 'insensitive' },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        housekeepingTasks: {
          where: { status: { in: [HousekeepingStatus.ASSIGNED, HousekeepingStatus.IN_PROGRESS, HousekeepingStatus.ACCEPTED] }, deletedAt: null },
        },
      },
    });

    if (!staff.length) throw new BadRequestException('No housekeeping staff available');

    staff.sort((a, b) => a.housekeepingTasks.length - b.housekeepingTasks.length);
    const best = staff[0]!;
    return this.assignTask(hotelId, taskId, { staffId: best.id }, userId);
  }

  async updateStatus(hotelId: string, taskId: string, input: UpdateHkTaskStatusSchema, userId?: string) {
    const task = await this.requireTask(hotelId, taskId);
    const now = new Date();
    const data: Record<string, unknown> = { status: input.status, updatedBy: userId };

    if (input.status === HousekeepingStatus.ACCEPTED) {
      data.status = HousekeepingStatus.ACCEPTED;
    }
    if (input.status === HousekeepingStatus.IN_PROGRESS) {
      data.startedAt = task.startedAt ?? now;
      await this.pmsRooms.updateStatus(hotelId, task.roomId, RoomStatus.CLEANING, 'Cleaning in progress', userId);
    }
    if (input.status === HousekeepingStatus.COMPLETED) {
      data.completedAt = now;
      this.notify(hotelId, 'task:completed', { taskId, roomId: task.roomId });
      this.notify(hotelId, 'inspection:pending', { taskId, roomId: task.roomId });
    }
    if (input.status === HousekeepingStatus.APPROVED) {
      data.cleaningScore = task.cleaningScore ?? 85;
      await this.hkIntegration.onCleaningComplete(hotelId, task.roomId, userId);
      this.pmsRealtime.emitRoomStatus(hotelId, task.roomId, RoomStatus.VACANT_CLEAN);
      this.notify(hotelId, 'room:ready', { taskId, roomId: task.roomId });
      this.notify(hotelId, 'inspection:approved', { taskId });
    }
    if (input.status === HousekeepingStatus.REJECTED || input.status === HousekeepingStatus.FAILED) {
      data.status = HousekeepingStatus.REOPENED;
      data.inspectionRemarks = input.remarks;
      await this.pmsRooms.updateStatus(hotelId, task.roomId, RoomStatus.VACANT_DIRTY, input.remarks ?? 'Inspection failed', userId);
      this.notify(hotelId, 'inspection:rejected', { taskId });
    }
    if (input.remarks) data.inspectionRemarks = input.remarks;

    await this.prisma.housekeepingTask.update({ where: { id: taskId }, data });
    this.notify(hotelId, 'task:updated', { taskId, status: input.status });
    return this.getTask(hotelId, taskId);
  }

  async listStaff(hotelId: string): Promise<HkStaffSummary[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const staff = await this.prisma.staff.findMany({
      where: { hotelId, isActive: true, deletedAt: null, department: { contains: 'Housekeeping', mode: 'insensitive' } },
      include: {
        user: { select: { firstName: true, lastName: true } },
        housekeepingTasks: { where: { deletedAt: null } },
      },
    });

    return staff.map((s) => {
      const active = s.housekeepingTasks.filter((t) =>
        ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'PAUSED'].includes(t.status),
      ).length;
      const completedToday = s.housekeepingTasks.filter(
        (t) => t.completedAt && t.completedAt >= today,
      ).length;
      const scores = s.housekeepingTasks.filter((t) => t.cleaningScore).map((t) => t.cleaningScore!);
      const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 80;

      return {
        id: s.id,
        employeeCode: s.employeeCode,
        name: `${s.user.firstName} ${s.user.lastName}`,
        department: s.department,
        designation: s.designation,
        activeTasks: active,
        completedToday,
        averageCleaningMinutes: 30,
        performanceScore: Math.round(avgScore),
      };
    });
  }

  private async seedChecklist(hotelId: string, taskId: string, userId?: string) {
    let checklist = await this.prisma.cleaningChecklist.findFirst({
      where: { hotelId, isActive: true, deletedAt: null },
    });

    if (!checklist) {
      checklist = await this.prisma.cleaningChecklist.create({
        data: { hotelId, name: 'Standard Room Checklist', createdBy: userId },
      });
      await this.prisma.cleaningChecklistItem.createMany({
        data: DEFAULT_CHECKLIST_ITEMS.map((itemName, i) => ({
          hotelId,
          checklistId: checklist!.id,
          itemName,
          sortOrder: i,
          createdBy: userId,
        })),
      });
    }

    const templateItems = await this.prisma.cleaningChecklistItem.findMany({
      where: { checklistId: checklist.id, taskId: null, isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });

    if (templateItems.length) {
      await this.prisma.cleaningChecklistItem.createMany({
        data: templateItems.map((item) => ({
          hotelId,
          checklistId: checklist!.id,
          taskId,
          itemName: item.itemName,
          sortOrder: item.sortOrder,
          createdBy: userId,
        })),
      });
    } else {
      await this.prisma.cleaningChecklistItem.createMany({
        data: DEFAULT_CHECKLIST_ITEMS.map((itemName, i) => ({
          hotelId,
          checklistId: checklist!.id,
          taskId,
          itemName,
          sortOrder: i,
          createdBy: userId,
        })),
      });
    }
  }

  private async requireTask(hotelId: string, taskId: string) {
    const task = await this.prisma.housekeepingTask.findFirst({ where: { id: taskId, hotelId, deletedAt: null } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  private mapTask(t: {
    id: string;
    roomId: string;
    status: HousekeepingStatus;
    taskType: string;
    priority: string;
    assignedStaffId: string | null;
    estimatedMinutes: number | null;
    startedAt: Date | null;
    completedAt: Date | null;
    notes: string | null;
    cleaningScore: number | null;
    createdAt: Date;
    room: { roomNumber: string; floor: { floorNumber: number; building: { name: string } } };
    assignedStaff?: { user: { firstName: string; lastName: string } } | null;
  }): HkTaskItem {
    return {
      id: t.id,
      roomId: t.roomId,
      roomNumber: t.room.roomNumber,
      floorNumber: t.room.floor.floorNumber,
      buildingName: t.room.floor.building.name,
      status: t.status,
      taskType: t.taskType,
      priority: t.priority,
      assignedStaffId: t.assignedStaffId,
      assignedStaffName: t.assignedStaff ? `${t.assignedStaff.user.firstName} ${t.assignedStaff.user.lastName}` : null,
      estimatedMinutes: t.estimatedMinutes,
      startedAt: t.startedAt?.toISOString() ?? null,
      completedAt: t.completedAt?.toISOString() ?? null,
      notes: t.notes,
      cleaningScore: t.cleaningScore,
      createdAt: t.createdAt.toISOString(),
    };
  }

  private notify(hotelId: string, type: HkRealtimeEvent['type'], payload: Record<string, unknown>) {
    this.hkRealtime.emit(hotelId, { type, hotelId, payload, timestamp: new Date().toISOString() });
    this.hkRealtime.notifyDashboard(hotelId);
    this.pmsRealtime.emitDashboardUpdate(hotelId);
  }
}
