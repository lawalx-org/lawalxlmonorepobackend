import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TagService } from '../service/tag.service';
import { CreateTagDto } from '../dto/create-tag.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Create a tag for a program' })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  async create(@Body() dto: CreateTagDto) {
    const data = await this.tagService.create(dto);
    return {
      message: 'Tag created successfully',
      data,
    };
  }

  @Get('program/:programId')
  @ApiOperation({ summary: 'Get all tags by program ID' })
  @ApiResponse({ status: 200, description: 'Tags fetched successfully' })
  async findAll(@Param('programId') programId: string) {
    const data = await this.tagService.findAllByProgram(programId);
    return {
      message: 'Tags fetched successfully',
      data,
    };
  }
}
