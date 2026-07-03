import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AssetStatus,
  MaintenancePriority,
  MaintenanceStatus,
  WorkOrderStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { MaintenanceRealtimeGateway } from '@/modules/maintenance/gateways/maintenance-realtime.gateway';

import type {
  AssignWorkOrderSchema,
  CreateMaintenanceRequestSchema,
  CreateWorkOrderSchema,
  UpdateWorkOrderStatusSchema,
} from '@tungaos/shared';
import type { EamMaintenanceRequestItem, EamWorkOrderItem } from '@tungaos/shared';

const SLA_HOURS: Record<MaintenancePriority, number> = {
  EMERGENCY: 1,
  CRITICAL: 4,
  HIGH: 8,
  MEDIUM: 24,
  LOW: 72,
};

@Injectable()
export class EamWorkflowService {
  constructor(
    private prisma: PrismaService,
    private realtime: MaintenanceRealtimeGateway,
  ) {}

  private nextNumber(prefix: string, seq: number) {
    return `${prefix}-${String(seq).padStart(5, '0')}`;
  }

  private mapRequest(r: {
    id: string;
    requestNumber: string;
    title: string;
    category: string | null;
    source: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    slaDueAt: Date | null;
    reportedAt: Date;
    room?: { roomNumber: string } | null;
    asset?: { name: string } | null;
  }): EamMaintenanceRequestItem {
    return {
      id: r.id,
      requestNumber: r.requestNumber,
      title: r.title,
      category: r.category,
      source: r.source,
      priority: r.priority as EamMaintenanceRequestItem['priority'],
      status: r.status,
      roomNumber: r.room?.roomNumber ?? null,
      assetName: r.asset?.name ?? null,
      slaDueAt: r.slaDueAt?.toISOString() ?? null,
      reportedAt: r.reportedAt.toISOString(),
    };
  }

  private mapWorkOrder(w: {
    id: string;
    workOrderNumber: string;
    department: string | null;
    priority: MaintenancePriority;
    issue: string;
    status: WorkOrderStatus;
    estimatedMinutes: number | null;
    laborCost: { toNumber(): number };
    partsCost: { toNumber(): number };
    startedAt: Date | null;
    completedAt: Date | null;
    isPreventive: boolean;
    createdAt: Date;
    asset?: { name: string } | null;
    room?: { roomNumber: string } | null;
    assignedStaff?: { user: { firstName: string | null; lastName: string | null } } | null;
  }): EamWorkOrderItem {
    const staff = w.assignedStaff?.user;
    const assignedTo = staff ? [staff.firstName, staff.lastName].filter(Boolean).join(' ') || null : null;
    return {
      id: w.id,
      workOrderNumber: w.workOrderNumber,
      assetName: w.asset?.name ?? null,
      roomNumber: w.room?.roomNumber ?? null,
      department: w.department,
      priority: w.priority as EamWorkOrderItem['priority'],
      issue: w.issue,
      status: w.status as EamWorkOrderItem['status'],
      assignedTo,
      estimatedMinutes: w.estimatedMinutes,
      laborCost: Number(w.laborCost),
      partsCost: Number(w.partsCost),
      startedAt: w.startedAt?.toISOString() ?? null,
      completedAt: w.completedAt?.toISOString() ?? null,
      isPreventive: w.isPreventive,
      createdAt: w.createdAt.toISOString(),
    };
  }

  async listRequests(hotelId: string): Promise<EamMaintenanceRequestItem[]> {
    const rows = await this.prisma.maintenanceRequest.findMany({
      where: { hotelId, deletedAt: null },
      include: { room: true, asset: true },
      orderBy: { reportedAt: 'desc' },
      take: 100,
    });
    return rows.map((r) => this.mapRequest(r));
  }

  async createRequest(hotelId: string, dto: CreateMaintenanceRequestSchema, userId?: string) {
    const count = await this.prisma.maintenanceRequest.count({ where: { hotelId } });
    const slaHours = SLA_HOURS[dto.priority as MaintenancePriority] ?? 24;
    const slaDueAt = new Date(Date.now() + slaHours * 3600 * 1000);

    const req = await this.prisma.maintenanceRequest.create({
      data: {
        hotelId,
        requestNumber: this.nextNumber('MR', count + 1),
        title: dto.title,
        description: dto.description,
        category: dto.category,
        source: dto.source,
        issueCategory: dto.issueCategory,
        priority: dto.priority,
        roomId: dto.roomId,
        assetId: dto.assetId,
        location: dto.location,
        remarks: dto.remarks,
        photos: dto.photos,
        slaDueAt,
        createdBy: userId,
      },
      include: { room: true, asset: true },
    });

    this.realtime.emitRequestUpdate(hotelId, req.id);
    this.realtime.notifyDashboard(hotelId);
    return this.mapRequest(req);
  }

  async reviewRequest(hotelId: string, id: string, userId?: string) {
    const req = await this.prisma.maintenanceRequest.update({
      where: { id },
      data: { status: MaintenanceStatus.ASSIGNED, reviewedBy: userId, reviewedAt: new Date() },
      include: { room: true, asset: true },
    });
    if (req.hotelId !== hotelId) throw new NotFoundException('Request not found');
    this.realtime.emitRequestUpdate(hotelId, id);
    return this.mapRequest(req);
  }

