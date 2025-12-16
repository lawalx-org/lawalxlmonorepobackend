import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ManagerService } from '../service/manager.service';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { Roles } from 'src/common/jwt/roles.decorator';
import { Role } from 'generated/prisma';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';

@Controller('users/managers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('/create')
  @Roles(Role.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  async createManager(@Body() createManagerDto: CreateManagerDto) {
    const manager = await this.managerService.create(createManagerDto);

    return {
      message: 'Manager created successfully',
      data: manager,
    };
  }
}
