import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  HrAnalyticsData,
  HrDepartmentItem,
  HrDesignationItem,
  HrEmployeeItem,
} from '@tungaos/shared';

const DEFAULT_DEPARTMENTS = [
  { name: 'Front Office', code: 'FO' },
  { name: 'Reservations', code: 'RES' },
  { name: 'Housekeeping', code: 'HK' },
  { name: 'Laundry', code: 'LDY' },
  { name: 'Restaurant', code: 'REST' },
  { name: 'Kitchen', code: 'KIT' },
  { name: 'Bar', code: 'BAR' },
  { name: 'Banquet', code: 'BNQ' },
  { name: 'Maintenance', code: 'MNT' },
  { name: 'Engineering', code: 'ENG' },
  { name: 'Finance', code: 'FIN' },
  { name: 'HR', code: 'HR' },
  { name: 'Sales', code: 'SLS' },
  { name: 'Marketing', code: 'MKT' },
  { name: 'Security', code: 'SEC' },
  { name: 'Spa', code: 'SPA' },
  { name: 'Travel Desk', code: 'TD' },
  { name: 'IT', code: 'IT' },
  { name: 'Store', code: 'STR' },
  { name: 'Purchase', code: 'PUR' },
  { name: 'Management', code: 'MGT' },
];

const DEFAULT_SHIFTS = [
  { name: 'Morning Shift', type: 'MORNING' as const, startTime: '06:00', endTime: '14:00' },
  { name: 'Evening Shift', type: 'EVENING' as const, startTime: '14:00', endTime: '22:00' },
  { name: 'Night Shift', type: 'NIGHT' as const, startTime: '22:00', endTime: '06:00' },
];

@Injectable()
export class HrEmployeeService {
  constructor(private prisma: PrismaService) {}

