import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

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

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly cloudinary: CloudinaryService
  ) {}

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

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
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

  async update(id: string, updateUserDto: UpdateUserDto) {
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

}
