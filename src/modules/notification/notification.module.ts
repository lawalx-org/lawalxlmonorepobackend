import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
