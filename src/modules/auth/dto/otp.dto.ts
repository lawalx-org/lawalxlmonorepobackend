// src/otp/dto/send-otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'The email address associated with the OTP',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '14155552671', 
    description: 'The phone number in international format (E.164). Example: +14155552671',
  })
  @IsPhoneNumber()
  @IsOptional()
   phone?: string;
}


// src/otp/dto/verify-otp.dto.ts
import {  IsString } from 'class-validator';

export class VerifyOtpDto {
   @ApiProperty({
    example: 'user@gmail.com',
    description: 'The email address associated with the OTP',
  })  
  @IsEmail()
  email: string;
  
  @ApiProperty({
    example: '123456',
    description: 'The 6-digit OTP sent to the email address',
  })
  @IsString()
  otp: string;
}
