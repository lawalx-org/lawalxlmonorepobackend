import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { ProgramBuilderTemplateService } from '../service/programbuild.services';

@ApiTags('Program Builder Templates')
@Controller('program-builder-templates')
export class ProgramBuilderTemplateController {
  constructor(
    private readonly service: ProgramBuilderTemplateService,
  ) {}

  @Post(':ownerId/:chartId')
  @ApiParam({ name: 'ownerId', example: 'user-uuid-123' })
  @ApiParam({ name: 'chartId', example: 'chart-uuid-456' })
  create(
    @Param('ownerId') ownerId: string,
    @Param('chartId') chartId: string,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.service.create(ownerId, dto, chartId);
  }

  @Get('owner/:ownerId')
  @ApiParam({ name: 'ownerId', example: 'user-uuid-123' })
  findAll(@Param('ownerId') ownerId: string) {
    return this.service.findAllByOwner(ownerId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 'template-uuid-789' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', example: 'template-uuid-789' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
