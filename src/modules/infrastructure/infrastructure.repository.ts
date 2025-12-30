import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InfrastructureRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProjectSlug(slug: string) {
    return this.prisma.project.findUnique({ where: { slug } });
  }
  findNodeBySlug(slug: string) {
    return this.prisma.infrastructureNode.findUnique({ where: { slug } });
  }

  findProjectById(id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  findNodeById(id: string) {
    return this.prisma.infrastructureNode.findUnique({ where: { id } });
  }
  findProgramById(id: string) {
    return this.prisma.program.findUnique({ where: { id } });
  }
}
