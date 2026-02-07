import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTemplateDto } from '../dto/create-template.dto';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(clientId: string, dto: CreateTemplateDto) {
    if (!clientId) {
      throw new BadRequestException('Client id is required');
    }

    if (!dto?.name) {
      throw new BadRequestException('Template name is required');
    }

    return this.prisma.template.create({
      data: {
        name: dto.name,
        ownerid: dto.ownerid,
        chartList: dto.chartList ?? [],
      },
    });
  }

  async getTemplates(ownerId: string) {
    if (!ownerId) {
      throw new BadRequestException('Client id is required');
    }

    return this.prisma.template.findMany({
      where: { ownerid : ownerId },
      orderBy: { id: 'desc' },
    });
  }

  async getTemplateById(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

   async delete(id: string) {
    const exists = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Program builder template not found');
    }

    await this.prisma.template.delete({
      where: { id },
    });

    return {
      message: 'Template deleted successfully',
    };
  }
}
