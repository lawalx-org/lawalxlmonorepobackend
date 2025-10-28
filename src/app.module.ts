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
import { ChartModule } from './modules/chart/chart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
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
    ChartModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}

