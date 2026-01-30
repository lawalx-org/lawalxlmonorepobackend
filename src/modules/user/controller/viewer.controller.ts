import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ViewerService } from '../service/viewer.service';
import { CreateViewerDto } from '../dto/create-viewer.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('users/viewers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientViewerController {
  constructor(private readonly viewerService: ViewerService) {}

  // @Post('/create')
  // @Roles(Role.CLIENT)
  // @HttpCode(HttpStatus.CREATED)
  // async createViewer(@Body() createViewerDto: CreateViewerDto) {
  //   const viewer = await this.viewerService.create(createViewerDto);

  //   return {
  //     message: 'Viewer created successfully',
  //     data: viewer,
  //   };
  // }
}
