import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './modules/utils/utils.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProgramModule } from './modules/program/program.module';
import { ProjectModule } from './modules/project/project.module';
import { SubmittedModule } from './modules/submitted/submitted.module';
import { ClientModule } from './modules/client/client.module';
import { EmployModule } from './modules/employ/employ.module';
import { ActivityModule } from './modules/activity/activity.module';
import { NotificationModule } from './modules/notification/notification.module';
import { RedisModule } from './common/db/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST || 'redis_cache',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
}),
    BullModule.registerQueue({ name: 'notification' }),
    PrismaModule,
    UtilsModule,
    UserModule,
    AuthModule,
    ProgramModule,
    ProjectModule,
    SubmittedModule,
    ClientModule,
    EmployModule,
    ActivityModule,
    NotificationModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
