// import {
//   IsString,
//   IsNotEmpty,
//   IsDate,
//   IsEnum,
//   IsUUID,
//   IsOptional,
//   IsNumber,
//   IsInt,
//   IsArray,
//   IsObject,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { Priority } from 'generated/prisma';
// import { ApiProperty } from '@nestjs/swagger';
// import { CreateReminderProjectDto } from 'src/modules/notification/dto/create-reminder.dto';

// export class CreateProjectDto extends CreateReminderProjectDto {
//   @ApiProperty({
//     description: 'The name of the project',
//     example: 'Project Alpha',
//   })
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   // from here our infrastructure code
//   @IsString()
//   @IsOptional()
//   slug: string;

//   @ApiProperty({
//     description: 'Calculated progress of the project',
//     type: Number,
//   })
//   @IsNumber()
//   computedProgress: number;
//   // end infrastructure code

//   @ApiProperty({
//     description: 'The ID of the program this project belongs to',
//     example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
//   })
//   @IsUUID()
//   @IsNotEmpty()
//   programId: string;

//   @ApiProperty({
//     description: 'The description of the project',
//     example: 'This is a project to do something important.',
//   })
//   @IsString()
//   @IsNotEmpty()
//   description: string;

//   @ApiProperty({
//     description: 'The priority of the project',
//     enum: Priority,
//     example: Priority.HIGH,
//   })
//   @IsEnum(Priority)
//   @IsNotEmpty()
//   priority: Priority;

//   @ApiProperty({
//     description: 'The deadline for the project',
//     type: Date,
//     example: '2025-12-31T23:59:59.999Z',
//   })
//   @Type(() => Date)
//   @IsDate()
//   @IsNotEmpty()
//   deadline: Date;

//   @ApiProperty({
//     description: 'The ID of the manager for this project',
//     example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
//   })
//   @IsUUID()
//   @IsOptional()
//   managerId: string;

//   @ApiProperty({
//     description: 'The IDs of the employees assigned to this project',
//     example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
//     required: false,
//   })
//   @IsArray()
//   @IsUUID('all', { each: true })
//   @IsOptional()
//   viewerIds?: string[];

//   @ApiProperty({
//     description: 'The IDs of the employees assigned to this project',
//     example: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
//     required: false,
//   })
//   @IsArray()
//   @IsUUID('all', { each: true })
//   @IsOptional()
//   employeeIds?: string[];

//   @ApiProperty({
//     description: 'The start date of the project',
//     required: false,
//     example: '2025-01-01T00:00:00.000Z',
//   })
//   @IsDate()
//   @IsOptional()
//   @Type(() => Date)
//   startDate?: Date;

//   @ApiProperty({
//     description: 'The project progress percentage',
//     required: false,
//   })
//   @IsInt()
//   @IsOptional()
//   progress?: number;

//   @ApiProperty({
//     description: 'List of charts for the project',
//     required: false,
//   })
//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   chartList: string[];

//   @ApiProperty({ description: 'Estimated completion date', required: false })
//   @IsDate()
//   @IsOptional()
//   @Type(() => Date)
//   estimatedCompletedDate?: Date;

//   @ApiProperty({ description: 'Current rate for the project', required: false })
//   @IsString()
//   @IsOptional()
//   currentRate?: string;

//   @ApiProperty({ description: 'Project budget', required: false })
//   @IsString()
//   @IsOptional()
//   budget?: string;

//   @ApiProperty({
//     description: 'Latitude for the project location',
//     required: false,
//     example: 37.7749,
//   })
//   @IsNumber()
//   @IsOptional()
//   latitude?: number;

//   @ApiProperty({
//     description: 'Longitude for the project location',
//     required: false,
//     example: -122.4194,
//   })
//   @IsNumber()
//   @IsOptional()
//   longitude?: number;

//   @ApiProperty({
//     description: 'Additional metadata information for the project',
//     type: Object,
//     required: false,
//   })
//   @IsOptional()
//   @IsObject()
//   metadata: Record<string, any>;
// }



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
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Days, Priority, Share, UploadCycle } from 'generated/prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateReminderDto } from 'src/modules/notification/dto/create-reminder.dto';

export class CreateProjectDto extends CreateReminderDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Project Alpha',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'URL-friendly unique identifier' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Calculated progress of the project (0-100)',
    type: Number,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  computedProgress?: number;

  @ApiProperty({
    description: 'The ID of the program this project belongs to',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  programId: string;


  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The ID of the template to apply (optional)'
  })
  @IsUUID()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Deep dive into infrastructure scaling',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The priority level',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  // @IsEnum(UploadCycle)
  // @IsOptional()
  // UploadCycle?: UploadCycle;

  @ApiPropertyOptional({
    description: 'Privacy/Sharing settings',
    enum: Share,
    default: Share.Only_Me,
  })
  @IsEnum(Share)
  @IsOptional()
  shareWith?: Share;

  @ApiProperty({
    description: 'The deadline for completion',
    type: Date,
    example: '2025-12-31T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  deadline?: Date;

  @ApiProperty({
    description: 'The deadline for completion',
    type: Date,
    example: '2025-12-31T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateDate?: Date;



  @ApiProperty({
    description: 'The ID of the project manager',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  managerId: string;

  @ApiPropertyOptional({
    description: 'List of viewer IDs to be linked via ProjectViewer',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  viewerIds?: string[];

  @ApiPropertyOptional({
    description: 'List of employee IDs to be linked via ProjectEmployee',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  employeeIds?: string[];

  @ApiPropertyOptional({ type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Manual progress override', minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @ApiPropertyOptional({ type: [String], description: 'List of chart identifiers' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chartList?: string[];

  @ApiPropertyOptional({ description: 'Current billing/resource rate' })
  @IsString()
  @IsOptional()
  currentRate?: string;

  @ApiPropertyOptional({ description: 'Total allocated budget' })
  @IsString()
  @IsOptional()
  budget?: string;


  @ApiPropertyOptional({
    description: 'Additional metadata',
    type: 'object',
    additionalProperties: true,
    example: { department: 'Engineering', billable: true },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;


  @ApiPropertyOptional({
    description: 'Privacy/Sharing settings',
    enum: Days,
    default: [Days.Sun]
  })
  @IsEnum(Days, { each: true })
  @IsOptional()
  SelectDays?: Days[];

  // ✅ Use this
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  UploadData?: string;


  @ApiPropertyOptional({
    description: 'A list of specific selected dates for the project',
    type: [Date],
    example: ['2026-01-01T00:00:00Z', '2026-02-01T00:00:00Z'],
  })
  @IsOptional()
  @IsArray()
  @IsDate({ each: true })
  @Type(() => Date)
  selectDate?: Date[];

  @ApiPropertyOptional({
    description: 'Privacy/Sharing settings',
    enum: Days,
    default: [Days.Sun]
  })
  @IsEnum(Days, { each: true })
  @IsOptional()
  workingDay?: Days[];


  @IsOptional()
  sortName?: string


  @IsOptional()
  location?: string

  //   deadline,
  //   budget,
  //   startDate,
  //   currentRate,

  // @ApiPropertyOptional({ example: 'message' })
  // @IsString()
  // @IsOptional()
  // reminderMessage?: string;


}
