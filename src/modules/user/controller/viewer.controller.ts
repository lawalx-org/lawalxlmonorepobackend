import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ViewerService } from '../service/viewer.service';
import { CreateViewerDto } from '../dto/create-viewer.dto';

@Controller('viewers')
export class ViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createViewer(@Body() createViewerDto: CreateViewerDto) {
    return this.viewerService.create(createViewerDto);
  }
}
