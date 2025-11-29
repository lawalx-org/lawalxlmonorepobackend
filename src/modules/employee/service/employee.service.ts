import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmployeeFilterDto } from '../dto/employee-filter.dto';
import { EmployeeTaskFilterDto } from '../dto/employee-task-filter.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { BulkDeleteDto } from '../dto/bulk-delete.dto';
import { Prisma } from 'generated/prisma';
import { NotificationService } from 'src/modules/notification/service/notification.service';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
      private readonly notificationService: NotificationService
  ) { }

  async findAll(filters: EmployeeFilterDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      joinedDateFrom,
      joinedDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {
      ...(search && {
        user: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
      ...(status && { user: { userStatus: status } }),
      ...(joinedDateFrom &&
        joinedDateTo && {
        joinedDate: {
          gte: joinedDateFrom,
          lte: joinedDateTo,
        },
      }),
    };

    const orderBy: Prisma.EmployeeOrderByWithRelationInput =
      sortBy === 'name' || sortBy === 'email'
        ? { user: { [sortBy]: sortOrder } }
        : { [sortBy]: sortOrder };

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              role: true,
              profileImage: true,
              status: true,
              userStatus: true,
              createdAt: true,
            },
          },
          projectEmployees: {
            include: {
              project: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: true,
            profileImage: true,
            status: true,
            userStatus: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        projectEmployees: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    const taskStats = await this.getTaskStatistics(id);

    return {
      ...employee,
      statistics: taskStats,
    };
  }

  async update(id: string, updateDto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    const {
      name,
      email,
      phoneNumber,
      joinedDate,
      skills,
      description,
      profileImage,
      userStatus,
    } = updateDto;

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: {
        ...(joinedDate && { joinedDate }),
        ...(skills && { skills }),
        ...(description && { description }),
        user: {
          update: {
            ...(name && { name }),
            ...(email && { email }),
            ...(phoneNumber && { phoneNumber }),
            ...(profileImage && { profileImage }),
            ...(userStatus && { userStatus }),
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            role: true,
            profileImage: true,
            status: true,
            userStatus: true,
          },
        },
      },
    });

    return {
      message: 'Employee updated successfully',
      data: updatedEmployee,
    };
  }

  async remove(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    await this.prisma.employee.delete({
      where: { id },
    });

    return {
      message: 'Employee deleted successfully',
    };
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    const { employeeIds } = bulkDeleteDto;

    const result = await this.prisma.employee.deleteMany({
      where: {
        id: { in: employeeIds },
      },
    });

    return {
      message: `${result.count} employee(s) deleted successfully`,
      deletedCount: result.count,
    };
  }

  async getEmployeeTasks(employeeId: string, filters: EmployeeTaskFilterDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${employeeId}" not found`);
    }

    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      projectId,
      dueDateFrom,
      dueDateTo,
      progressMin,
      progressMax,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      assignedTo: employeeId,
      assigneeType: 'EMPLOYEE',
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(status && { status }),
      ...(priority && { project: { priority } }),
      ...(projectId && { projectId }),
      ...(dueDateFrom &&
        dueDateTo && {
        dueDate: {
          gte: dueDateFrom,
          lte: dueDateTo,
        },
      }),
      ...(progressMin !== undefined &&
        progressMax !== undefined && {
        progress: {
          gte: progressMin,
          lte: progressMax,
        },
      }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              priority: true,
              status: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.task.count({ where }),
    ]);

    const statistics = await this.getTaskStatistics(employeeId);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      statistics,
    };
  }

  async getTaskStatistics(employeeId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        assignedTo: employeeId,
        assigneeType: 'EMPLOYEE',
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            priority: true,
          },
        },
      },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === 'INPROGRESS',
    ).length;
    const overdueTasks = tasks.filter((t) => t.status === 'OVERDUE').length;
    const notStartedTasks = tasks.filter((t) => t.status === 'NOSTART').length;

    const averageProgress =
      totalTasks > 0
        ? tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / totalTasks
        : 0;

    const tasksByPriority = {
      high: tasks.filter((t) => t.project.priority === 'HIGH').length,
      medium: tasks.filter((t) => t.project.priority === 'MEDIUM').length,
      low: tasks.filter((t) => t.project.priority === 'LOW').length,
    };

    const projectMap = new Map<string, { name: string; count: number }>();
    tasks.forEach((task) => {
      const existing = projectMap.get(task.project.id);
      if (existing) {
        existing.count++;
      } else {
        projectMap.set(task.project.id, {
          name: task.project.name,
          count: 1,
        });
      }
    });

    const tasksByProject = Array.from(projectMap.entries()).map(
      ([projectId, data]) => ({
        projectId,
        projectName: data.name,
        taskCount: data.count,
      }),
    );

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      notStartedTasks,
      averageProgress: Math.round(averageProgress),
      tasksByPriority,
      tasksByProject,
    };
  }

  async changeStatus(id: string, userStatus: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    const updated = await this.prisma.employee.update({
      where: { id },
      data: {
        user: {
          update: {
            userStatus: userStatus as any,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return {
      message: 'Employee status updated successfully',
      data: updated,
    };
  }

  //notification notified 
  async reqSheetUpdate(employeeId: string, projectId?: string) {

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },

    });

    if (!employee)  throw new NotFoundException(`employee with ID ${employeeId}not found`);


    const managers = await this.prisma.user.findMany({
      where: { role: 'MANAGER' },
      select: { id: true },
    });

    if (managers.length === 0)  throw new ConflictException('no managers found  receive the request');

    const receiverIds = managers.map((m) => m.id);

    let sendingList ;
    console.log('Sending notification to:', receiverIds);
    if (receiverIds.length) {
       sendingList = await this.notificationService.create(
        
        {
          receiverIds,
          context: `Employee ${employee.id} requested a sheet update.`,
        type: 'SHEET_UPDATE_REQUEST',
        projectId,
        },
        employee.id,
      );
    }
    console.log('Notification result:', sendingList);

    

    return {
      message: 'Sheet update request sent successfully',
       sendingList,
    };
  }

}
// checks employee exists and has a linked user account.
// collects all managers as notification receivers.
// Creates a notification with sender = employee user ID.
// Saves notification + context message (“employee requested sheet update”).
// Creates notification-provision records for each manager.
// Returns success message and notification data.