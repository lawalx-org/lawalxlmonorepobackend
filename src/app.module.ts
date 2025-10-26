import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/config.module';
import { SeedService } from './common/seed/seed.services';
import { PrismaModule } from './prisma/prisma.module';
import { StoreModule } from './common/storemodule/store.module';

@Module({
  imports: [ConfigurationModule, PrismaModule, StoreModule,],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
