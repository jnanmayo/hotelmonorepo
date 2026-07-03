import { Injectable } from '@nestjs/common';
import {
  AttendanceStatus,
  EmployeeStatus,
  LeaveStatus,
  PayrollStatus,
} from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type { HrDashboardStats, HrOwnerDashboardStats } from '@tungaos/shared';

@Injectable()
export class HrDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(hotelId: string): Promise<HrDashboardStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);

    const [
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
      onLeaveToday,
      newJoiners,
      resignations,
      openPositions,
      interviewsScheduled,
      payrollPending,
      deptGroups,
      trainingAgg,
      satisfactionAgg,
    ] = await Promise.all([
      this.prisma.staff.count({ where: { hotelId, status: EmployeeStatus.ACTIVE, deletedAt: null } }),
      this.prisma.attendanceRecord.count({
        where: { hotelId, date: today, status: AttendanceStatus.PRESENT },
      }),
      this.prisma.attendanceRecord.count({
        where: { hotelId, date: today, status: AttendanceStatus.ABSENT },
      }),
      this.prisma.attendanceRecord.count({
        where: { hotelId, date: today, status: AttendanceStatus.LATE },
      }),
      this.prisma.leaveRequest.count({
        where: {
          hotelId,
          status: LeaveStatus.APPROVED,
          startDate: { lte: today },
          endDate: { gte: today },
        },
      }),
      this.prisma.staff.count({
        where: { hotelId, joiningDate: { gte: monthStart }, deletedAt: null },
      }),
      this.prisma.exitProcess.count({
        where: { hotelId, status: { not: 'COMPLETED' } },
      }),
      this.prisma.jobOpening.count({ where: { hotelId, status: 'OPEN', deletedAt: null } }),
      this.prisma.interview.count({
        where: { hotelId, scheduledAt: { gte: today, lt: in7Days }, completed: false },
      }),
      this.prisma.payrollRun.count({
        where: { hotelId, status: { in: [PayrollStatus.DRAFT, PayrollStatus.CALCULATED] } },
      }),
      this.prisma.staff.groupBy({
        by: ['department'],
        where: { hotelId, status: EmployeeStatus.ACTIVE, deletedAt: null },
        _count: true,
      }),
      this.prisma.employeeTraining.aggregate({
        where: { hotelId },
        _avg: { progressPct: true },
      }),
      this.prisma.performanceReview.aggregate({
        where: { hotelId, finalScore: { not: null } },
        _avg: { finalScore: true },
      }),
    ]);

    const monthAttendance = await this.prisma.attendanceRecord.count({
      where: { hotelId, date: { gte: monthStart, lt: tomorrow } },
    });
    const workingDays = totalEmployees * Math.max(1, today.getDate());
    const avgAttendancePct = workingDays > 0 ? Math.round((monthAttendance / workingDays) * 100) : 0;

    const profiles = await this.prisma.staffProfile.findMany({
      where: {
        hotelId,
        dateOfBirth: {
          not: null,
        },
      },
      select: { dateOfBirth: true },
    });
    const upcomingBirthdays = profiles.filter((p) => {
      if (!p.dateOfBirth) return false;
      const dob = new Date(p.dateOfBirth);
      const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < today) next.setFullYear(next.getFullYear() + 1);
      return next <= in7Days;
    }).length;

    const staffAnniversaries = await this.prisma.staff.findMany({
      where: { hotelId, joiningDate: { not: null }, status: EmployeeStatus.ACTIVE },
      select: { joiningDate: true },
    });
    const upcomingAnniversaries = staffAnniversaries.filter((s) => {
      if (!s.joiningDate) return false;
      const jd = new Date(s.joiningDate);
      const next = new Date(today.getFullYear(), jd.getMonth(), jd.getDate());
      if (next < today) next.setFullYear(next.getFullYear() + 1);
      return next <= in30Days;
    }).length;

    return {
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
      onLeaveToday,
      upcomingBirthdays,
      upcomingAnniversaries,
      newJoiners,
      resignations,
      openPositions,
      interviewsScheduled,
      payrollPending,
      avgAttendancePct,
      employeeSatisfaction: Math.round(Number(satisfactionAgg._avg.finalScore ?? 4.2) * 20),
      trainingProgressPct: Math.round(Number(trainingAgg._avg.progressPct ?? 0)),
      departmentStrength: deptGroups.map((d) => ({
        department: d.department ?? 'Unassigned',
        count: d._count,
      })),
    };
  }

  async getOwnerDashboard(hotelId: string): Promise<HrOwnerDashboardStats> {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [payrollAgg, payrollLines, activeStaff, exits, topReviews] = await Promise.all([
      this.prisma.payrollRun.aggregate({
        where: { hotelId, periodStart: { gte: monthStart } },
        _sum: { totalNet: true },
      }),
      this.prisma.payrollLine.findMany({
        where: { hotelId, run: { periodStart: { gte: monthStart } } },
        include: { staff: { select: { department: true } } },
      }),
      this.prisma.staff.count({ where: { hotelId, status: EmployeeStatus.ACTIVE } }),
      this.prisma.exitProcess.count({
        where: { hotelId, createdAt: { gte: monthStart } },
      }),
      this.prisma.performanceReview.findMany({
        where: { hotelId, finalScore: { not: null } },
        include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
        orderBy: { finalScore: 'desc' },
        take: 5,
      }),
    ]);

    const deptMap = new Map<string, number>();
    for (const line of payrollLines) {
      const dept = line.staff.department ?? 'Other';
      deptMap.set(dept, (deptMap.get(dept) ?? 0) + Number(line.netPay));
    }

    const dashboard = await this.getDashboard(hotelId);

    return {
      totalSalaryCost: Number(payrollAgg._sum.totalNet ?? 0),
      departmentPayroll: [...deptMap.entries()].map(([department, amount]) => ({ department, amount })),
      attendancePct: dashboard.avgAttendancePct,
      attritionRate: activeStaff > 0 ? Math.round((exits / activeStaff) * 1000) / 10 : 0,
      overtimeCost: 0,
      trainingCost: 0,
      topPerformers: topReviews.map((r) => ({
        name: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
        score: Number(r.finalScore ?? 0),
      })),
    };
  }
}
