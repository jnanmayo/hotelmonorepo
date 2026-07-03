import { Injectable } from '@nestjs/common';
import { ChannelSyncJobStatus, ChannelSyncJobType } from '@prisma/client';

import { PrismaService } from '@/infrastructure/database/prisma.service';

/**
 * Sync queue — DB-backed jobs with BullMQ integration point.
 * Wire BullMQ workers to processChannelSyncJob() for horizontal scaling.
 */
@Injectable()
export class SyncQueueService {
  constructor(private prisma: PrismaService) {}

  async enqueue(params: {
    hotelId: string;
    integrationId?: string;
    jobType: ChannelSyncJobType;
    payload?: Record<string, unknown>;
    priority?: number;
  }) {
    return this.prisma.channelSyncJob.create({
      data: {
        hotelId: params.hotelId,
        integrationId: params.integrationId,
        jobType: params.jobType,
        priority: params.priority ?? 5,
        payload: (params.payload ?? {}) as object,
        status: ChannelSyncJobStatus.PENDING,
      },
    });
  }

  async processNextBatch(limit = 10) {
    const jobs = await this.prisma.channelSyncJob.findMany({
      where: {
        status: { in: [ChannelSyncJobStatus.PENDING, ChannelSyncJobStatus.RETRYING] },
        scheduledAt: { lte: new Date() },
      },
      orderBy: [{ priority: 'asc' }, { scheduledAt: 'asc' }],
      take: limit,
    });

    const results = [];
    for (const job of jobs) {
      results.push(await this.processJob(job.id));
    }
    return results;
  }

  async processJob(jobId: string, processor?: (jobId: string) => Promise<void>) {
    const job = await this.prisma.channelSyncJob.update({
      where: { id: jobId },
      data: { status: ChannelSyncJobStatus.PROCESSING, startedAt: new Date(), attempts: { increment: 1 } },
    });

    try {
      if (processor) await processor(jobId);
      await this.prisma.channelSyncJob.update({
        where: { id: jobId },
        data: { status: ChannelSyncJobStatus.COMPLETED, completedAt: new Date() },
      });
      return { jobId, status: 'COMPLETED' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed';
      const failed = job.attempts + 1 >= job.maxAttempts;
      await this.prisma.channelSyncJob.update({
        where: { id: jobId },
        data: {
          status: failed ? ChannelSyncJobStatus.DEAD_LETTER : ChannelSyncJobStatus.RETRYING,
          lastError: message,
          scheduledAt: failed ? job.scheduledAt : new Date(Date.now() + job.attempts * 60_000),
        },
      });
      return { jobId, status: failed ? 'DEAD_LETTER' : 'RETRYING', error: message };
    }
  }

  async retryJob(jobId: string) {
    return this.prisma.channelSyncJob.update({
      where: { id: jobId },
      data: {
        status: ChannelSyncJobStatus.PENDING,
        scheduledAt: new Date(),
        lastError: null,
      },
    });
  }

  async getPendingCount(hotelId: string) {
    return this.prisma.channelSyncJob.count({
      where: {
        hotelId,
        status: { in: [ChannelSyncJobStatus.PENDING, ChannelSyncJobStatus.RETRYING, ChannelSyncJobStatus.PROCESSING] },
      },
    });
  }
}
