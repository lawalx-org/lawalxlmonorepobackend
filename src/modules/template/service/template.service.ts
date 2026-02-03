import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTemplateDto } from "../dto/create-template.dto";

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}


  async createTemplate(clientId: string, dto?:CreateTemplateDto) {
    return this.prisma.template.create({
      data: {
        client: {
          connect: { id: clientId },
        },
      },
    });
  }

  async getTemplates(clientId?: string) {
    return this.prisma.template.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
      },
    });
  }

  async getTemplateById(id: string) {
    return this.prisma.template.findUnique({
      where: { id },
      include: {
        client: true,
        programs: true, 
      },
    });
  }
}
