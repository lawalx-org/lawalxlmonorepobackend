import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Gateway } from './service/notification.getway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/common/db/redis/services/redis.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt_expires_in') || '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, Gateway, RedisService],
})
export class NotificationModule {}
