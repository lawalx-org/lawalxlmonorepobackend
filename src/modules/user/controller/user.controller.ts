import {
  Controller,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ManagerService } from '../service/manager.service';
import { EmployeeService } from '../service/employee.service';
import { ViewerService } from '../service/viewer.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { Role } from 'generated/prisma';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly viewerService: ViewerService,
  ) {}

  @Get()
  @Roles(Role.CLIENT)
  async findAll(@Query() query: PaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.userService.findAll({ page, limit });
  }

  @Get('managers')
  @Roles(Role.CLIENT)
  async findAllManagers(@Query() query: PaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.managerService.findAll({ page, limit });
  }

  @Get('employees')
  @Roles(Role.CLIENT)
  async findAllEmployees(@Query() query: PaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.employeeService.findAll({ page, limit });
  }

  @Get('viewers')
  @Roles(Role.CLIENT)
  async findAllViewers(@Query() query: PaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.viewerService.findAll({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('managers/:id')
  async findOneManager(@Param('id') id: string) {
    return this.managerService.findOne(id);
  }

  @Get('employees/:id')
  async findOneEmployee(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Get('viewers/:id')
  async findOneViewer(@Param('id') id: string) {
    return this.viewerService.findOne(id);
  }

  // @Put('employees/:id/convert-to-manager')
  // async convertEmployeeToManager(
  //   @Param('id') id: string,
  //   @Body() convertDto: ConvertEmployeeToManagerDto,
  // ) {
  //   return this.userService.convertEmployeeToManager(id, convertDto);
  // }
}
