import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Language } from 'generated/prisma';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @IsDateString()
  @IsOptional()
  timezone?: Date;

  @IsBoolean()
  @IsOptional()
  verification2FA?: boolean;
}
