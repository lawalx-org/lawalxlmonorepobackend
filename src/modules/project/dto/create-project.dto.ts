import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsUUID,
  IsOptional,
  IsNumber,
  IsInt,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Priority } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';
import { CreateReminderProjectDto } from 'src/modules/notification/dto/create-reminder.dto';

export class CreateProjectDto extends CreateReminderProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project Alpha',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  // from here our infrastructure code
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'Calculated progress of the project',
    type: Number,
  })
  @IsNumber()
  computedProgress: number;
  // end infrastructure code

  @ApiProperty({
    description: 'The ID of the program this project belongs to',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  programId: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'This is a project to do something important.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The priority of the project',
    enum: Priority,
    example: Priority.HIGH,
  })
  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;

  @ApiProperty({
    description: 'The deadline for the project',
    type: Date,
    example: '2025-12-31T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  // @ApiProperty({
  //   description: 'The ID of the manager for this project',
  //   example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  // })
  // @IsUUID()
  // @IsNotEmpty()
  // managerId: string;

    // Manager is optional
  @ApiProperty({
    description: 'The ID of the manager for this project',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  managerId?: string;

  // @ApiProperty({
  //   description: 'The ID of the viewer for this project',
  //   example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  // })
  // @IsUUID()
  // @IsNotEmpty()
  // viewerId: string;

  // Viewer is now an array like employees
  @ApiProperty({
    description: 'The IDs of the viewers for this project',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  viewerId?: string[];

  @ApiProperty({
    description: 'The IDs of the employees assigned to this project',
    example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  employeeIds?: string[];

  @ApiProperty({
    description: 'The start date of the project',
    required: false,
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'The project progress percentage',
    required: false,
  })
  @IsInt()
  @IsOptional()
  progress?: number;

  @ApiProperty({
    description: 'List of charts for the project',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chartList: string[];

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  estimatedCompletedDate?: Date;

  @ApiProperty({ description: 'Current rate for the project', required: false })
  @IsString()
  @IsOptional()
  currentRate?: string;

  @ApiProperty({ description: 'Project budget', required: false })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiProperty({
    description: 'Latitude for the project location',
    required: false,
    example: 37.7749,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude for the project location',
    required: false,
    example: -122.4194,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Additional metadata information for the project',
    type: Object,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata: Record<string, any>;
}