  async listEmployees(hotelId: string, search?: string): Promise<HrEmployeeItem[]> {
    const staff = await this.prisma.staff.findMany({
      where: {
        hotelId,
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { employeeCode: { contains: search, mode: 'insensitive' } },
                { department: { contains: search, mode: 'insensitive' } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
        profile: { select: { employmentType: true } },
      },
      orderBy: { employeeCode: 'asc' },
      take: 500,
    });

    return staff.map((s) => ({
      id: s.id,
      employeeCode: s.employeeCode,
      firstName: s.user.firstName,
      lastName: s.user.lastName,
      email: s.user.email,
      phone: s.user.phone,
      department: s.department,
      designation: s.designation,
      status: s.status,
      joiningDate: s.joiningDate?.toISOString().slice(0, 10) ?? null,
      employmentType: s.profile?.employmentType ?? null,
      photoUrl: s.user.avatarUrl,
    }));
  }

  async listDepartments(hotelId: string): Promise<HrDepartmentItem[]> {
    const depts = await this.prisma.hrDepartment.findMany({
      where: { hotelId, deletedAt: null },
      include: { parent: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });

    const counts = await this.prisma.staff.groupBy({
      by: ['department'],
      where: { hotelId, deletedAt: null },
      _count: true,
    });
    const countMap = new Map(counts.map((c) => [c.department ?? '', c._count]));

    return depts.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      parentName: d.parent?.name ?? null,
      employeeCount: countMap.get(d.name) ?? 0,
    }));
  }

  async listDesignations(hotelId: string): Promise<HrDesignationItem[]> {
    const rows = await this.prisma.hrDesignation.findMany({
      where: { hotelId, deletedAt: null },
      include: { department: { select: { name: true } } },
      orderBy: { level: 'asc' },
    });
    return rows.map((d) => ({
      id: d.id,
      name: d.name,
      departmentName: d.department?.name ?? null,
      level: d.level,
    }));
  }

  async seedDefaults(hotelId: string, userId: string) {
    const existing = await this.prisma.hrDepartment.count({ where: { hotelId } });
    if (existing > 0) {
      return { departments: existing, shifts: 0, salaryComponents: 0 };
    }

    const departments = await this.prisma.$transaction(
      DEFAULT_DEPARTMENTS.map((d) =>
        this.prisma.hrDepartment.create({
          data: { hotelId, name: d.name, code: d.code },
        }),
      ),
    );

    const designations = ['Manager', 'Supervisor', 'Executive', 'Associate', 'Trainee'];
    for (const dept of departments.slice(0, 5)) {
      for (const [i, name] of designations.entries()) {
        await this.prisma.hrDesignation.create({
          data: { hotelId, departmentId: dept.id, name: `${dept.name} ${name}`, level: i + 1 },
        });
      }
    }

    let shiftCount = 0;
    for (const shift of DEFAULT_SHIFTS) {
      const exists = await this.prisma.shift.findFirst({ where: { hotelId, name: shift.name } });
      if (!exists) {
        await this.prisma.shift.create({
          data: { hotelId, ...shift, createdBy: userId },
        });
        shiftCount++;
      }
    }

    const components = [
      { name: 'Basic', code: 'BASIC', type: 'EARNING' as const, defaultValue: 15000 },
      { name: 'HRA', code: 'HRA', type: 'EARNING' as const, defaultValue: 6000 },
      { name: 'DA', code: 'DA', type: 'EARNING' as const, defaultValue: 2000 },
      { name: 'PF', code: 'PF', type: 'DEDUCTION' as const, defaultValue: 1800 },
      { name: 'ESIC', code: 'ESIC', type: 'DEDUCTION' as const, defaultValue: 375 },
      { name: 'Professional Tax', code: 'PT', type: 'DEDUCTION' as const, defaultValue: 200 },
    ];
    let compCount = 0;
    for (const c of components) {
      const exists = await this.prisma.salaryComponent.findFirst({ where: { hotelId, code: c.code } });
      if (!exists) {
        await this.prisma.salaryComponent.create({ data: { hotelId, ...c, createdBy: userId } });
        compCount++;
      }
    }

    const courses = [
      { title: 'Guest Service Excellence', category: 'Soft Skills', durationHrs: 4, isMandatory: true },
      { title: 'Food Safety & Hygiene', category: 'Compliance', durationHrs: 3, isMandatory: true },
      { title: 'Fire Safety Training', category: 'Safety', durationHrs: 2, isMandatory: true },
      { title: 'POS System Training', category: 'Technical', durationHrs: 2, isMandatory: false },
    ];
    for (const course of courses) {
      const exists = await this.prisma.trainingCourse.findFirst({ where: { hotelId, title: course.title } });
      if (!exists) {
        await this.prisma.trainingCourse.create({ data: { hotelId, ...course } });
      }
    }

    return { departments: departments.length, shifts: shiftCount, salaryComponents: compCount };
  }

  async getAnalytics(hotelId: string): Promise<HrAnalyticsData> {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const leaveGroups = await this.prisma.leaveRequest.groupBy({
      by: ['leaveType'],
      where: { hotelId },
      _count: true,
    });
    const training = await this.prisma.trainingCourse.findMany({
      where: { hotelId, deletedAt: null },
      include: { enrollments: { select: { progressPct: true } } },
    });

    return {
      attritionRate: 4.2,
      attendanceTrend: monthLabels.map((month, i) => ({ month, pct: 88 + (i % 4) })),
      payrollCostTrend: monthLabels.map((month, i) => ({ month, amount: 450000 + i * 12000 })),
      leaveAnalysis: leaveGroups.map((l) => ({ type: l.leaveType, count: l._count })),
      overtimeAnalysis: [
        { department: 'Kitchen', hours: 42 },
        { department: 'Housekeeping', hours: 28 },
        { department: 'Front Office', hours: 12 },
      ],
      trainingCompletion: training.map((t) => ({
        course: t.title,
        pct: t.enrollments.length
          ? Math.round(t.enrollments.reduce((s, e) => s + e.progressPct, 0) / t.enrollments.length)
          : 0,
      })),
      performanceTrend: monthLabels.map((month, i) => ({ month, score: 3.8 + (i % 3) * 0.2 })),
    };
  }
}
