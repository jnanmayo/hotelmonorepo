import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountType, JournalEntryStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { FinanceRealtimeGateway } from '@/modules/finance/gateways/finance-realtime.gateway';

import { DEFAULT_CHART_OF_ACCOUNTS, DEFAULT_COST_CENTERS } from '@tungaos/shared';
import type { CreateJournalEntrySchema } from '@tungaos/shared';
import type { FinAccountItem, FinJournalEntryItem, FinTrialBalanceRow } from '@tungaos/shared';

@Injectable()
export class FinLedgerService {
  constructor(
    private prisma: PrismaService,
    private realtime: FinanceRealtimeGateway,
  ) {}

  async seedChartOfAccounts(hotelId: string, userId?: string) {
    const existing = await this.prisma.account.count({ where: { hotelId } });
    if (existing > 0) return existing;

    const codeToId = new Map<string, string>();
    for (const item of DEFAULT_CHART_OF_ACCOUNTS) {
      const parentId = 'parentCode' in item && item.parentCode ? codeToId.get(item.parentCode) : undefined;
      const acc = await this.prisma.account.create({
        data: {
          hotelId,
          code: item.code,
          name: item.name,
          type: item.type as AccountType,
          subType: item.subType,
          parentId,
          level: item.level,
          isSystem: true,
          createdBy: userId,
        },
      });
      codeToId.set(item.code, acc.id);
    }
    return DEFAULT_CHART_OF_ACCOUNTS.length;
  }

  async seedCostCenters(hotelId: string) {
    const existing = await this.prisma.costCenter.count({ where: { hotelId } });
    if (existing > 0) return existing;

    await this.prisma.costCenter.createMany({
      data: DEFAULT_COST_CENTERS.map((name) => ({
        hotelId,
        code: name.toUpperCase().replace(/\s+/g, '_'),
        name,
        department: name,
      })),
    });
    return DEFAULT_COST_CENTERS.length;
  }

