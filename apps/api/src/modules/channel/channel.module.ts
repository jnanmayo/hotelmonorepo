import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { BookingModule } from '@/modules/booking/booking.module';
import { ChannelController } from '@/modules/channel/channel.controller';
import { PublicChannelWebhookController } from '@/modules/channel/public-channel-webhook.controller';
import { ChannelService } from '@/modules/channel/services/channel.service';
import { ChannelSyncService } from '@/modules/channel/services/channel-sync.service';
import { ChannelWebhookService } from '@/modules/channel/services/channel-webhook.service';
import { SyncQueueService } from '@/modules/channel/services/sync-queue.service';

@Module({
  imports: [BookingModule],
  controllers: [ChannelController, PublicChannelWebhookController],
  providers: [
    ChannelService,
    ChannelSyncService,
    ChannelWebhookService,
    SyncQueueService,
    PermissionsGuard,
  ],
  exports: [ChannelService, ChannelSyncService, SyncQueueService],
})
export class ChannelModule {}
