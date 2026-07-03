import { Injectable } from '@nestjs/common';
import {
  AssetStatus,
  MaintenancePriority,
  MaintenanceStatus,
  WorkOrderStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { EamDashboardStats } from '@tungaos/shared';

@Injectable()
export class EamDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<EamDashboardStats> {
    const now = new Date();
    const in30Days = new Date(now);
    in30Days.setDate(in30Days.getDate() + 30);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalAssets,
      operationalAssets,
      assetsUnderRepair,
      assetsUnderAmc,
      assetsUnderWarranty,
      openWorkOrders,
      completedWorkOrders,
      overdueWorkOrders,
      emergencyRepairs,
      costAgg,
      openRequests,
      upcomingPm,
      warrantyExpiry,
      amcExpiry,
      pendingInspections,
      completedWoTimes,
      woCountByTech,
    ] = await Promise.all([
      this.prisma.asset.count({ where: { hotelId, isActive: true, deletedAt: null } }),
      this.prisma.asset.count({ where: { hotelId, status: AssetStatus.ACTIVE, lifecycleStage: 'OPERATIONAL' } }),
      this.prisma.asset.count({ where: { hotelId, status: AssetStatus.IN_MAINTENANCE } }),
      this.prisma.asset.count({ where: { hotelId, amcEnd: { gte: now } } }),
      this.prisma.asset.count({ where: { hotelId, warrantyEnd: { gte: now } } }),
      this.prisma.workOrder.count({
        where: { hotelId, status: { notIn: [WorkOrderStatus.CLOSED, WorkOrderStatus.CANCELLED] } },
      }),
      this.prisma.workOrder.count({
        where: { hotelId, status: WorkOrderStatus.CLOSED, completedAt: { gte: monthStart } },
      }),
      this.prisma.workOrder.count({
        where: {
          hotelId,
          status: { notIn: [WorkOrderStatus.CLOSED, WorkOrderStatus.CANCELLED, WorkOrderStatus.COMPLETED] },
          createdAt: { lt: new Date(now.getTime() - 48 * 3600 * 1000) },
        },
      }),
      this.prisma.workOrder.count({
        where: { hotelId, priority: MaintenancePriority.EMERGENCY, status: { not: WorkOrderStatus.CLOSED } },
      }),
      this.prisma.workOrder.aggregate({
        where: { hotelId, completedAt: { gte: monthStart } },
        _sum: { laborCost: true, partsCost: true },
      }),
      this.prisma.maintenanceRequest.count({
        where: { hotelId, status: { in: [MaintenanceStatus.OPEN, MaintenanceStatus.ASSIGNED, MaintenanceStatus.IN_PROGRESS] } },
      }),
      this.prisma.preventiveMaintenancePlan.count({
        where: { hotelId, isActive: true, nextDueAt: { lte: in30Days } },
      }),
      this.prisma.asset.count({ where: { hotelId, warrantyEnd: { gte: now, lte: in30Days } } }),
      this.prisma.assetAmcContract.count({ where: { hotelId, endDate: { gte: now, lte: in30Days }, status: 'ACTIVE' } }),
      this.prisma.maintenanceInspection.count({ where: { hotelId, passed: null } }),
      this.prisma.workOrder.findMany({
        where: { hotelId, status: WorkOrderStatus.CLOSED, startedAt: { not: null }, completedAt: { not: null } },
        select: { startedAt: true, completedAt: true },
        take: 100,
        orderBy: { completedAt: 'desc' },
      }),
      this.prisma.workOrder.groupBy({
        by: ['assignedStaffId'],
        where: { hotelId, status: WorkOrderStatus.CLOSED, completedAt: { gte: monthStart }, assignedStaffId: { not: null } },
        _count: true,
      }),
    ]);

    const maintenanceCost =
      Number(costAgg._sum.laborCost ?? 0) + Number(costAgg._sum.partsCost ?? 0);

    let mttr = 0;
    if (completedWoTimes.length) {
      const totalMs = completedWoTimes.reduce((s, w) => {
        if (!w.startedAt || !w.completedAt) return s;
        return s + (w.completedAt.getTime() - w.startedAt.getTime());
      }, 0);
      mttr = Math.round(totalMs / completedWoTimes.length / 60000);
    }

    const techJobs = woCountByTech.reduce((s, t) => s + t._count, 0);
    const technicianProductivity = woCountByTech.length ? Math.round(techJobs / woCountByTech.length) : 0;

    return {
      totalAssets,
      operationalAssets,
      assetsUnderRepair,
      assetsUnderAmc,
      assetsUnderWarranty,
      openWorkOrders,
      completedWorkOrders,
      overdueWorkOrders,
      emergencyRepairs,
      maintenanceCost,
      downtimeHours: Math.round(mttr * openWorkOrders / 60),
      mttr,
      mtbf: completedWorkOrders > 0 ? Math.round(totalAssets / completedWorkOrders) : 0,
      technicianProductivity,
      upcomingPreventive: upcomingPm,
      upcomingWarrantyExpiry: warrantyExpiry,
      upcomingAmcExpiry: amcExpiry,
      openRequests,
      pendingInspections,
    };
  }
}
