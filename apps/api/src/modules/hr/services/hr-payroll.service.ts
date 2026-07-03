import { Injectable, NotFoundException } from '@nestjs/common';
import { PayrollStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { HrRealtimeGateway } from '@/modules/hr/gateways/hr-realtime.gateway';

import type { CreatePayrollRunSchema, HrPayrollRunItem } from '@tungaos/shared';

@Injectable()
export class HrPayrollService {
  constructor(
    private prisma: PrismaService,
    private realtime: HrRealtimeGateway,
  ) {}

  async listRuns(hotelId: string): Promise<HrPayrollRunItem[]> {
    const runs = await this.prisma.payrollRun.findMany({
      where: { hotelId, deletedAt: null },
      include: { _count: { select: { lines: true } } },
      orderBy: { periodStart: 'desc' },
      take: 24,
    });

    return runs.map((r) => ({
      id: r.id,
      runNumber: r.runNumber,
      status: r.status,
      periodStart: r.periodStart.toISOString().slice(0, 10),
      periodEnd: r.periodEnd.toISOString().slice(0, 10),
      totalGross: Number(r.totalGross),
      totalNet: Number(r.totalNet),
      employeeCount: r._count.lines,
    }));
  }

  async listSalaryComponents(hotelId: string) {
    return this.prisma.salaryComponent.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: { code: 'asc' },
    });
  }

  async createRun(hotelId: string, dto: CreatePayrollRunSchema, userId: string) {
    const count = await this.prisma.payrollRun.count({ where: { hotelId } });
    const runNumber = `PR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const run = await this.prisma.payrollRun.create({
      data: {
        hotelId,
        runNumber,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        status: PayrollStatus.DRAFT,
        createdBy: userId,
      },
    });

    this.realtime.emitPayrollUpdate(hotelId, run.id);
    return run;
  }

  async calculateRun(hotelId: string, runId: string, userId: string) {
    const run = await this.prisma.payrollRun.findFirst({ where: { id: runId, hotelId } });
    if (!run) throw new NotFoundException('Payroll run not found');

    const staff = await this.prisma.staff.findMany({
      where: { hotelId, deletedAt: null, status: 'ACTIVE' },
    });

    let totalGross = 0;
    let totalNet = 0;

    for (const s of staff) {
      const gross = 25000;
      const deductions = 2375;
      const net = gross - deductions;

      await this.prisma.payrollLine.upsert({
        where: { hotelId_runId_staffId: { hotelId, runId, staffId: s.id } },
        create: {
          hotelId,
          runId,
          staffId: s.id,
          grossPay: gross,
          deductions,
          netPay: net,
          breakdown: { basic: 15000, hra: 6000, da: 4000, pf: 1800, esic: 375, pt: 200 },
          createdBy: userId,
        },
        update: {
          grossPay: gross,
          deductions,
          netPay: net,
          updatedBy: userId,
        },
      });

      totalGross += gross;
      totalNet += net;
    }

    const updated = await this.prisma.payrollRun.update({
      where: { id: runId },
      data: {
        status: PayrollStatus.CALCULATED,
        totalGross,
        totalNet,
        updatedBy: userId,
      },
    });

    this.realtime.emitPayrollUpdate(hotelId, runId);
    return updated;
  }

  async approveRun(hotelId: string, runId: string, userId: string) {
    const run = await this.prisma.payrollRun.findFirst({ where: { id: runId, hotelId } });
    if (!run) throw new NotFoundException('Payroll run not found');

    const updated = await this.prisma.payrollRun.update({
      where: { id: runId },
      data: { status: PayrollStatus.APPROVED, updatedBy: userId },
    });
    this.realtime.emitPayrollUpdate(hotelId, runId);
    return updated;
  }
}
