import { Module } from '@nestjs/common';

import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { CmsController } from '@/modules/website/cms.controller';
import { PublicWebsiteController } from '@/modules/website/public-website.controller';
import { WebsiteService } from '@/modules/website/website.service';

@Module({
  controllers: [PublicWebsiteController, CmsController],
  providers: [WebsiteService, PermissionsGuard],
  exports: [WebsiteService],
})
export class WebsiteModule {}
