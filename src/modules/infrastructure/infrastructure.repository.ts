import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { InfrastructureProjectDto } from './dto/infrastructure.dto';

@Injectable()
export class InfrastructureRepository {
  constructor(private readonly prisma: PrismaService) {}

  createProject(data: InfrastructureProjectDto) {
    return this.prisma.infrastructureProject.create({
      data: {
        ...data,
        slug: data.slug!,
        assigned: { create: [] },
        nodes: { create: [] },
      },
    });
  }

  /**
   * Find many projects
   * @param take - limit the number of returned results
   * @param skip - skip the number of returned results
   * @param orderBy - order the results
   * @param cursor - use cursor to paginate
   * @param where - filter the results
   * @param distinct - distinct the results
   *
   * @example Example of uses all params
   * ```ts
   * const projects = await this.repo.findManyProjects(
   *   10,
   *   0,
   *   { createdAt: 'desc' },
   *   { id: '123' },
   *   { name: 'abc' },
   * );
   * ```
   */
  findManyProjects(
    take?: number,
    skip?: number,
    orderBy?: Prisma.InfrastructureProjectOrderByWithRelationInput,
    cursor?: Prisma.InfrastructureProjectWhereUniqueInput,
    where?: Prisma.InfrastructureProjectWhereInput,
    distinct?: Prisma.InfrastructureProjectScalarFieldEnum[],
    include: Prisma.InfrastructureProjectInclude = {
      nodes: true,
      _count: true,
    },
  ) {
    return this.prisma.infrastructureProject.findMany({
      take,
      skip,
      cursor,
      distinct,
      orderBy,
      where,
      include,
    });
  }

  updateProject(id: string, data: Prisma.InfrastructureProjectUpdateInput) {
    return this.prisma.infrastructureProject.update({
      where: { id },
      data,
    });
  }

  findProjectById(id: string) {
    return this.prisma.infrastructureProject.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.infrastructureProject.findUnique({ where: { slug } });
  }

  // nodes from here...
  findRootNodes(projectId: string) {
    return this.prisma.infrastructureNode.findMany({
      where: { infrastructureProjectId: projectId, parentId: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  findNodeById(id: string) {
    return this.prisma.infrastructureNode.findUnique({ where: { id } });
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

  createNode(data: Prisma.InfrastructureNodeCreateInput) {
    return this.prisma.infrastructureNode.create({ data });
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
