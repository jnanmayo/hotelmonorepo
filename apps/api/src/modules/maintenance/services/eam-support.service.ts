import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { InvOperationsService } from '@/modules/inventory/services/inv-operations.service';
import { MaintenanceRealtimeGateway } from '@/modules/maintenance/gateways/maintenance-realtime.gateway';

import type {
  AddWorkOrderPartSchema,
  CreateAmcContractSchema,
  CreateEnergyReadingSchema,
  CreateEamInspectionSchema,
  CreatePmPlanSchema,
  CreateWarrantyClaimSchema,
} from '@tungaos/shared';
import type {
  EamAmcContractItem,
  EamAnalyticsData,
  EamEnergyStats,
  EamInspectionItem,
  EamOwnerDashboardStats,
  EamPmPlanItem,
  EamSafetyItem,
  EamTechnicianItem,
  EamWarrantyClaimItem,
} from '@tungaos/shared';

@Injectable()
export class EamSupportService {
  constructor(
    private prisma: PrismaService,
    private inventoryOps: InvOperationsService,
    private realtime: MaintenanceRealtimeGateway,
  ) {}

  async listPmPlans(hotelId: string): Promise<EamPmPlanItem[]> {
    const rows = await this.prisma.preventiveMaintenancePlan.findMany({
      where: { hotelId },
      include: { asset: true },
      orderBy: { nextDueAt: 'asc' },
    });
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      assetName: p.asset.name,
      frequency: p.frequency as EamPmPlanItem['frequency'],
      nextDueAt: p.nextDueAt?.toISOString() ?? null,
      lastRunAt: p.lastRunAt?.toISOString() ?? null,
      isActive: p.isActive,
    }));
  }

  async createPmPlan(hotelId: string, dto: CreatePmPlanSchema) {
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 30);
    return this.prisma.preventiveMaintenancePlan.create({
      data: {
        hotelId,
        assetId: dto.assetId,
        name: dto.name,
        frequency: dto.frequency,
        meterThreshold: dto.meterThreshold,
        estimatedMinutes: dto.estimatedMinutes,
        checklist: dto.checklist as object | undefined,
        nextDueAt: nextDue,
      },
      include: { asset: true },
    });
  }

  async generatePmWorkOrders(hotelId: string, userId?: string) {
    const due = await this.prisma.preventiveMaintenancePlan.findMany({
      where: { hotelId, isActive: true, nextDueAt: { lte: new Date() } },
      include: { asset: true },
    });

    let created = 0;
    for (const plan of due) {
      const count = await this.prisma.workOrder.count({ where: { hotelId } });
      await this.prisma.workOrder.create({
        data: {
          hotelId,
          workOrderNumber: `WO-${String(count + 1).padStart(5, '0')}`,
          assetId: plan.assetId,
          issue: `Preventive: ${plan.name}`,
          priority: 'MEDIUM',
          isPreventive: true,
          pmPlanId: plan.id,
          estimatedMinutes: plan.estimatedMinutes,
          status: WorkOrderStatus.NEW,
          createdBy: userId,
        },
      });
      const next = new Date();
      next.setDate(next.getDate() + 30);
      await this.prisma.preventiveMaintenancePlan.update({
        where: { id: plan.id },
        data: { lastRunAt: new Date(), nextDueAt: next },
      });
      created++;
    }

    this.realtime.notifyDashboard(hotelId);
    return { created };
  }

  async listAmcContracts(hotelId: string): Promise<EamAmcContractItem[]> {
    const rows = await this.prisma.assetAmcContract.findMany({
      where: { hotelId },
      include: { asset: true },
      orderBy: { endDate: 'asc' },
    });
    return rows.map((c) => ({
      id: c.id,
      contractNumber: c.contractNumber,
      vendorName: c.vendorName,
      assetName: c.asset?.name ?? null,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      cost: Number(c.cost),
      status: c.status,
      slaHours: c.slaHours,
    }));
  }

  async createAmcContract(hotelId: string, dto: CreateAmcContractSchema) {
    return this.prisma.assetAmcContract.create({
      data: {
        hotelId,
        assetId: dto.assetId,
        contractNumber: dto.contractNumber,
        vendorName: dto.vendorName,
        coverage: dto.coverage,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        serviceVisits: dto.serviceVisits,
        slaHours: dto.slaHours,
        cost: dto.cost,
      },
    });
  }

  async listWarrantyClaims(hotelId: string): Promise<EamWarrantyClaimItem[]> {
    const rows = await this.prisma.assetWarrantyClaim.findMany({
      where: { hotelId },
      include: { asset: true },
      orderBy: { claimDate: 'desc' },
    });
    return rows.map((c) => ({
      id: c.id,
      claimNumber: c.claimNumber,
      assetName: c.asset.name,
      status: c.status,
      claimDate: c.claimDate.toISOString(),
      cost: Number(c.cost),
    }));
  }

  async createWarrantyClaim(hotelId: string, dto: CreateWarrantyClaimSchema) {
    const count = await this.prisma.assetWarrantyClaim.count({ where: { hotelId } });
    return this.prisma.assetWarrantyClaim.create({
      data: {
        hotelId,
        assetId: dto.assetId,
        claimNumber: `WC-${String(count + 1).padStart(5, '0')}`,
        description: dto.description,
        oemService: dto.oemService,
      },
    });
  }

  async listTechnicians(hotelId: string): Promise<EamTechnicianItem[]> {
    const profiles = await this.prisma.technicianProfile.findMany({
      where: { hotelId },
      include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    const result: EamTechnicianItem[] = [];
    for (const p of profiles) {
      const currentJobs = await this.prisma.workOrder.count({
        where: {
          hotelId,
          assignedStaffId: p.staffId,
          status: { notIn: [WorkOrderStatus.CLOSED, WorkOrderStatus.CANCELLED] },
        },
      });
      const user = p.staff.user;
      result.push({
        id: p.id,
        staffId: p.staffId,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || p.staff.employeeCode,
        department: p.department,
        skills: p.skills,
        completedJobs: p.completedJobs,
        performanceScore: p.performanceScore ? Number(p.performanceScore) : null,
        isAvailable: p.isAvailable,
        currentJobs,
      });
    }
    return result;
  }

  async listInspections(hotelId: string): Promise<EamInspectionItem[]> {
    const rows = await this.prisma.maintenanceInspection.findMany({
      where: { hotelId },
      include: { asset: true, workOrder: true },
      orderBy: { inspectedAt: 'desc' },
      take: 50,
    });
    return rows.map((i) => ({
      id: i.id,
      inspectionType: i.inspectionType,
      assetName: i.asset?.name ?? null,
      workOrderNumber: i.workOrder?.workOrderNumber ?? null,
      passed: i.passed,
      inspectedAt: i.inspectedAt.toISOString(),
    }));
  }

  async createInspection(hotelId: string, dto: CreateEamInspectionSchema, userId?: string) {
    return this.prisma.maintenanceInspection.create({
      data: {
        hotelId,
        workOrderId: dto.workOrderId,
        assetId: dto.assetId,
        inspectionType: dto.inspectionType,
        checklist: dto.checklist as object | undefined,
        remarks: dto.remarks,
        passed: dto.passed,
        approvedBy: dto.passed !== undefined ? userId : undefined,
        approvedAt: dto.passed !== undefined ? new Date() : undefined,
      },
    });
  }

  async listSafetyRecords(hotelId: string): Promise<EamSafetyItem[]> {
    const rows = await this.prisma.safetyInspectionRecord.findMany({
      where: { hotelId },
      orderBy: { nextDue: 'asc' },
    });
    return rows.map((s) => ({
      id: s.id,
      equipmentType: s.equipmentType,
      location: s.location,
      complianceStatus: s.complianceStatus,
      lastInspected: s.lastInspected?.toISOString() ?? null,
      nextDue: s.nextDue?.toISOString() ?? null,
    }));
  }

  async seedSafetyRecords(hotelId: string) {
    const existing = await this.prisma.safetyInspectionRecord.count({ where: { hotelId } });
    if (existing > 0) return existing;

    const locations = ['Lobby', 'Kitchen', 'Floor 1', 'Floor 2', 'Basement', 'Roof'];
    const types = ['FIRE_EXTINGUISHER', 'SMOKE_DETECTOR', 'EMERGENCY_LIGHT', 'EMERGENCY_EXIT', 'FIRST_AID_KIT'] as const;

    await this.prisma.safetyInspectionRecord.createMany({
      data: types.flatMap((equipmentType, ti) =>
        locations.slice(0, 3).map((location, li) => ({
          hotelId,
          equipmentType,
          location: `${location} — ${equipmentType.replace(/_/g, ' ')} ${li + 1}`,
          nextDue: new Date(Date.now() + (ti + 1) * 7 * 86400000),
        })),
      ),
    });
    return types.length * 3;
  }

  async getEnergyStats(hotelId: string): Promise<EamEnergyStats> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const readings = await this.prisma.energyReading.findMany({
      where: { hotelId, readingAt: { gte: monthStart } },
      orderBy: { readingAt: 'asc' },
    });

    const electricityTotal = readings
      .filter((r) => r.utilityType === 'ELECTRICITY')
      .reduce((s, r) => s + Number(r.readingValue), 0);
    const waterTotal = readings
      .filter((r) => r.utilityType === 'WATER')
      .reduce((s, r) => s + Number(r.readingValue), 0);

    const deptMap = new Map<string, number>();
    for (const r of readings.filter((x) => x.utilityType === 'ELECTRICITY')) {
      const d = r.department ?? 'General';
      deptMap.set(d, (deptMap.get(d) ?? 0) + Number(r.readingValue));
    }

    return {
      electricityTotal,
      waterTotal,
      monthlyTrend: [{ month: monthStart.toISOString().slice(0, 7), electricity: electricityTotal, water: waterTotal }],
      departmentUsage: [...deptMap.entries()].map(([department, value]) => ({ department, value })),
      peakHours: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        value: readings.filter((r) => r.readingAt.getHours() === hour).reduce((s, r) => s + Number(r.readingValue), 0),
      })),
    };
  }

  async recordEnergyReading(hotelId: string, dto: CreateEnergyReadingSchema) {
    return this.prisma.energyReading.create({
      data: {
        hotelId,
        utilityType: dto.utilityType,
        department: dto.department,
        roomId: dto.roomId,
        readingValue: dto.readingValue,
        unit: dto.unit,
        readingAt: dto.readingAt ? new Date(dto.readingAt) : new Date(),
        meterId: dto.meterId,
      },
    });
  }

  async addWorkOrderPart(hotelId: string, workOrderId: string, dto: AddWorkOrderPartSchema, userId?: string) {
    const wo = await this.prisma.workOrder.findFirst({ where: { id: workOrderId, hotelId } });
    if (!wo) throw new NotFoundException('Work order not found');

    const totalCost = dto.quantity * dto.unitCost;
    const part = await this.prisma.workOrderPart.create({
      data: {
        hotelId,
        workOrderId,
        inventoryItemId: dto.inventoryItemId,
        partName: dto.partName,
        quantity: dto.quantity,
        unitCost: dto.unitCost,
        totalCost,
      },
    });

    await this.prisma.workOrder.update({
      where: { id: workOrderId },
      data: { partsCost: { increment: totalCost } },
    });

    if (dto.inventoryItemId) {
      const item = await this.prisma.inventoryItem.findFirst({
        where: { id: dto.inventoryItemId, hotelId },
        select: { defaultStoreId: true },
      });
      if (item?.defaultStoreId) {
        try {
          await this.inventoryOps.recordConsumption(
            hotelId,
            {
              storeId: item.defaultStoreId,
              itemId: dto.inventoryItemId,
              department: 'MAINTENANCE',
              quantity: dto.quantity,
              reference: wo.workOrderNumber,
              sourceModule: 'MAINTENANCE',
              sourceId: workOrderId,
              notes: `Work order ${wo.workOrderNumber}`,
            },
            userId,
          );
        } catch {
          // Inventory integration optional if stock unavailable
        }
      }
    }

    this.realtime.emitWorkOrderUpdate(hotelId, workOrderId);
    return part;
  }

  async getAnalytics(hotelId: string): Promise<EamAnalyticsData> {
    const monthStart = new Date();
    monthStart.setDate(1);

    const [workOrders, assets] = await Promise.all([
      this.prisma.workOrder.findMany({
        where: { hotelId, createdAt: { gte: monthStart } },
        include: { asset: true, assignedStaff: { include: { user: true } } },
      }),
      this.prisma.asset.findMany({ where: { hotelId, deletedAt: null }, include: { assetCategory: true } }),
    ]);

    const deptCost = new Map<string, number>();
    for (const w of workOrders) {
      const d = w.department ?? 'General';
      deptCost.set(d, (deptCost.get(d) ?? 0) + Number(w.laborCost) + Number(w.partsCost));
    }

    const failureByCat = new Map<string, number>();
    for (const w of workOrders.filter((x) => !x.isPreventive)) {
      const cat = w.asset?.category ?? 'Uncategorized';
      failureByCat.set(cat, (failureByCat.get(cat) ?? 0) + 1);
    }

    const repairFreq = new Map<string, number>();
    for (const w of workOrders) {
      const name = w.asset?.name ?? w.issue;
      repairFreq.set(name, (repairFreq.get(name) ?? 0) + 1);
    }

    const techMap = new Map<string, { completed: number; totalMin: number }>();
    for (const w of workOrders.filter((x) => x.status === WorkOrderStatus.CLOSED && x.assignedStaff)) {
      const name = [w.assignedStaff!.user.firstName, w.assignedStaff!.user.lastName].filter(Boolean).join(' ') || 'Tech';
      const cur = techMap.get(name) ?? { completed: 0, totalMin: 0 };
      cur.completed++;
      if (w.startedAt && w.completedAt) cur.totalMin += (w.completedAt.getTime() - w.startedAt.getTime()) / 60000;
      techMap.set(name, cur);
    }

    return {
      costByDepartment: [...deptCost.entries()].map(([department, cost]) => ({ department, cost })),
      failureRate: [...failureByCat.entries()].map(([category, count]) => ({ category, count })),
      repairFrequency: [...repairFreq.entries()]
        .map(([assetName, count]) => ({ assetName, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      technicianProductivity: [...techMap.entries()].map(([name, v]) => ({
        name,
        completed: v.completed,
        avgMinutes: v.completed ? Math.round(v.totalMin / v.completed) : 0,
      })),
      downtimeByAsset: workOrders
        .filter((w) => w.asset && w.startedAt && w.completedAt)
        .map((w) => ({
          assetName: w.asset!.name,
          hours: Math.round((w.completedAt!.getTime() - w.startedAt!.getTime()) / 3600000),
        })),
    };
  }

  async getOwnerDashboard(hotelId: string): Promise<EamOwnerDashboardStats> {
    const monthStart = new Date();
    monthStart.setDate(1);

    const [costAgg, assets, amcCost, topWo] = await Promise.all([
      this.prisma.workOrder.aggregate({
        where: { hotelId, completedAt: { gte: monthStart } },
        _sum: { laborCost: true, partsCost: true },
      }),
      this.prisma.asset.findMany({ where: { hotelId, deletedAt: null } }),
      this.prisma.assetAmcContract.aggregate({ where: { hotelId, status: 'ACTIVE' }, _sum: { cost: true } }),
      this.prisma.workOrder.groupBy({
        by: ['assetId'],
        where: { hotelId, assetId: { not: null } },
        _sum: { laborCost: true, partsCost: true },
        orderBy: { _sum: { laborCost: 'desc' } },
        take: 5,
      }),
    ]);

    const assetValue = assets.reduce((s, a) => s + Number(a.currentValue ?? a.purchaseCost ?? 0), 0);
    const purchaseTotal = assets.reduce((s, a) => s + Number(a.purchaseCost ?? 0), 0);
    const maintenanceCost = Number(costAgg._sum.laborCost ?? 0) + Number(costAgg._sum.partsCost ?? 0);

    const assetMap = Object.fromEntries(assets.map((a) => [a.id, a]));
    const topExpensiveAssets = topWo.map((t) => ({
      name: assetMap[t.assetId!]?.name ?? 'Unknown',
      cost: Number(t._sum.laborCost ?? 0) + Number(t._sum.partsCost ?? 0),
    }));

    const nearReplacement = assets
      .filter((a) => a.usefulLifeYears && a.purchaseDate)
      .map((a) => {
        const age = (Date.now() - a.purchaseDate!.getTime()) / (365.25 * 86400000);
        return { name: a.name, currentValue: Number(a.currentValue ?? 0), age: Math.round(age) };
      })
      .filter((a) => a.age >= 5)
      .slice(0, 5);

    return {
      maintenanceCost,
      assetValue,
      assetDepreciation: Math.max(0, purchaseTotal - assetValue),
      downtimeHours: 0,
      amcCost: Number(amcCost._sum.cost ?? 0),
      topExpensiveAssets,
      nearReplacement,
    };
  }

  async getReport(hotelId: string, type: string) {
    switch (type) {
      case 'assets':
        return this.prisma.asset.findMany({ where: { hotelId }, include: { assetCategory: true, room: true } });
      case 'work-orders':
        return this.prisma.workOrder.findMany({ where: { hotelId }, include: { asset: true, assignedStaff: true } });
      case 'requests':
        return this.prisma.maintenanceRequest.findMany({ where: { hotelId }, include: { room: true, asset: true } });
      case 'amc':
        return this.listAmcContracts(hotelId);
      case 'warranty':
        return this.listWarrantyClaims(hotelId);
      case 'inspection':
        return this.listInspections(hotelId);
      case 'safety':
        return this.listSafetyRecords(hotelId);
      case 'energy':
        return this.getEnergyStats(hotelId);
      default:
        return { type, message: 'Report generated', generatedAt: new Date().toISOString() };
    }
  }
}
