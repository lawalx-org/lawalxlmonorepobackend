// import {
//   BadRequestException,
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InfrastructureProjectRepository } from './infrastructure-project.repository';
// import { InfrastructureProjectDto } from '../dto/infrastructure.dto';
// import { slugify } from '../functions';
// import { InfrastructureService } from '../infrastructure.service';
// import { InfrastructureRepository } from '../infrastructure.repository';

import { Injectable } from '@nestjs/common';
import { InfrastructureProjectRepository } from './infrastructure-project.repository';
import { InfrastructureService } from '../infrastructure.service';

@Injectable()
export class InfrastructureProjectService {
  constructor(
    private readonly inProjectRepo: InfrastructureProjectRepository,
    //     private readonly infrastructureRepo: InfrastructureRepository,
    private readonly infrastructureService: InfrastructureService,
  ) {}

  //   // project
  //   async createProject(dto: InfrastructureProjectDto) {
  //     if (!dto.taskName)
  //       throw new BadRequestException('Project name is required');

  //     const slug = slugify(dto.taskName);
  //     if (await this.infrastructureRepo.findByProjectSlug(slug)) {
  //       throw new ConflictException('Project slug already exists');
  //     }

  //     return this.projectRepo.createProject({
  //       ...dto,
  //       taskName: dto.taskName,
  //       // assigned take has multiple users who is assigned to the project
  //       // dto.assigned gives us array of user ids like assigned: ["userid1", "userid2", "userid3"]
  //       assigned: dto.assigned
  //         ? {
  //             connect: dto.assigned.map((id) => ({ id: id })),
  //           }
  //         : undefined,
  //       slug,
  //     });
  //   }

  async findManyProjects() {
    const projects = await this.inProjectRepo.findManyProjects();
    return projects;
    return projects.map((project) => {
      const tree = this.infrastructureService.buildTree(project.nodes);

      return {
        ...project,
        nodes: tree,
      };
    });
  }
  /**
   * @deprecated
   */
  async findManyNestedProjects() {
    const projects = await this.inProjectRepo.findManyProjects();
    // return projects;
    return projects.map((project) => {
      const tree = this.infrastructureService.buildTree(project.nodes);

      return {
        ...project,
        nodes: tree,
      };
    });
  }
  //   async deleteProject(id: string) {
  //     if (!id) throw new NotFoundException('Delete project id is required!');
  //     return this.projectRepo.deleteProject(id);
  //   }
}
