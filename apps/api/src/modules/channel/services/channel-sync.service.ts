import { Injectable, Logger } from '@nestjs/common';
import { ChannelSyncJobType, ChannelSyncStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';
import { AvailabilityService } from '@/modules/booking/services/availability.service';
import { PricingService } from '@/modules/booking/services/pricing.service';
import { SyncQueueService } from '@/modules/channel/services/sync-queue.service';

@Injectable()
export class ChannelSyncService {
  private readonly logger = new Logger(ChannelSyncService.name);

  constructor(
    private prisma: PrismaService,
    private availability: AvailabilityService,
    private pricing: PricingService,
    private queue: SyncQueueService,
  ) {}

  /** Trigger inventory sync to all active channels */
  async syncInventory(hotelId: string, integrationId?: string) {
    const integrations = await this.getActiveIntegrations(hotelId, integrationId);
    const jobs = [];

    for (const integration of integrations) {
      const job = await this.queue.enqueue({
        hotelId,
        integrationId: integration.id,
        jobType: ChannelSyncJobType.INVENTORY,
        priority: 1,
      });
      jobs.push(job);
      await this.processInventorySync(hotelId, integration.id, job.id);
    }

    return { queued: jobs.length, jobs };
  }

  /** Trigger rate sync to all active channels */
  async syncRates(hotelId: string, integrationId?: string, daysAhead = 90) {
    const integrations = await this.getActiveIntegrations(hotelId, integrationId);
    const jobs = [];

    for (const integration of integrations) {
      const job = await this.queue.enqueue({
        hotelId,
        integrationId: integration.id,
        jobType: ChannelSyncJobType.RATES,
        payload: { daysAhead },
        priority: 2,
      });
      jobs.push(job);
      await this.processRateSync(hotelId, integration.id, job.id, daysAhead);
    }

    return { queued: jobs.length, jobs };
  }

  async processInventorySync(hotelId: string, integrationId: string, jobId?: string) {
    const mappings = await this.prisma.channelMapping.findMany({
      where: { hotelId, integrationId, isActive: true, deletedAt: null },
      include: { roomType: true, integration: true },
    });

    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    const availabilityPayload = [];
    for (const mapping of mappings) {
      let available = 0;
      for (let d = new Date(today); d < endDate; d.setDate(d.getDate() + 1)) {
        const next = new Date(d);
        next.setDate(next.getDate() + 1);
        available = await this.availability.getAvailableCount(hotelId, mapping.roomTypeId, d, next);
        availabilityPayload.push({
          date: d.toISOString().split('T')[0],
          roomTypeId: mapping.roomTypeId,
          externalRoomCode: mapping.externalRoomCode,
          available,
        });
      }
    }

    const log = await this.prisma.channelSyncLog.create({
      data: {
        hotelId,
        integrationId,
        jobId,
        syncType: ChannelSyncJobType.INVENTORY,
        status: ChannelSyncStatus.SYNCED,
        message: `Synced inventory for ${mappings.length} room mappings`,
        payload: { days: 90, mappings: mappings.length },
        response: { availability: availabilityPayload.slice(0, 30) },
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    await this.prisma.otaIntegration.update({
      where: { id: integrationId },
      data: { lastSyncAt: new Date(), status: 'ACTIVE', syncError: null },
    });

    await this.prisma.channelMapping.updateMany({
      where: { integrationId },
      data: { syncStatus: ChannelSyncStatus.SYNCED, lastSyncAt: new Date() },
    });

    this.logger.log(`Inventory sync complete for integration ${integrationId}`);
    return log;
  }

  async processRateSync(hotelId: string, integrationId: string, jobId?: string, daysAhead = 90) {
    const rateMappings = await this.prisma.channelRatePlanMapping.findMany({
      where: { hotelId, integrationId, isActive: true },
      include: { ratePlan: true, integration: true },
    });

    const ratesPayload = [];
    const checkIn = new Date();
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 1);

    for (const mapping of rateMappings) {
      const plans = await this.pricing.getRatePlansForRoom(
        hotelId,
        mapping.ratePlan.roomTypeId,
        checkIn,
        checkOut,
        1,
      );
      ratesPayload.push({
        externalRateCode: mapping.externalRateCode,
        ratePlanId: mapping.ratePlanId,
        rates: plans,
      });
    }

    const log = await this.prisma.channelSyncLog.create({
      data: {
        hotelId,
        integrationId,
        jobId,
        syncType: ChannelSyncJobType.RATES,
        status: ChannelSyncStatus.SYNCED,
        message: `Synced rates for ${rateMappings.length} rate plan mappings`,
        payload: { daysAhead },
        response: { rates: ratesPayload },
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    await this.prisma.otaIntegration.update({
      where: { id: integrationId },
      data: { lastSyncAt: new Date() },
    });

    return log;
  }

  /** Called when ERP inventory changes — fan out to all channels */
  async onInventoryChanged(hotelId: string, reason: string) {
    this.logger.log(`Inventory changed: ${reason} — queuing channel sync`);
    return this.syncInventory(hotelId);
  }

  private async getActiveIntegrations(hotelId: string, integrationId?: string) {
    return this.prisma.otaIntegration.findMany({
      where: {
        hotelId,
        isActive: true,
        deletedAt: null,
        status: { in: ['ACTIVE', 'SYNCING'] },
        ...(integrationId ? { id: integrationId } : {}),
        provider: { not: 'DIRECT_WEBSITE' },
      },
    });
  }
}
