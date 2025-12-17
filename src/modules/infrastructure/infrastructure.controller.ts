import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InfrastructureService } from './infrastructure.service';
import { ApiTags } from '@nestjs/swagger';
import { InfrastructureDto } from './dto/infrastructure.dto';
import { InfrastructureNodeDto } from './dto/infrastructure.node.dto';

@ApiTags('Infrastructure')
@Controller('infrastructure')
export class InfrastructureController {
  constructor(private readonly service: InfrastructureService) {}

  @Post('project')
  async store(@Body() project: InfrastructureDto) {
    try {
      const createdProject = await this.service.createProject(project);
      if (!createdProject)
        throw new BadRequestException('Fail to create project');
      return createdProject;
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }

  @Post(':id/children')
  async addChild(
    @Param('id') id: string,
    @Body() child: InfrastructureNodeDto,
  ) {
    try {
      return await this.service.addChild(id, child);
    } catch (err) {
      return err.message;
    }
  }

  @Patch(':id/progress')
  async updateProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
  ) {
    try {
      return await this.service.updateProgress(id, progress);
    } catch (err) {
      return err.message;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.service.deleteNode(id);
    } catch (err) {
      return err.message;
    }
  }
}
