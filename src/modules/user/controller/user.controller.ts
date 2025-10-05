import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserFilterDto } from '../dto/create-user.dto';
import { ManagerService } from '../service/manager.service';
import { EmployeeService } from '../service/employee.service';
import { ViewerService } from '../service/viewer.service';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { CreateViewerDto } from '../dto/create-viewer.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly viewerService: ViewerService,
  ) {}

  @Post('/create-manager')
  @HttpCode(HttpStatus.CREATED)
  async createManager(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }

  @Post('/create-employee')
  @HttpCode(HttpStatus.CREATED)
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post('/create-viewer')
  @HttpCode(HttpStatus.CREATED)
  async createViewer(@Body() createViewerDto: CreateViewerDto) {
    return this.viewerService.create(createViewerDto);
  }

  @Get('findAll')
  async findUsers(@Query() filterDto: UserFilterDto) {
    return this.userService.findAllWithFilters(filterDto);
  }
}
