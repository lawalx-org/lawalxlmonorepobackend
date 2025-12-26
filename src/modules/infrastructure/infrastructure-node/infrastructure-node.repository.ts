import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InfrastructureNodeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findRootNodes(projectId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { projectId, parentId: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  findChildren(parentId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { parentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  countChildren(parentId: string) {
    return this.prisma.infrastructureNode.count({ where: { parentId } });
  }

  async createNode(data: Prisma.InfrastructureNodeCreateInput) {
    return await this.prisma.infrastructureNode.create({
      data,
    });
  }

  updateNode(id: string, data: Prisma.InfrastructureNodeUpdateInput) {
    return this.prisma.infrastructureNode.update({
      where: { id },
      data,
    });
  }

  deleteNode(id: string) {
    return this.prisma.infrastructureNode.delete({ where: { id } });
  }
}
