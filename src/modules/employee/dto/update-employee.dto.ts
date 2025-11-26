import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from 'generated/prisma';

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'Employee name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '2024-01-01', description: 'Joined date' })
  @IsOptional()
  @IsString()
  joinedDate?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['JavaScript', 'TypeScript'],
    description: 'Skills',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({
    example: 'Employee description',
    description: 'Description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Profile image URL',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiPropertyOptional({ enum: UserStatus, description: 'User status' })
  @IsOptional()
  @IsEnum(UserStatus)
  userStatus?: UserStatus;
}
