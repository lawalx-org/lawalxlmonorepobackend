import { applyDecorators, Header } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function GetAllActivitiesDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all activities with filters' }),
    ApiResponse({
      status: 200,
      description: 'Activities retrieved successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid query parameters' }),
  );
}

export function GetActivityByIdDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get activity by ID' }),
    ApiResponse({
      status: 200,
      description: 'Activity retrieved successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid activity ID format' }),
    ApiNotFoundResponse({ description: 'Activity not found' }),
  );
}

export function GetUserActivitiesDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get activities by user ID' }),
    ApiResponse({
      status: 200,
      description: 'User activities retrieved successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid user ID format' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ExportActivitiesDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Export activities as CSV' }),
    ApiResponse({
      status: 200,
      description: 'CSV file generated successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid query parameters' }),
    ApiNotFoundResponse({ description: 'No activities found to export' }),
    Header('Content-Type', 'text/csv'),
    Header('Content-Disposition', 'attachment; filename="activities.csv"'),
  );
}
