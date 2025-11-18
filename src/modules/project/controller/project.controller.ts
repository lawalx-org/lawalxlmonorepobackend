import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';
import { SearchProjectByNameDto } from '../dto/search-project.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('project')
@UseGuards(JwtAuthGuard,RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  //  Create a new project
  @Post()
  @Roles(Role.CLIENT)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const newProject = await this.projectService.create(createProjectDto);
    return {
      message: 'Project created successfully',
      project: newProject,
    };
  }

  // Get all projects (with pagination/filter)
  @Get()
  async findAll(@Query() query: FindAllProjectsDto) {
    const allProjects = await this.projectService.findAll(query);
    return {
      message: 'Projects retrieved successfully',
      projects: allProjects,
    };
  }

  // Search projects by name
  @Get('search')
  async searchByName(@Query() query: SearchProjectByNameDto) {
    const results = await this.projectService.searchByName(query);
    return {
      message: 'Projects found successfully',
      projects: results,
    };
  }

  // Get a single project by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectService.findOne(id);
    return {
      message: 'Project retrieved successfully',
      project,
    };
  }
}
