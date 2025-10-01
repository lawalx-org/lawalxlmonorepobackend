import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/config.module';
import { StoreModule } from './config/store.module';
import { SeedService } from './common/seed/seed.services';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigurationModule,
    PrismaModule ,
    StoreModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
