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

 async findAllWithFilters(dto: Record<string, any>) {
    const where = buildDynamicPrismaFilter(dto);
    return this.prisma.user.findMany({ where });
  }

}






