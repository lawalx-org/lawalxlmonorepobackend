import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateDto } from '../dto/create-template.dto';

@Injectable()
export class ProgramBuilderTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateTemplateDto, chartId: string) {
    if (!ownerId) {
      throw new BadRequestException('Owner id is required');
    }

    if (!chartId) {
      throw new BadRequestException('Chart id is required');
    }

    if (!dto?.name) {
      throw new BadRequestException('Template name is required');
    }

    return this.prisma.programmbuilderTemplate.create({
      data: {
        name: dto.name,
        ownerid: ownerId,
        charid: chartId,
      },
    });
  }

  async findAllByOwner(ownerId: string) {
    if (!ownerId) {
      throw new BadRequestException('Owner id is required');
    }

    return this.prisma.programmbuilderTemplate.findMany({
      where: { ownerid: ownerId },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: string) {
    const template = await this.prisma.programmbuilderTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Program builder template not found');
    }

    return template;
  }

  async delete(id: string) {
    const exists = await this.prisma.programmbuilderTemplate.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Program builder template not found');
    }

    await this.prisma.programmbuilderTemplate.delete({
      where: { id },
    });

    return {
      message: 'Template deleted successfully',
    };
  }
}
