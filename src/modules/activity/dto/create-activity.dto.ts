import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ActivityActionType } from 'generated/prisma';

export class CreateActivityDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  projectId: string;

  @IsString()
  description: string;

  @IsEnum(ActivityActionType)
  actionType: ActivityActionType;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  metadata?: any;
}