  async listAccounts(hotelId: string): Promise<FinAccountItem[]> {
    const rows = await this.prisma.account.findMany({
      where: { hotelId, deletedAt: null },
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }, { code: 'asc' }],
    });
    return rows.map((a) => ({
      id: a.id,
      code: a.code,
      name: a.name,
      type: a.type as FinAccountItem['type'],
      subType: a.subType,
      parentId: a.parentId,
      balance: Number(a.balance),
      level: a.level,
      isSystem: a.isSystem,
    }));
  }

  async listJournalEntries(hotelId: string): Promise<FinJournalEntryItem[]> {
    const rows = await this.prisma.journalEntry.findMany({
      where: { hotelId, deletedAt: null },
      include: { lines: true },
      orderBy: { entryDate: 'desc' },
      take: 100,
    });
    return rows.map((e) => ({
      id: e.id,
      entryNumber: e.entryNumber,
      status: e.status as FinJournalEntryItem['status'],
      voucherType: e.voucherType as FinJournalEntryItem['voucherType'],
      entryDate: e.entryDate.toISOString(),
      description: e.description,
      totalDebit: e.lines.reduce((s, l) => s + Number(l.debit), 0),
      totalCredit: e.lines.reduce((s, l) => s + Number(l.credit), 0),
      isAutoPosted: e.isAutoPosted,
      sourceModule: e.sourceModule,
    }));
  }

  async createJournal(hotelId: string, dto: CreateJournalEntrySchema, userId?: string) {
    const totalDebit = dto.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = dto.lines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException('Journal entry must balance (debits = credits)');
    }

    const count = await this.prisma.journalEntry.count({ where: { hotelId } });
    const entry = await this.prisma.journalEntry.create({
      data: {
        hotelId,
        entryNumber: `JE-${String(count + 1).padStart(5, '0')}`,
        entryDate: dto.entryDate ? new Date(dto.entryDate) : new Date(),
        description: dto.description,
        voucherType: dto.voucherType,
        reference: dto.reference,
        costCenterId: dto.costCenterId,
        sourceModule: dto.sourceModule,
        sourceId: dto.sourceId,
        createdBy: userId,
        lines: {
          create: dto.lines.map((l) => ({
            hotelId,
            accountId: l.accountId,
            debit: l.debit,
            credit: l.credit,
            description: l.description,
            createdBy: userId,
          })),
        },
      },
      include: { lines: { include: { account: true } } },
    });

    this.realtime.emitJournalUpdate(hotelId, entry.id);
    return entry;
  }

  async postJournal(hotelId: string, entryId: string, userId?: string) {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id: entryId, hotelId },
      include: { lines: true },
    });
    if (!entry) throw new NotFoundException('Journal entry not found');
    if (entry.status === JournalEntryStatus.POSTED) throw new BadRequestException('Already posted');

    await this.prisma.$transaction(async (tx) => {
      for (const line of entry.lines) {
        const delta = Number(line.debit) - Number(line.credit);
        await tx.account.update({
          where: { id: line.accountId },
          data: { balance: { increment: delta } },
        });
      }
      await tx.journalEntry.update({
        where: { id: entryId },
        data: { status: JournalEntryStatus.POSTED, postedAt: new Date(), updatedBy: userId },
      });
    });

    this.realtime.notifyDashboard(hotelId);
    this.realtime.emitJournalUpdate(hotelId, entryId);
    return { posted: true };
  }

  async getTrialBalance(hotelId: string): Promise<FinTrialBalanceRow[]> {
    const accounts = await this.prisma.account.findMany({
      where: { hotelId, deletedAt: null, balance: { not: 0 } },
      orderBy: { code: 'asc' },
    });
    return accounts.map((a) => {
      const bal = Number(a.balance);
      const isDebitNormal = ['ASSET', 'EXPENSE'].includes(a.type);
      return {
        accountCode: a.code,
        accountName: a.name,
        debit: isDebitNormal && bal > 0 ? bal : !isDebitNormal && bal < 0 ? Math.abs(bal) : 0,
        credit: !isDebitNormal && bal > 0 ? bal : isDebitNormal && bal < 0 ? Math.abs(bal) : 0,
      };
    });
  }

  async getGeneralLedger(hotelId: string, accountId?: string) {
    const lines = await this.prisma.journalLine.findMany({
      where: {
        hotelId,
        ...(accountId ? { accountId } : {}),
        entry: { status: JournalEntryStatus.POSTED },
      },
      include: { account: true, entry: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return lines.map((l) => ({
      entryNumber: l.entry.entryNumber,
      entryDate: l.entry.entryDate.toISOString(),
      accountCode: l.account.code,
      accountName: l.account.name,
      debit: Number(l.debit),
      credit: Number(l.credit),
      description: l.description,
    }));
  }

  async syncFromModules(hotelId: string, userId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let synced = { folios: 0, vendorInvoices: 0, payments: 0 };

    const folios = await this.prisma.folioCharge.findMany({
      where: { hotelId, postedAt: { gte: today } },
      include: { reservation: { include: { guest: true } } },
    });

    for (const f of folios) {
      const existing = await this.prisma.finReceivable.findFirst({
        where: { hotelId, invoiceRef: f.id, sourceModule: 'PMS' },
      });
      if (existing) continue;

      await this.prisma.finReceivable.create({
        data: {
          hotelId,
          type: 'GUEST',
          partyName: f.reservation.guest ? `${f.reservation.guest.firstName ?? ''} ${f.reservation.guest.lastName ?? ''}`.trim() : 'Guest',
          partyRef: f.reservation.guestId ?? undefined,
          invoiceRef: f.id,
          amount: f.totalAmount,
          sourceModule: 'PMS',
        },
      });
      synced.folios++;
    }

    const vendorInvoices = await this.prisma.vendorInvoice.findMany({
      where: { hotelId, status: { in: ['SUBMITTED', 'PENDING_MATCH', 'MATCHED', 'APPROVED'] } },
      include: { vendor: true },
    });

    for (const vi of vendorInvoices) {
      const existing = await this.prisma.finPayable.findFirst({
        where: { hotelId, billRef: vi.id, sourceModule: 'PROCUREMENT' },
      });
      if (existing) continue;

      await this.prisma.finPayable.create({
        data: {
          hotelId,
          type: 'VENDOR',
          partyName: vi.vendor?.name ?? 'Vendor',
          partyRef: vi.vendorId,
          billRef: vi.id,
          amount: vi.totalAmount,
          dueDate: vi.dueDate ?? undefined,
          sourceModule: 'PROCUREMENT',
        },
      });
      synced.vendorInvoices++;
    }

    const payments = await this.prisma.payment.findMany({
      where: { hotelId, paidAt: { gte: today }, status: 'CAPTURED' },
    });

    for (const p of payments) {
      const existing = await this.prisma.finCashTransaction.findFirst({
        where: { hotelId, description: { contains: p.paymentNumber } },
      });
      if (existing) continue;

      await this.prisma.finCashTransaction.create({
        data: {
          hotelId,
          type: 'COLLECTION',
          amount: p.amount,
          description: `Payment ${p.paymentNumber} — ${p.method}`,
          createdBy: userId,
        },
      });
      synced.payments++;
    }

    this.realtime.notifyDashboard(hotelId);
    return synced;
  }
}
