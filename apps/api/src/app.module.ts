import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { appConfig } from '@/config/app.config';
import { authConfig } from '@/config/auth.config';
import { databaseConfig } from '@/config/database.config';
import { redisConfig } from '@/config/redis.config';
import { storageConfig } from '@/config/storage.config';
import { validateEnv } from '@/config/env.validation';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { BookingModule } from '@/modules/booking/booking.module';
import { ChannelModule } from '@/modules/channel/channel.module';
import { FrontDeskModule } from '@/modules/front-desk/front-desk.module';
import { PmsModule } from '@/modules/pms/pms.module';
import { GxpModule } from '@/modules/gxp/gxp.module';
import { HousekeepingModule } from '@/modules/housekeeping/housekeeping.module';
import { InventoryModule } from '@/modules/inventory/inventory.module';
import { ProcurementModule } from '@/modules/procurement/procurement.module';
import { MaintenanceModule } from '@/modules/maintenance/maintenance.module';
import { FinanceModule } from '@/modules/finance/finance.module';
import { CorpSalesModule } from '@/modules/corp-sales/corp-sales.module';
import { CrmModule } from '@/modules/crm/crm.module';
import { EventsModule } from '@/modules/events/events.module';
import { TravelDeskModule } from '@/modules/travel-desk/travel-desk.module';
import { CommandCenterModule } from '@/modules/command-center/command-center.module';
import { HrModule } from '@/modules/hr/hr.module';
import { RestaurantModule } from '@/modules/restaurant/restaurant.module';
import { RoomsModule } from '@/modules/rooms/rooms.module';
import { WebsiteModule } from '@/modules/website/website.module';
import { EmailModule } from './modules/email/email.module';
import { emailConfig } from '@/config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, redisConfig, storageConfig, emailConfig],
      validate: validateEnv,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    WebsiteModule,
    BookingModule,
    ChannelModule,
    PmsModule,
    FrontDeskModule,
    RoomsModule,
    HousekeepingModule,
    RestaurantModule,
    InventoryModule,
    ProcurementModule,
    MaintenanceModule,
    FinanceModule,
    HrModule,
    CrmModule,
    CorpSalesModule,
    EventsModule,
    TravelDeskModule,
    CommandCenterModule,
    GxpModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
