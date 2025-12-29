import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Gateway } from './notification.getway';
import { UpdateEmployeeNotificationDto } from '../dto/update-employee-notification.dto';
import { UpdateManagerNotificationDto } from '../dto/update-manager-notification.dto';
import { UpdateClientNotificationDto } from '../dto/update-client-notification.dto';
import { Role } from 'generated/prisma';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationGateWay: Gateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, senderId: string) {
    const { receiverIds, context, type, projectId } = createNotificationDto;

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
    let notification;
    if (projectId) {
      notification = await this.prisma.notification.create({
        data: {
          senderId,
          projectId,
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
    } else {
      notification = await this.prisma.notification.create({
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
    }

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

  // ================= EMPLOYEE =================
  async updateEmployeePermission(
    userId: string,
    dto: UpdateEmployeeNotificationDto,
  ) {
    return this.prisma.notificationPermissionEmployee.update({
      where: { userId },
      data: dto,
    });
  }

  // ================= MANAGER =================
  async updateManagerPermission(
    userId: string,
    dto: UpdateManagerNotificationDto,
  ) {
    return this.prisma.notificationPermissionManager.update({
      where: { userId },
      data: dto,
    });
  }

  // // ================= CLIENT =================
  // async updateClientPermission(
  //   userId: string,
  //   dto: UpdateClientNotificationDto,
  // ) {
  //   return this.prisma.notificationPermissionClient.update({
  //     where: { userId },
  //     data: dto,
  //   });
  // ================= CLIENT =================
  async updateClientPermission(
    id: string,
    dto: UpdateClientNotificationDto,
  ) {
    // 1️⃣ Check if the user exists
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

  

    if (!existing) {
      throw new Error(`Notification settings for user ${id} not found`);
    }

    // 2️⃣ Update if exists
    return this.prisma.notificationPermissionClient.update({
      where: { userId: id },
      data: dto,
    });
  }

  async getMyNotificationPermissions(userId: string, role: Role) {
    switch (role) {
      case Role.EMPLOYEE:
        return this.findOrFail(
          this.prisma.notificationPermissionEmployee.findUnique({
            where: { userId },
          }),
        );

      case Role.MANAGER:
        return this.findOrFail(
          this.prisma.notificationPermissionManager.findUnique({
            where: { userId },
          }),
        );

      case Role.CLIENT:
        return this.findOrFail(
          this.prisma.notificationPermissionClient.findUnique({
            where: { userId },
          }),
        );

      case Role.SUPPORTER:
        return this.findOrFail(
          this.prisma.notificationPermissionSupporter.findUnique({
            where: { userId },
          }),
        );

      case Role.ADMIN:
        return this.findOrFail(
          this.prisma.notificationPermissionAdmin.findUnique({
            where: { userId },
          }),
        );

      default:
        throw new NotFoundException('Invalid user role');
    }
  }

  private async findOrFail<T>(query: Promise<T | null>): Promise<T> {
    const result = await query;
    if (!result) {
      throw new NotFoundException('Notification permissions not found');
    }
    return result;
  }
}
