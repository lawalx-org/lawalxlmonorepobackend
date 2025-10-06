import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, Param, Delete, Put, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ManagerService } from '../service/manager.service';
import { EmployeeService } from '../service/employee.service';
import { ViewerService } from '../service/viewer.service';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { CreateViewerDto } from '../dto/create-viewer.dto';
import { ConvertEmployeeToManagerDto } from '../dto/convert-employee-to-manager.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';

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
  
  // @UseGuards(JwtAuthGuard)
  @Post('/create-viewer')
  @HttpCode(HttpStatus.CREATED)
  async createViewer(@Body() createViewerDto: CreateViewerDto) {
    return this.viewerService.create(createViewerDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('managers')
  async findAllManagers() {
    return this.managerService.findAll();
  }

  @Get('employees')
  async findAllEmployees() {
    return this.employeeService.findAll();
  }

  @Get('viewers')
  async findAllViewers() {
    return this.viewerService.findAll();
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

  @Put('employees/:id/convert-to-manager')
  async convertEmployeeToManager(
    @Param('id') id: string,
    @Body() convertDto: ConvertEmployeeToManagerDto,
  ) {
    return this.userService.convertEmployeeToManager(id, convertDto);
  }
}
