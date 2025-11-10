import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { buildProjectFilter } from '../utils/project-filter-builder';
import { SearchProjectByNameDto } from '../dto/search-project.dto';
import { ReminderService } from 'src/modules/notification/service/reminder';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reminderService: ReminderService, 
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { employeeIds, managerId, programId, ...projectData } =
      createProjectDto;

    const manager = await this.prisma.manager.findUnique({
      where: { id: managerId },
    });
    if (!manager) {
      throw new NotFoundException(`Manager with ID "${managerId}" not found`);
    }

    const program = await this.prisma.program.findUnique({
      where: { id: programId },
    });
    if (!program) {
      throw new NotFoundException(`Program with ID "${programId}" not found`);
    }

    if (employeeIds && employeeIds.length > 0) {
      const employees = await this.prisma.employee.findMany({
        where: {
          id: { in: employeeIds },
        },
      });
      if (employees.length !== employeeIds.length) {
        throw new NotFoundException('One or more employees not found.');
      }
    }

     const project = await this.prisma.project.create({
      data: {
        ...projectData,
        manager: {
          connect: { id: managerId },
        },
        program: {
          connect: { id: programId },
        },
        projectEmployees: {
          create: employeeIds?.map((employeeId) => ({
            employee: {
              connect: {
                id: employeeId,
              },
            },
          })),
        },
      },
    });

    await this.reminderService.createReminder({
    // ...reminderDto,
    projectId: project.id,
  });
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
