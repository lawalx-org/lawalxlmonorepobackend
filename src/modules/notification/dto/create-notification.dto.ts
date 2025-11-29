import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'An array of user IDs who will receive the notification.',
    example: ['user-id-3', 'user-id-4'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  receiverIds: string[];

  @ApiProperty({
    description: 'The main content or message of the notification.',
    example: 'You have a new task assigned.',
  })
  @IsString()
  @IsNotEmpty()
  context: string;

  @ApiProperty({
    description: 'The type of the notification.',
    example: 'TASK_ASSIGNED',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
  @ApiPropertyOptional({
    description: 'Optional project ID related to the notification.',
    example: 'project-id-123',
  })
  @IsString()
  @IsOptional()
  projectId?: string;
}
