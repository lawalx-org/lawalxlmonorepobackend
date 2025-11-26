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
import { ChartModule } from './modules/chart/chart.module';
import { ManagerModule } from './modules/manager/manager.module';
import { SeedService } from './common/seed/seed.services';
import { Client_Dash_stakeModule } from './modules/client_dashboard-stack/client.dashboard.stack.module';
import { project_status_stackModule } from './modules/project_status/project.status.module';
import { project_timelineModule } from './modules/project_timeline/project-timeline.module';
import { employees_activityModule } from './modules/employees_activity/employees_activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
        };
      },
      inject: [ConfigService],
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
    ManagerModule,
    ActivityModule,
    NotificationModule,
    RedisModule,
    ChartModule,
    Client_Dash_stakeModule,
    project_status_stackModule,
    project_timelineModule,
    employees_activityModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, SeedService],
})
export class AppModule {}
