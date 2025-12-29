import { IsArray, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from 'generated/prisma';

export class UpdateUserProjectsDto {
  @ApiProperty({ description: 'ID of the user to update', example: '98be17e4-64fe-489f-bc6b-997a63b1e016' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Project IDs to remove', example: ['588bc02c-dc52-4109-bffc-b0d01f76ff36'], required: false })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  removeProjectIds?: string[];

  @ApiProperty({ description: 'Project IDs to add', example: ['12345678-1234-1234-1234-1234567890ab'], required: false })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  addProjectIds?: string[];

  @ApiProperty({ description: 'Optional user status update', enum: UserStatus, required: false })
  @IsEnum(UserStatus
  )
  @IsOptional()
  status?: UserStatus;
}
