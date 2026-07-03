import { Injectable, NotFoundException } from '@nestjs/common';
import { LoyaltyType, MembershipTier } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CrmRealtimeGateway } from '@/modules/crm/gateways/crm-realtime.gateway';

import type {
  AdjustLoyaltyPointsSchema,
  CrmLoyaltyMemberItem,
  CrmLoyaltyTransactionItem,
} from '@tungaos/shared';

@Injectable()
export class CrmLoyaltyService {
  constructor(
    private prisma: PrismaService,
    private realtime: CrmRealtimeGateway,
  ) {}

  async listMembers(hotelId: string): Promise<CrmLoyaltyMemberItem[]> {
    const accounts = await this.prisma.loyaltyAccount.findMany({
      where: { hotelId, deletedAt: null },
      include: {
        guest: { select: { firstName: true, lastName: true, guestCode: true } },
        transactions: { select: { points: true, type: true } },
      },
      orderBy: { balance: 'desc' },
      take: 200,
    });

    return accounts.map((a) => {
      const earned = a.transactions
        .filter((t) => t.type === LoyaltyType.EARN || t.type === LoyaltyType.BONUS)
        .reduce((s, t) => s + Number(t.points), 0);
      return {
        id: a.id,
        guestName: `${a.guest.firstName} ${a.guest.lastName}`,
        guestCode: a.guest.guestCode,
        tier: a.tier,
        balance: Number(a.balance),
        lifetimePoints: earned,
      };
    });
  }

  async listTransactions(hotelId: string): Promise<CrmLoyaltyTransactionItem[]> {
    const rows = await this.prisma.loyaltyTransaction.findMany({
      where: { hotelId },
      include: {
        account: { include: { guest: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return rows.map((r) => ({
      id: r.id,
      guestName: `${r.account.guest.firstName} ${r.account.guest.lastName}`,
      type: r.type,
      points: Number(r.points),
      balanceAfter: Number(r.balanceAfter),
      description: r.description,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async adjustPoints(hotelId: string, dto: AdjustLoyaltyPointsSchema, userId: string) {
    let account = await this.prisma.loyaltyAccount.findFirst({
      where: { hotelId, guestId: dto.guestId },
    });

    if (!account) {
      const program = await this.prisma.loyaltyProgram.findFirst({ where: { hotelId } });
      if (!program) throw new NotFoundException('Loyalty program not configured');

      account = await this.prisma.loyaltyAccount.create({
        data: {
          hotelId,
          guestId: dto.guestId,
          programId: program.id,
          tier: MembershipTier.SILVER,
          createdBy: userId,
        },
      });
    }

    const delta = dto.type === LoyaltyType.REDEEM ? -Math.abs(dto.points) : Math.abs(dto.points);
    const newBalance = Number(account.balance) + delta;

    await this.prisma.loyaltyTransaction.create({
      data: {
        hotelId,
        accountId: account.id,
        type: dto.type as LoyaltyType,
        points: Math.abs(dto.points),
        balanceAfter: newBalance,
        description: dto.description,
        createdBy: userId,
      },
    });

    const updated = await this.prisma.loyaltyAccount.update({
      where: { id: account.id },
      data: { balance: newBalance, updatedBy: userId },
    });

    this.realtime.emitLoyaltyUpdate(hotelId, account.id);
    return updated;
  }

  async getProgram(hotelId: string) {
    return this.prisma.loyaltyProgram.findFirst({ where: { hotelId, deletedAt: null } });
  }
}
