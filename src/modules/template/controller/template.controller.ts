import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { TemplateService } from '../service/template.service';

@ApiTags('Templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post(':clientId')
  @ApiParam({ name: 'clientId', example: 'client-uuid-123' })
  createTemplate(
    @Param('clientId') clientId: string,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.templateService.createTemplate(clientId, dto);
  }

  @Get(':clientId')
  @ApiParam({ name: 'clientId', example: 'client-uuid-123' })
  getTemplates(@Param('clientId') clientId: string) {
    return this.templateService.getTemplates(clientId);
  }

  @Get('single/:id')
  @ApiParam({ name: 'id', example: 'template-uuid-456' })
  getTemplateById(@Param('id') id: string) {
    return this.templateService.getTemplateById(id);
  }

    @Delete(':id')
    @ApiParam({ name: 'id', example: 'template-uuid-789' })
    delete(@Param('id') id: string) {
      return this.templateService.delete(id);
    }
}
