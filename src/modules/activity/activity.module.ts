import { Module } from '@nestjs/common';
import { ActivityController } from './controller/activity.controller';
import { ActivityService } from './service/activity.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule,NotificationModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
