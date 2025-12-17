import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { InfrastructureDto } from './dto/infrastructure.dto';

@Injectable()
export class InfrastructureRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(project: InfrastructureDto) {
    return await this.prisma.infrastructureProject.create({
      data: {
        ...project,
        name: project.name,
        slug: project.slug!,
        computedProgress: 0,
      },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.infrastructureProject.findUnique({
      where: { slug },
    });
  }

  async findProjectById(id: string) {
    return await this.prisma.infrastructureProject.findUnique({
      where: { id },
    });
  }

  findById(id: string) {
    return this.prisma.infrastructureNode.findUnique({ where: { id } });
  }

  findChildren(parentId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { parentId },
    });
  }

  countChildren(parentId: string) {
    return this.prisma.infrastructureNode.count({
      where: { parentId },
    });
  }

  create(data: Prisma.InfrastructureNodeCreateInput) {
    return this.prisma.infrastructureNode.create({ data });
  }

  update(id: string, data: Prisma.InfrastructureNodeUpdateInput) {
    return this.prisma.infrastructureNode.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.infrastructureNode.delete({ where: { id } });
  }
}
