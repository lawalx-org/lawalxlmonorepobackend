import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from '../service/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('users/employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientEmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/create-employee')
  @Roles(Role.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeeService.create(createEmployeeDto);

    return {
      message: ' Employee created successfully',
      data: employee,
    };
  }
}
