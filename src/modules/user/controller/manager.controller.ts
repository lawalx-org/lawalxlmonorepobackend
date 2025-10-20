import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ManagerService } from '../service/manager.service';
import { CreateManagerDto } from '../dto/create-manager.dto';

@Controller('managers')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createManager(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }
}
