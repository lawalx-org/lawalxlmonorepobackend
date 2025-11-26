import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiGetAllEmployees = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all employees with filters and pagination' }),
    ApiResponse({
      status: 200,
      description: 'Returns paginated employee list',
    }),
  );

export const ApiGetEmployee = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get single employee details' }),
    ApiResponse({ status: 200, description: 'Returns employee details' }),
    ApiResponse({ status: 404, description: 'Employee not found' }),
  );

export const ApiUpdateEmployee = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update employee details' }),
    ApiResponse({ status: 200, description: 'Employee updated successfully' }),
    ApiResponse({ status: 404, description: 'Employee not found' }),
  );

export const ApiDeleteEmployee = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete an employee' }),
    ApiResponse({ status: 200, description: 'Employee deleted successfully' }),
    ApiResponse({ status: 404, description: 'Employee not found' }),
  );

export const ApiBulkDeleteEmployees = () =>
  applyDecorators(
    ApiOperation({ summary: 'Bulk delete employees' }),
    ApiResponse({ status: 200, description: 'Employees deleted successfully' }),
  );

export const ApiGetEmployeeTasks = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get employee tasks with filters' }),
    ApiResponse({ status: 200, description: 'Returns employee tasks' }),
    ApiResponse({ status: 404, description: 'Employee not found' }),
  );

export const ApiGetEmployeeStatistics = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get employee task statistics' }),
    ApiResponse({ status: 200, description: 'Returns task statistics' }),
    ApiResponse({ status: 404, description: 'Employee not found' }),
  );

export const ApiChangeEmployeeStatus = () =>
  applyDecorators(
    ApiOperation({ summary: 'Change employee status' }),
    ApiResponse({ status: 200, description: 'Status updated successfully' }),
    ApiResponse({ status: 404, description: 'Employee not found' }),
  );
