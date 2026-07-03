import { Body, Controller, Headers, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@/common/decorators/auth.decorators';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { ChannelWebhookService, type OtaWebhookPayload } from '@/modules/channel/services/channel-webhook.service';

@ApiTags('Channel Webhooks')
@Controller('public/channels')
export class PublicChannelWebhookController {
  constructor(
    private webhooks: ChannelWebhookService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Post('webhook/:provider')
  async receiveWebhook(
    @Param('provider') provider: string,
    @Query('hotelSlug') hotelSlug = 'tunga-international',
    @Body() body: OtaWebhookPayload,
    @Headers('x-webhook-signature') _signature?: string,
  ) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug: hotelSlug, isActive: true, deletedAt: null },
    });
    if (!hotel) return { success: false, error: 'Hotel not found' };

    const result = await this.webhooks.handleWebhook(hotel.id, provider.toUpperCase(), body, body);
    return { data: result };
  }
}
