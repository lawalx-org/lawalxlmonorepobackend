import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Gateway } from './notification.getway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationGateWay: Gateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, senderId: string) {
    const { receiverIds, context, type } = createNotificationDto;

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: receiverIds,
        },
      },
    });

    if (users.length !== receiverIds.length) {
      throw new NotFoundException('One or more receivers not found');
    }

    const notification = await this.prisma.notification.create({
      data: {
        senderId,
        receiverIds,
        context,
        type,
        provisions: {
          create: receiverIds.map((userId) => ({
            user: {
              connect: { id: userId },
            },
          })),
        },
      },
      include: {
        provisions: true,
      },
    });
    await this.notificationGateWay.emitToUsers(receiverIds, type, notification);
    return notification;
  }

  async findAll(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        provisions: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }

  async findSentNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        senderId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }
}
