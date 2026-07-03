import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { HrRealtimeGateway } from '@/modules/hr/gateways/hr-realtime.gateway';

import type {
  ApproveLeaveSchema,
  AssignRosterSchema,
  CreateLeaveRequestSchema,
  CreateShiftSchema,
  HrAttendanceItem,
  HrLeaveItem,
  HrRosterItem,
  HrShiftItem,
} from '@tungaos/shared';

@Injectable()
export class HrOperationsService {
  constructor(
    private prisma: PrismaService,
    private realtime: HrRealtimeGateway,
  ) {}

  async listAttendance(hotelId: string, date?: string): Promise<HrAttendanceItem[]> {
    const d = date ? new Date(date) : new Date();
    d.setHours(0, 0, 0, 0);

    const rows = await this.prisma.attendanceRecord.findMany({
      where: { hotelId, date: d },
      include: {
        staff: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { checkIn: 'asc' },
      take: 500,
    });

    return rows.map((r) => ({
      id: r.id,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      employeeCode: r.staff.employeeCode,
      date: r.date.toISOString().slice(0, 10),
      status: r.status,
      checkIn: r.checkIn?.toISOString() ?? null,
      checkOut: r.checkOut?.toISOString() ?? null,
      hoursWorked: r.hoursWorked ? Number(r.hoursWorked) : null,
    }));
  }

  async listLeave(hotelId: string, status?: string): Promise<HrLeaveItem[]> {
    const rows = await this.prisma.leaveRequest.findMany({
      where: {
        hotelId,
        ...(status ? { status: status as LeaveStatus } : {}),
      },
      include: {
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      leaveType: r.leaveType,
      status: r.status,
      startDate: r.startDate.toISOString().slice(0, 10),
      endDate: r.endDate.toISOString().slice(0, 10),
      reason: r.reason,
    }));
  }

  async createLeave(hotelId: string, dto: CreateLeaveRequestSchema, userId: string) {
    const leave = await this.prisma.leaveRequest.create({
      data: {
        hotelId,
        staffId: dto.staffId,
        leaveType: dto.leaveType,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        createdBy: userId,
      },
    });
    this.realtime.notifyDashboard(hotelId);
    return leave;
  }

  async approveLeave(hotelId: string, id: string, dto: ApproveLeaveSchema, userId: string) {
    const leave = await this.prisma.leaveRequest.findFirst({ where: { id, hotelId } });
    if (!leave) throw new NotFoundException('Leave request not found');

    const updated = await this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: dto.approved ? LeaveStatus.APPROVED : LeaveStatus.REJECTED,
        approvedBy: userId,
        approvedAt: new Date(),
        updatedBy: userId,
      },
    });
    this.realtime.emitLeaveUpdate(hotelId, id);
    return updated;
  }

  async listShifts(hotelId: string): Promise<HrShiftItem[]> {
    const shifts = await this.prisma.shift.findMany({
      where: { hotelId, deletedAt: null },
      include: { _count: { select: { staffShifts: true } } },
      orderBy: { startTime: 'asc' },
    });
    return shifts.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      startTime: s.startTime,
      endTime: s.endTime,
      assignedCount: s._count.staffShifts,
    }));
  }

  async createShift(hotelId: string, dto: CreateShiftSchema, userId: string) {
    return this.prisma.shift.create({
      data: {
        hotelId,
        name: dto.name,
        type: dto.type,
        startTime: dto.startTime,
        endTime: dto.endTime,
        createdBy: userId,
      },
    });
  }

  async listRoster(hotelId: string, date?: string): Promise<HrRosterItem[]> {
    const d = date ? new Date(date) : new Date();
    d.setHours(0, 0, 0, 0);

    const rows = await this.prisma.staffShift.findMany({
      where: { hotelId, date: d },
      include: {
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
        shift: { select: { name: true } },
      },
      orderBy: { shift: { startTime: 'asc' } },
    });

    return rows.map((r) => ({
      id: r.id,
      staffName: `${r.staff.user.firstName} ${r.staff.user.lastName}`,
      shiftName: r.shift.name,
      date: r.date.toISOString().slice(0, 10),
    }));
  }

  async assignRoster(hotelId: string, dto: AssignRosterSchema, userId: string) {
    try {
      return await this.prisma.staffShift.create({
        data: {
          hotelId,
          staffId: dto.staffId,
          shiftId: dto.shiftId,
          date: new Date(dto.date),
          createdBy: userId,
        },
      });
    } catch {
      throw new BadRequestException('Roster assignment already exists for this date');
    }
  }
}
