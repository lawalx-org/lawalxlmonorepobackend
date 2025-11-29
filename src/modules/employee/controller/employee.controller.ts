import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from '../service/employee.service';
import { EmployeeFilterDto } from '../dto/employee-filter.dto';
import { EmployeeTaskFilterDto } from '../dto/employee-task-filter.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { BulkDeleteDto } from '../dto/bulk-delete.dto';
import {
  ApiGetAllEmployees,
  ApiGetEmployee,
  ApiUpdateEmployee,
  ApiDeleteEmployee,
  ApiBulkDeleteEmployees,
  ApiGetEmployeeTasks,
  ApiGetEmployeeStatistics,
  ApiChangeEmployeeStatus,
  ApiRequestSheetUpdate,
} from '../utils/swagger.decorators';
import { RequestSheetUpdateDto } from '../dto/request-sheet-update.dto';


@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Get()
  @ApiGetAllEmployees()
  async findAll(@Query() filters: EmployeeFilterDto) {
    return this.employeeService.findAll(filters);
  }

  @Get(':id')
  @ApiGetEmployee()
  async findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateEmployee()
  async update(@Param('id') id: string, @Body() updateDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiDeleteEmployee()
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }

  @Delete('bulk/delete')
  @HttpCode(HttpStatus.OK)
  @ApiBulkDeleteEmployees()
  async bulkDelete(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.employeeService.bulkDelete(bulkDeleteDto);
  }

  @Get(':id/tasks')
  @ApiGetEmployeeTasks()
  async getEmployeeTasks(
    @Param('id') id: string,
    @Query() filters: EmployeeTaskFilterDto,
  ) {
    return this.employeeService.getEmployeeTasks(id, filters);
  }

  @Get(':id/statistics')
  @ApiGetEmployeeStatistics()
  async getStatistics(@Param('id') id: string) {
    return this.employeeService.getTaskStatistics(id);
  }

  @Patch(':id/status')
  @ApiChangeEmployeeStatus()
  async changeStatus(
    @Param('id') id: string,
    @Body('userStatus') userStatus: string,
  ) {
    return this.employeeService.changeStatus(id, userStatus);
  }

  //notified req
@Post(':id/request-sheet-update')
@ApiRequestSheetUpdate()
async reqSheetUpdate(
  @Param('id') employeeId: string,
  @Body() dto: RequestSheetUpdateDto,
) {
  return this.employeeService.reqSheetUpdate(employeeId, dto.projectId);
}

}
