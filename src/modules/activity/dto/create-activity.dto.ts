import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityActionType } from 'generated/prisma';

export class CreateActivityDto {
  @ApiProperty({
    description: 'ID of the user performing the activity',
    type: String,
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID of the project associated with the activity',
    type: String,
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    description: 'Description of the activity',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Type of action performed in the activity',
    enum: ActivityActionType,
  })
  @IsEnum(ActivityActionType)
  actionType: ActivityActionType;


  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata related to the activity',
    type: Object,
  })
  @IsOptional()
  metadata?: any;
}
