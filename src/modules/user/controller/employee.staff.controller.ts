import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { Role } from 'generated/prisma';
import { CreateStaffEmployeeDto } from '../dto/create.employee.dto';
import { StaffEmployeeService } from '../service/employee..services';
import { ApiTags } from '@nestjs/swagger';
import { UpdateStaffEmployeeDto } from '../dto/update.employee.dto';

@ApiTags('Staff employee')
@Controller('users/employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientStaffEmployeeController {
  constructor(private readonly employeeService: StaffEmployeeService) { }

  @Post('create-employee')
  @Roles(Role.CLIENT)
  async createEmployee(@Body() dto: CreateStaffEmployeeDto) {
    const result = await this.employeeService.create(dto)
    return {
      message: 'Employee created successfully',
      data: result,
    };
  }

  @Patch('update-employee/:id')
  @Roles(Role.CLIENT)
  async updateEmployee(
    @Param('id') id: string,
    @Body() dto: UpdateStaffEmployeeDto
  ) {
    const result = await this.employeeService.update(id, dto);
    return {
      message: 'Employee updated successfully',
      data: result,
    };
  }
}
