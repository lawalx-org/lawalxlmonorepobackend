import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { buildProjectFilter } from '../utils/project-filter-builder';
import { SearchProjectByNameDto } from '../dto/search-project.dto';
import { ReminderService } from 'src/modules/notification/service/reminder';
import { NotificationService } from 'src/modules/notification/service/notification.service';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly reminderService: ReminderService,
    private readonly notificationService: NotificationService,
  ) {}

  // async create(createProjectDto: CreateProjectDto) {
  //   const { employeeIds, managerId, programId, ...projectData } =
  //     createProjectDto;

  //   const manager = await this.prisma.manager.findUnique({
  //     where: { id: managerId },
  //   });
  //   if (!manager) {
  //     throw new NotFoundException(`Manager with ID "${managerId}" not found`);
  //   }

  //   const program = await this.prisma.program.findUnique({
  //     where: { id: programId },
  //   });
  //   if (!program) {
  //     throw new NotFoundException(`Program with ID "${programId}" not found`);
  //   }

  //   if (employeeIds && employeeIds.length > 0) {
  //     const employees = await this.prisma.employee.findMany({
  //       where: {
  //         id: { in: employeeIds },
  //       },
  //     });
  //     if (employees.length !== employeeIds.length) {
  //       throw new NotFoundException('One or more employees not found.');
  //     }
  //   }

  //    const project = await this.prisma.project.create({
  //     data: {
  //       ...projectData,
  //       manager: {
  //         connect: { id: managerId },
  //       },
  //       program: {
  //         connect: { id: programId },
  //       },
  //       projectEmployees: {
  //         create: employeeIds?.map((employeeId) => ({
  //           employee: {
  //             connect: {
  //               id: employeeId,
  //             },
  //           },
  //         })),
  //       },
  //     },
  //   });

  // //   await this.reminderService.createReminder({
  // //   // ...reminderDto,
  // //   projectId: project.id,
  // // });
  //   return project;
  // }

  async create(createProjectDto: CreateProjectDto) {
    const {
      chartList,
      employeeIds,
      managerId,
      programId,
      message,
      repeatEvery,
      repeatOnDays,
      repeatOnDates,
      remindBefore,
      isActive,
      name,
      ...projectData
    } = createProjectDto;

    console.log(managerId)

    // --- Pre-validation before transaction ---
    const [manager, program] = await Promise.all([
      this.prisma.manager.findUnique({
        where: { id: managerId },
        include: { user: true },
      }),
      this.prisma.program.findUnique({ where: { id: programId } }),
    ]);

    if (!manager) {
      throw new NotFoundException(`Manager with ID "${managerId}" not found`);
    }

    if (!program) {
      throw new NotFoundException(`Program with ID "${programId}" not found`);
    }

    if (employeeIds && employeeIds.length > 0) {
      const employees = await this.prisma.employee.findMany({
        where: { id: { in: employeeIds } },
        include: { user: true },
      });

      if (employees.length !== employeeIds.length) {
        throw new NotFoundException('One or more employees not found.');
      }
    }

    // --- Main transaction ---
    const project = await this.prisma.$transaction(async (tx) => {
      // Create the new project
      const newProject = await tx.project.create({
        data: {
          ...projectData,
          name,
          manager: { connect: { id: managerId } },
          program: { connect: { id: programId } },
          projectEmployees: {
            create: employeeIds?.map((employeeId) => ({
              employee: { connect: { id: employeeId } },
            })),
          },
        },
        include: {
          manager: { include: { user: true } },
          program: true,
          projectEmployees: {
            include: { employee: { include: { user: true } } },
          },
        },
      });

      //create sheets for the project based on chartList
      if (chartList && chartList.length > 0) {
        const existingSheets = await tx.sheet.findMany({
          where: {
            projectId: newProject.id,
            chartId: { in: chartList },
          },
          select: { chartId: true },
        });

        const existingChartIds = existingSheets.map((s) => s.chartId);

        const missingChartIds = chartList.filter(
          (chartId) => !existingChartIds.includes(chartId),
        );

        if (missingChartIds.length > 0) {
          await tx.sheet.createMany({
            data: missingChartIds.map((chartId) => ({
              name: 'My Sheet',
              chartId,
              projectId: newProject.id,
            })),
          });
        }
      }

      // Create reminder linked to the new project
      await this.reminderService.createReminderWithTx(tx, {
        message,
        repeatEvery,
        repeatOnDays,
        repeatOnDates,
        remindBefore,
        isActive,
        projectId: newProject.id,
      });

      return newProject;
    });

    try {
      if (!project.manager || !project.manager.user) {
        throw new NotFoundException(
          'Manager or associated user not found for the project.',
        );
      }
      //send notification to manager and employees
      const receiverIds = [
        project.manager.user.id,
        ...(project.projectEmployees?.map((e) => {
          if (!e.employee || !e.employee.user) {
            throw new NotFoundException(
              'Employee or associated user not found for project employee record.',
            );
          }
          return e.employee.user.id;
        }) || []),
      ];

      const uniqueReceivers = [...new Set(receiverIds)];

      await this.notificationService.create(
        {
          receiverIds: uniqueReceivers,
          context: `A new project "${project.name}" has been created and assigned.`,
          type: 'PROJECT_CREATED',
        },
        project.manager.user.id,
      );

      this.logger.log(
        `Notification sent for project "${project.name}" to manager and employees.`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send project creation notifications: ${err.message}`,
      );
    }

    return project;
  }

  async findAll(query: FindAllProjectsDto) {
    const where = buildProjectFilter(query);

    if (query.limit !== 12) {
      // Return all projects if limit is not 12 or not provided
      const projects = await this.prisma.project.findMany({ where });
      return {
        data: projects,
        total: projects.length,
        page: 1,
        limit: projects.length,
      };
    }

    // Standard pagination with a limit of 12
    const { page = 1 } = query;
    const limit = 12;
    const skip = (page - 1) * limit;

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
    };
  }

  async searchByName(query: SearchProjectByNameDto) {
    const { name, page = 1, limit = 10, employeeId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      name: {
        contains: name,
        mode: 'insensitive' as const,
      },
    };

    if (employeeId) {
      where.projectEmployees = {
        some: {
          employeeId: employeeId,
        },
      };
    }

    const [projects, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }
}
