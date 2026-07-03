import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/database/prisma.service';

import type {
  CreateCandidateSchema,
  CreateExpenseClaimSchema,
  CreateJobOpeningSchema,
  HrCandidateItem,
  HrDocumentItem,
  HrExitItem,
  HrExpenseItem,
  HrInterviewItem,
  HrJobOpeningItem,
  HrOnboardingItem,
  HrPerformanceItem,
  HrTrainingCourseItem,
  ScheduleInterviewSchema,
} from '@tungaos/shared';

@Injectable()
export class HrSupportService {
  constructor(private prisma: PrismaService) {}

  async listJobOpenings(hotelId: string): Promise<HrJobOpeningItem[]> {
    const rows = await this.prisma.jobOpening.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        department: { select: { name: true } },
        _count: { select: { candidates: true } },
      },
      orderBy: { postedAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      department: r.department?.name ?? null,
      status: r.status,
      openings: r.openings,
      candidateCount: r._count.candidates,
      postedAt: r.postedAt.toISOString().slice(0, 10),
    }));
  }

  async createJobOpening(hotelId: string, dto: CreateJobOpeningSchema) {
    return this.prisma.jobOpening.create({
      data: {
        hotelId,
        title: dto.title,
        departmentId: dto.departmentId,
        designationId: dto.designationId,
        openings: dto.openings,
        description: dto.description,
        salaryMin: dto.salaryMin,
        salaryMax: dto.salaryMax,
      },
    });
  }

  async listCandidates(hotelId: string): Promise<HrCandidateItem[]> {
    const rows = await this.prisma.candidate.findMany({
      where: { hotelId, deletedAt: null },
      include: { jobOpening: { select: { title: true } } },
      orderBy: { appliedAt: 'desc' },
      take: 200,
    });
    return rows.map((r) => ({
      id: r.id,
      name: `${r.firstName} ${r.lastName}`,
      email: r.email,
      jobTitle: r.jobOpening.title,
      status: r.status,
      appliedAt: r.appliedAt.toISOString().slice(0, 10),
    }));
  }

  async createCandidate(hotelId: string, dto: CreateCandidateSchema) {
    return this.prisma.candidate.create({
      data: {
        hotelId,
        jobOpeningId: dto.jobOpeningId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        source: dto.source,
      },
    });
  }

  async listInterviews(hotelId: string): Promise<HrInterviewItem[]> {
    const rows = await this.prisma.interview.findMany({
      where: { hotelId },
      include: {
        candidate: {
          include: { jobOpening: { select: { title: true } } },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 100,
    });
    return rows.map((r) => ({
      id: r.id,
      candidateName: `${r.candidate.firstName} ${r.candidate.lastName}`,
      jobTitle: r.candidate.jobOpening.title,
      scheduledAt: r.scheduledAt.toISOString(),
      interviewer: r.interviewer,
      round: r.round,
      completed: r.completed,
    }));
  }

  async scheduleInterview(hotelId: string, dto: ScheduleInterviewSchema) {
    return this.prisma.interview.create({
      data: {
        hotelId,
        candidateId: dto.candidateId,
        scheduledAt: new Date(dto.scheduledAt),
        interviewer: dto.interviewer,
        round: dto.round,
      },
    });
  }

  async listOnboarding(hotelId: string): Promise<HrOnboardingItem[]> {
    const rows = await this.prisma.onboardingTask.findMany({
      where: { hotelId },
      include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { dueDate: 'asc' },
    });
    return rows.map((r) => ({
      id: r.id,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      title: r.title,
      category: r.category,
      status: r.status,
      dueDate: r.dueDate?.toISOString().slice(0, 10) ?? null,
    }));
  }

  async listTraining(hotelId: string): Promise<HrTrainingCourseItem[]> {
    const rows = await this.prisma.trainingCourse.findMany({
      where: { hotelId, deletedAt: null },
      include: { enrollments: { select: { progressPct: true } } },
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      durationHrs: r.durationHrs,
      isMandatory: r.isMandatory,
      enrolledCount: r.enrollments.length,
      completionPct: r.enrollments.length
        ? Math.round(r.enrollments.reduce((s, e) => s + e.progressPct, 0) / r.enrollments.length)
        : 0,
    }));
  }

  async listPerformance(hotelId: string): Promise<HrPerformanceItem[]> {
    const rows = await this.prisma.performanceReview.findMany({
      where: { hotelId },
      include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      period: r.period,
      status: r.status,
      kpiScore: r.kpiScore ? Number(r.kpiScore) : null,
      finalScore: r.finalScore ? Number(r.finalScore) : null,
    }));
  }

  async listExpenses(hotelId: string): Promise<HrExpenseItem[]> {
    const rows = await this.prisma.hrExpenseClaim.findMany({
      where: { hotelId },
      include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      claimNumber: r.claimNumber,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      category: r.category,
      amount: Number(r.amount),
      status: r.status,
      claimDate: r.claimDate.toISOString().slice(0, 10),
    }));
  }

  async createExpense(hotelId: string, dto: CreateExpenseClaimSchema) {
    const count = await this.prisma.hrExpenseClaim.count({ where: { hotelId } });
    const claimNumber = `EXP-${String(count + 1).padStart(5, '0')}`;
    return this.prisma.hrExpenseClaim.create({
      data: {
        hotelId,
        staffId: dto.staffId,
        claimNumber,
        category: dto.category,
        amount: dto.amount,
        description: dto.description,
      },
    });
  }

  async approveExpense(hotelId: string, id: string, userId: string) {
    const claim = await this.prisma.hrExpenseClaim.findFirst({ where: { id, hotelId } });
    if (!claim) throw new NotFoundException('Expense claim not found');
    return this.prisma.hrExpenseClaim.update({
      where: { id },
      data: { status: 'APPROVED', approvedBy: userId, approvedAt: new Date() },
    });
  }

  async listExit(hotelId: string): Promise<HrExitItem[]> {
    const rows = await this.prisma.exitProcess.findMany({
      where: { hotelId },
      include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      status: r.status,
      resignationDate: r.resignationDate.toISOString().slice(0, 10),
      lastWorkingDate: r.lastWorkingDate?.toISOString().slice(0, 10) ?? null,
    }));
  }

  async listDocuments(hotelId: string): Promise<HrDocumentItem[]> {
    const rows = await this.prisma.staffDocument.findMany({
      where: { hotelId, deletedAt: null },
      include: { staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map((r) => ({
      id: r.id,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      docType: r.docType,
      title: r.title,
      createdAt: r.createdAt.toISOString().slice(0, 10),
    }));
  }

  async getReport(hotelId: string, type: string) {
    const [employees, attendance, leave, payroll] = await Promise.all([
      this.prisma.staff.count({ where: { hotelId, deletedAt: null } }),
      this.prisma.attendanceRecord.count({ where: { hotelId } }),
      this.prisma.leaveRequest.count({ where: { hotelId } }),
      this.prisma.payrollRun.count({ where: { hotelId } }),
    ]);

    return {
      type,
      generatedAt: new Date().toISOString(),
      summary: { employees, attendance, leave, payroll },
    };
  }
}
