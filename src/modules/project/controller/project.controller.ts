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
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';

@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() query: FindAllProjectsDto) {
    return this.projectService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }
}
