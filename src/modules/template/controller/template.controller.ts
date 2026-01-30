import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TemplateService } from '../service/template.service';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { CreateTemplateDto } from '../dto/create-template.dto';

@ApiTags('template')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
@Controller('template')
export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  @Post('create-template')
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async create(
    @Body() dto: CreateTemplateDto,
    @Req() req: RequestWithUser,
  ) {
    const clientId = req.user.clientId;
    if (!clientId) {
      throw new UnauthorizedException('Client ID not found in token');
    }

    return this.service.createTemplate(clientId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates for logged-in client' })
  async getAll(@Req() req: RequestWithUser) {
    const clientId = req.user.clientId;
    if (!clientId) {
      throw new UnauthorizedException('Client ID not found in token');
    }

    return this.service.getTemplates(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  async getById(@Param('id') id: string) {
    return this.service.getTemplateById(id);
  }
}
