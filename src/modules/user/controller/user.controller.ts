import {
  Controller,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
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
import { RequestWithUser } from 'src/types/RequestWithUser';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/modules/utils/config/multer.config';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ReplaceUserProjectDto } from '../dto/userUpdateAssignProject.Dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly managerService: ManagerService,
    private readonly employeeService: EmployeeService,
    private readonly viewerService: ViewerService,
  ) { }

@Get()
@Roles(Role.CLIENT)
async findAll(@Query() query: PaginationDto, @Req() req) {
  const result = await this.userService.findAll({
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  });
  return { message: 'Users fetched successfully', data: result };
}


  @Get('profile')
  async getUser(@Req() req: RequestWithUser) {
    const id = req.user?.userId;
    return {
      message: 'User fetched successfully',
      data: await this.userService.findOne(id!),
    };
  }

  @Get('managers')
  @Roles(Role.CLIENT)
  async findAllManagers(@Query() query: PaginationDto) {
    const result = await this.managerService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
    return { message: 'Managers fetched successfully', data: result };
  }

  @Get('employees')
  @Roles(Role.CLIENT)
  async findAllEmployees(@Query() query: PaginationDto) {
    const result = await this.employeeService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
    return { message: 'Employees fetched successfully', data: result };
  }

  @Get('viewers')
  @Roles(Role.CLIENT)
  async findAllViewers(@Query() query: PaginationDto) {
    const result = await this.viewerService.findAll({
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
    return { message: 'Viewers fetched successfully', data: result };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.userService.findOne(id);
    return { message: 'User fetched successfully', data: result };
  }

  @Patch()
  @UseInterceptors(FileInterceptor('profileImage', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('User not found or not authenticated');
    }

    if (file) {
      updateUserDto.profileImage = file.path;
    }

    const result = await this.userService.update(userId, updateUserDto);
    return { message: 'User updated successfully', data: result };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImage', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  async updateById(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.profileImage = file.path;
    }

    const result = await this.userService.update(userId, updateUserDto);

    return {
      message: 'User updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(id);
    return { message: 'User deleted successfully', data: result };
  }

  @Get('managers/:id')
  async findOneManager(@Param('id') id: string) {
    const result = await this.managerService.findOne(id);
    return { message: 'Manager fetched successfully', data: result };
  }

  @Get('employees/:id')
  async findOneEmployee(@Param('id') id: string) {
    const result = await this.employeeService.findOne(id);
    return { message: 'Employee fetched successfully', data: result };
  }

  @Get('viewers/:id')
  async findOneViewer(@Param('id') id: string) {
    const result = await this.viewerService.findOne(id);
    return { message: 'Viewer fetched successfully', data: result };
  }
  // @Put('employees/:id/convert-to-manager')
  // async convertEmployeeToManager(
  //   @Param('id') id: string,
  //   @Body() convertDto: ConvertEmployeeToManagerDto,
  // ) {
  //   return this.userService.convertEmployeeToManager(id, convertDto);
  // }

 @Patch('projects/replace')
  @ApiOperation({ summary: 'Replace a project for a user' })
  @ApiBody({ type: ReplaceUserProjectDto })
  async replaceProject(@Body() dto: ReplaceUserProjectDto) {
    return this.userService.replaceUserProject(dto);
  }

}
