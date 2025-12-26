import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InfrastructureProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  // createProject(data: Prisma.InfrastructureProjectCreateInput) {
  //   return this.prisma.infrastructureProject.create({
  //     data: {
  //       ...data,
  //       slug: data.slug!,
  //     },
  //   });
  // }

  // /**
  //  * Find many projects
  //  * @param take - limit the number of returned results
  //  * @param skip - skip the number of returned results
  //  * @param orderBy - order the results
  //  * @param cursor - use cursor to paginate
  //  * @param where - filter the results
  //  * @param distinct - distinct the results
  //  *
  //  * @example Example of uses all params
  //  * ```ts
  //  * const projects = await this.repo.findManyProjects(
  //  *   10,
  //  *   0,
  //  *   { createdAt: 'desc' },
  //  *   { id: '123' },
  //  *   { name: 'abc' },
  //  * );
  //  * ```
  //  */
  // findManyProjects(
  //   take?: number,
  //   skip?: number,
  //   orderBy?: Prisma.InfrastructureProjectOrderByWithRelationInput,
  //   cursor?: Prisma.InfrastructureProjectWhereUniqueInput,
  //   where?: Prisma.InfrastructureProjectWhereInput,
  //   distinct?: Prisma.InfrastructureProjectScalarFieldEnum[],
  //   include: Prisma.InfrastructureProjectInclude = {
  //     nodes: true,
  //     _count: true,
  //   },
  // ) {
  //   return this.prisma.infrastructureProject.findMany({
  //     take,
  //     skip,
  //     cursor,
  //     distinct,
  //     orderBy,
  //     where,
  //     include,
  //   });
  // }

  updateProject(id: string, data: Prisma.ProjectUpdateInput) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  deleteProject(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
