import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/modules/utils/services/cloudinary.service';
import { uploadImageAndDto } from '../dto/updatefile.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UploadApiResponse } from 'cloudinary';
import { buildDynamicPrismaFilter } from 'src/modules/utils/queryBuilder/prisma-filter-builder';
import { Role } from 'generated/prisma';
import { ConvertEmployeeToManagerDto } from '../dto/convert-employee-to-manager.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  paginate,
  PaginatedResult,
} from 'src/modules/utils/pagination/pagination.utils';
import { deleteProfileImage } from 'src/modules/utils/file.utils';
import { mapUserWithAssignedProjects } from '../dto/user.mapper';
import { ReplaceUserProjectDto } from '../dto/userUpdateAssignProject.Dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly cloudinary: CloudinaryService,
  ) { }

  async uploadMultipleImages(files: Express.Multer.File[]) {
    const results: UploadApiResponse[] = [];

    for (const file of files) {
      try {
        const res: UploadApiResponse = await this.cloudinary.uploadFile(file);
        results.push(res);
      } catch (error) {
        console.error(`Failed to upload image ${file.originalname}:`, error);
      }
    }

    return {
      message: 'Multiple images uploaded',
      files: results,
    };
  }

  async uploadSingleImage(file: Express.Multer.File) {
    try {
      const result = await this.cloudinary.uploadFile(file);
      return {
        message: 'Single image uploaded',
        file: result,
      };
    } catch (error) {
      console.error('Upload single image failed:', error);
      throw error;
    }
  }

  async findAll(
    query: { page: number; limit: number } = { page: 1, limit: 10 },
  ) {
    const users = await paginate<any>(
      this.prisma,
      'user',
      {
        include: {
          manager: {
            include: {
              projects: {
                select: { id: true, name: true },
              },
            },
          },
          employee: {
            include: {
              projectEmployees: {
                include: {
                  project: {
                    select: { id: true, name: true },
                  },
                },
              },
            },
          },
          viewer: true,
        },
      },
      {
        page: query.page,
        limit: query.limit,
      },
    );

    // Collect viewer project IDs
    const viewerProjectIds = users.data.flatMap(
      (u: any) => u.viewer?.projectId || [],
    );

    // Fetch viewer projects
    const viewerProjects = viewerProjectIds.length
      ? await this.prisma.project.findMany({
        where: { id: { in: viewerProjectIds } },
        select: { id: true, name: true },
      })
      : [];

    const viewerProjectMap = new Map(
      viewerProjects.map(p => [p.id, p]),
    );

    users.data = users.data.map(user =>
      mapUserWithAssignedProjects(user, viewerProjectMap),
    );

    return users;
  }



  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const { password, ...result } = user;
    return result;
  }



  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }


    const { password, ...safeUser } = user;
    return safeUser;
  }




  async update(id: string, updateUserDto: UpdateUserDto) {

    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.profileImage && userExists.profileImage && updateUserDto.profileImage !== userExists.profileImage) {
      deleteProfileImage(userExists.profileImage);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });


    const { password, ...result } = user;
    return result;
  }


  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    const { password, ...result } = user;
    return result;
  }

  // async convertEmployeeToManager(employeeId: string, dto: ConvertEmployeeToManagerDto) {
  //   return this.prisma.$transaction(async (prisma) => {
  //     const user = await prisma.user.findUnique({
  //       where: { id: employeeId },
  //       include: { employee: true },
  //     });

  //     if (!user || !user.employee) {
  //       throw new BadRequestException(`User with ID "${employeeId}" is not a valid employee.`);
  //     }

  //     await prisma.employee.delete({ where: { userId: employeeId } });

  //     const manager = await prisma.manager.create({
  //       data: {
  //         userId: employeeId,
  //         description:dto.
  //         skills: dto.skills || [],
  //       },
  //     });

  //     const updatedUser = await prisma.user.update({
  //       where: { id: employeeId },
  //       data: { role: Role.MANAGER },
  //     });

  //     const { password, ...userWithoutPassword } = updatedUser;

  //     return {
  //       ...manager,
  //       user: userWithoutPassword,
  //     };
  //   });
  // }

  async findAllWithFilters(dto: Record<string, any>) {
    const where = buildDynamicPrismaFilter(dto);
    return this.prisma.user.findMany({ where });
  }

async replaceUserProject(dto: ReplaceUserProjectDto) {
    const { oldProjectId, newProjectId, userId } = dto;

    // 1️⃣ Check user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // 2️⃣ Determine user role and related table
    switch (user.role) {
      case 'EMPLOYEE':
        await this.replaceEmployeeProject(userId, oldProjectId, newProjectId);
        break;

      case 'MANAGER':
        await this.replaceManagerProject(userId, oldProjectId, newProjectId);
        break;

      case 'VIEWER':
        await this.replaceViewerProject(userId, oldProjectId, newProjectId);
        break;

      default:
        throw new BadRequestException('Unsupported user role');
    }

    return { success: true, message: 'Project reassigned successfully' };
  }

  // Employee project reassignment
  private async replaceEmployeeProject(
    userId: string,
    oldProjectId: string,
    newProjectId: string,
  ) {
    const employee = await this.prisma.employee.findUnique({ where: { userId } });
    if (!employee) throw new BadRequestException('User is not an employee');

    const assignment = await this.prisma.projectEmployee.findUnique({
      where: { projectId_employeeId: { projectId: oldProjectId, employeeId: employee.id } },
    });
    if (!assignment) throw new BadRequestException('Employee not assigned to old project');

    // Remove old assignment
    await this.prisma.projectEmployee.delete({
      where: { projectId_employeeId: { projectId: oldProjectId, employeeId: employee.id } },
    });

    // Assign new project (avoid duplicate)
    await this.prisma.projectEmployee.upsert({
      where: { projectId_employeeId: { projectId: newProjectId, employeeId: employee.id } },
      create: { projectId: newProjectId, employeeId: employee.id },
      update: {},
    });
  }

  // Manager project reassignment
  private async replaceManagerProject(
    userId: string,
    oldProjectId: string,
    newProjectId: string,
  ) {
    const manager = await this.prisma.manager.findUnique({ where: { userId } });
    if (!manager) throw new BadRequestException('User is not a manager');

    const oldProject = await this.prisma.project.findUnique({ where: { id: oldProjectId } });
    if (!oldProject) throw new BadRequestException('Old project not found');

    if (oldProject.managerId !== manager.id)
      throw new BadRequestException('Manager is not assigned to old project');

    // Reassign new project
    await this.prisma.project.update({
      where: { id: newProjectId },
      data: { managerId: manager.id },
    });
  }

  // Viewer project reassignment
  private async replaceViewerProject(
    userId: string,
    oldProjectId: string,
    newProjectId: string,
  ) {
    const viewer = await this.prisma.viewer.findUnique({ where: { userId } });
    if (!viewer) throw new BadRequestException('User is not a viewer');

    if (!viewer.projectId.includes(oldProjectId))
      throw new BadRequestException('Viewer not assigned to old project');

    // Remove old project and add new project
    const updatedProjects = viewer.projectId
      .filter((id) => id !== oldProjectId)
      .concat(newProjectId);

    await this.prisma.viewer.update({
      where: { id: viewer.id },
      data: { projectId: updatedProjects },
    });
  }






}