  async listWorkOrders(hotelId: string, status?: string): Promise<EamWorkOrderItem[]> {
    const rows = await this.prisma.workOrder.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(status ? { status: status as WorkOrderStatus } : {}),
      },
      include: {
        asset: true,
        room: true,
        assignedStaff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return rows.map((w) => this.mapWorkOrder(w));
  }

  async createWorkOrder(hotelId: string, dto: CreateWorkOrderSchema, userId?: string) {
    const count = await this.prisma.workOrder.count({ where: { hotelId } });
    const wo = await this.prisma.workOrder.create({
      data: {
        hotelId,
        workOrderNumber: this.nextNumber('WO', count + 1),
        maintenanceRequestId: dto.maintenanceRequestId,
        assetId: dto.assetId,
        roomId: dto.roomId,
        department: dto.department,
        priority: dto.priority,
        issue: dto.issue,
        description: dto.description,
        assignedStaffId: dto.assignedStaffId,
        estimatedMinutes: dto.estimatedMinutes,
        isPreventive: dto.isPreventive,
        pmPlanId: dto.pmPlanId,
        status: dto.assignedStaffId ? WorkOrderStatus.ASSIGNED : WorkOrderStatus.NEW,
        createdBy: userId,
      },
      include: {
        asset: true,
        room: true,
        assignedStaff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (dto.maintenanceRequestId) {
      await this.prisma.maintenanceRequest.update({
        where: { id: dto.maintenanceRequestId },
        data: { status: MaintenanceStatus.IN_PROGRESS },
      });
    }

    if (dto.assetId) {
      await this.prisma.asset.update({
        where: { id: dto.assetId },
        data: { status: AssetStatus.IN_MAINTENANCE },
      });
    }

    await this.prisma.maintenanceLog.create({
      data: { hotelId, workOrderId: wo.id, assetId: dto.assetId, action: 'WORK_ORDER_CREATED', createdBy: userId },
    });

    this.realtime.emitWorkOrderUpdate(hotelId, wo.id);
    this.realtime.notifyDashboard(hotelId);
    return this.mapWorkOrder(wo);
  }

  async assignWorkOrder(hotelId: string, id: string, dto: AssignWorkOrderSchema, userId?: string) {
    const wo = await this.prisma.workOrder.update({
      where: { id },
      data: {
        assignedStaffId: dto.assignedStaffId,
        estimatedMinutes: dto.estimatedMinutes,
        status: WorkOrderStatus.ASSIGNED,
        updatedBy: userId,
      },
      include: {
        asset: true,
        room: true,
        assignedStaff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });
    if (wo.hotelId !== hotelId) throw new NotFoundException('Work order not found');
    this.realtime.emitWorkOrderUpdate(hotelId, id);
    return this.mapWorkOrder(wo);
  }

  async updateWorkOrderStatus(hotelId: string, id: string, dto: UpdateWorkOrderStatusSchema, userId?: string) {
    const existing = await this.prisma.workOrder.findFirst({ where: { id, hotelId } });
    if (!existing) throw new NotFoundException('Work order not found');

    const now = new Date();
    const data: Record<string, unknown> = { status: dto.status, updatedBy: userId };

    if (dto.status === WorkOrderStatus.IN_PROGRESS && !existing.startedAt) data.startedAt = now;
    if (
      dto.status === WorkOrderStatus.COMPLETED ||
      dto.status === WorkOrderStatus.INSPECTED ||
      dto.status === WorkOrderStatus.CLOSED
    ) {
      data.completedAt = now;
    }

    const wo = await this.prisma.workOrder.update({
      where: { id },
      data,
      include: {
        asset: true,
        room: true,
        assignedStaff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (dto.status === WorkOrderStatus.CLOSED && wo.assetId) {
      await this.prisma.asset.update({
        where: { id: wo.assetId },
        data: { status: AssetStatus.ACTIVE },
      });
    }

    await this.prisma.maintenanceLog.create({
      data: { hotelId, workOrderId: id, assetId: wo.assetId, action: `STATUS_${dto.status}`, details: dto.resolutionNotes, createdBy: userId },
    });

    this.realtime.emitWorkOrderUpdate(hotelId, id);
    this.realtime.notifyDashboard(hotelId);
    return this.mapWorkOrder(wo);
  }

  async createWorkOrderFromRequest(hotelId: string, requestId: string, userId?: string) {
    const req = await this.prisma.maintenanceRequest.findFirst({
      where: { id: requestId, hotelId },
      include: { asset: true, room: true },
    });
    if (!req) throw new NotFoundException('Request not found');

    return this.createWorkOrder(
      hotelId,
      {
        maintenanceRequestId: req.id,
        assetId: req.assetId ?? undefined,
        roomId: req.roomId ?? undefined,
        priority: req.priority as CreateWorkOrderSchema['priority'],
        issue: req.title,
        description: req.description ?? undefined,
        isPreventive: false,
        assignedStaffId: req.assignedStaffId ?? undefined,
      },
      userId,
    );
  }
}
