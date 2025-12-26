import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { buildProjectFilter } from '../utils/project-filter-builder';
import { SearchProjectByNameDto } from '../dto/search-project.dto';
import { ReminderService } from 'src/modules/notification/service/reminder';
import { NotificationService } from 'src/modules/notification/service/notification.service';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { UpdateProjectStatusDto } from '../dto/update-project-status.dto';
import { NotificationType } from 'src/modules/notification/dto/create-notification.dto';
import { slugify } from 'src/modules/infrastructure/functions';
import { InfrastructureRepository } from 'src/modules/infrastructure/infrastructure.repository';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly reminderService: ReminderService,
    private readonly notificationService: NotificationService,
    private readonly infrastructureRepo: InfrastructureRepository,
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
      // ============= SABBIR ================ //
      // brefore creating our post just check with slug
      if (!name) throw new BadRequestException('Project name is required');

      const slug = slugify(name);
      if (await this.infrastructureRepo.findByProjectSlug(slug)) {
        throw new ConflictException('Project slug already exists');
      }
      // ============== SABBIR =============== //
      // Create the new project
      const newProject = await tx.project.create({
        data: {
          ...projectData,
          name,
          // ============== SABBIR =============== //
          slug,
          computedProgress: createProjectDto.computedProgress ?? 0,
          progress: createProjectDto.progress ?? 0,
          metadata: {},
          // ============== SABBIR =============== //

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
          type: NotificationType.NEW_EMPLOYEE_ASSIGNED,
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

  //get sheet with project id
  async getSheets(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project)
      throw new NotFoundException(`Project with ID ${projectId}not found`);

    const sheets = await this.prisma.sheet.findMany({
      where: {
        projectId,
      },
    });

    return sheets;
  }

  //   async updateProjectStatus(updateProjectStatusDto: UpdateProjectStatusDto) {
  //   const { projectId, status } = updateProjectStatusDto;

  //   const existingProject = await this.prisma.project.findUnique({
  //     where: { id: projectId },
  //   });

  //   if (!existingProject) {
  //     throw new NotFoundException(`Project with ID "${projectId}" not found`);
  //   }

  //   const updatedProject = await this.prisma.project.update({
  //     where: { id: projectId },
  //     data: { status },
  //   });

  //   return updatedProject;
  // }

  async updateProjectStatus(updateProjectStatusDto: UpdateProjectStatusDto) {
    const { projectId, status } = updateProjectStatusDto;

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        manager: {
          include: {
            user: true,
          },
        },
        projectEmployees: {
          include: {
            employee: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    if (status === 'LIVE') {
      const managerUserId = project.manager?.user?.id;
      if (!managerUserId) {
        throw new NotFoundException('Manager or associated user not found');
      }

      const employeeUserIds = project.projectEmployees
        .map((e) => e.employee?.user?.id)
        .filter((id): id is string => !!id);

      const receiverIds = [...new Set([managerUserId, ...employeeUserIds])];

      await this.notificationService.create(
        {
          receiverIds,
          context: `Project ${project.name} is now LIVE.`,
          type: NotificationType.PROJECT_STATUS_UPDATE,
        },
        managerUserId,
      );
    }

    return updatedProject;
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        manager: true,
      },
    });
    console.log('project: ', project);

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    const removeIds = dto.removeEmployeeIds || [];
    const addIds = dto.addEmployeeIds || [];

    const updatedProject = await this.prisma.$transaction(async (prisma) => {
      // Remove non-relation fields
      const projectData: any = { ...dto };
      delete projectData.addEmployeeIds;
      delete projectData.removeEmployeeIds;

      //  Check if managerId exists
      if (dto.managerId) {
        const managerExists =
          (await this.prisma.manager.findUnique({
            where: { id: dto.managerId },
          })) ||
          (await this.prisma.user.findUnique({
            where: {
              id: dto.managerId,
            },
          }));

        console.log('managerExists: ', managerExists);

        if (!managerExists) {
          throw new NotFoundException(
            `Manager with ID "${dto.managerId}" does not exist`,
          );
        }
      }

      // Update project main fields
      const updated = await prisma.project.update({
        where: { id },
        data: projectData,
      });

      if (removeIds.length > 0) {
        await prisma.projectEmployee.deleteMany({
          where: {
            projectId: id,
            employeeId: { in: removeIds },
          },
        });
      }
      if (addIds.length > 0) {
        await prisma.projectEmployee.createMany({
          data: addIds.map((employeeId) => ({
            projectId: id,
            employeeId,
          })),
          skipDuplicates: true,
        });
      }

      return updated;
    });

    return updatedProject;
  }

  async deleteProject(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        sheets: true,
        projectEmployees: true,
        tasks: true,
        activities: true,
      },
    });

    if (!project)
      throw new NotFoundException(`Project with ID "${id}" not found`);

    const sheetIds = project.sheets?.map((s: { id: string }) => s.id) || [];
    const employeeIds =
      project.projectEmployees?.map((e: { id: string }) => e.id) || [];
    const taskIds = project.tasks?.map((t: { id: string }) => t.id) || [];
    const activityIds =
      project.activities?.map((a: { id: string }) => a.id) || [];

    if (
      sheetIds.length ||
      employeeIds.length ||
      taskIds.length ||
      activityIds.length
    ) {
      const errors: string[] = [];
      if (sheetIds.length) errors.push(`sheets (${sheetIds.join(', ')})`);
      if (employeeIds.length)
        errors.push(`employees (${employeeIds.join(', ')})`);
      if (taskIds.length) errors.push(`tasks (${taskIds.join(', ')})`);
      if (activityIds.length)
        errors.push(`activities (${activityIds.join(', ')})`);

      throw new BadRequestException(
        `Cannot delete project. There are related: ${errors.join(', ')}.`,
      );
    }

    await this.prisma.project.delete({ where: { id } });

    return {
      message: `Project with ID "${id}" has been deleted successfully.`,
    };
  }
}
