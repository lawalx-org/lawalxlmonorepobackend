import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EmployeesActivityServices {
  constructor(private readonly prisma: PrismaService) {}

  async getEmployeesActivity(
    userId?: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 10,
    skip: number = 0,
  ) {

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }
    if (!userId) {
          throw new NotFoundException('This user is not found!');
    }
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const activities = await this.prisma.activity.findMany({
      where,
      orderBy: { timestamp: "desc"},
      take: limit, 
      skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage:true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const result = activities.map(a => ({
      id: a.id,
      timeStamp: a.timestamp,
      user: a.user?.name ?? "unknown user",
      profileImage:a.user.profileImage,
      description: a.description,
      projectName: a.project?.name ?? "unknown project",
      projectId: a.projectId,
      ipAddress: a.ipAddress,
      actionType: a.actionType,
      metadata: a.metadata,
    }));

    return { result };
  }
}
