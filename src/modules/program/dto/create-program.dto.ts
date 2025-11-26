import { ApiProperty } from '@nestjs/swagger';
import {
 IsString,
 IsNotEmpty,
 IsISO8601,
 IsEnum,
} from 'class-validator';
import { Priority } from 'generated/prisma';


export class CreateProgramDto {
 @ApiProperty({
   example: 'New Website Development',
   description: 'The name of the program',
 })
@IsString()
 @IsNotEmpty()
 programName: string;


 @ApiProperty({
   example: '2025-10-12T05:19:26.155Z',
   description: 'The date and time of the program in ISO 8601 format',
 })
 @IsISO8601()
 @IsNotEmpty()
 datetime: string;


 @ApiProperty({
   example: 'This program is for developing a new company website.',
   description: 'A description of the program',
 })
 @IsString()
 @IsNotEmpty()
 programDescription: string;


 @ApiProperty({
   example: 'HIGH',
   description: 'The priority of the program (HIGH, MEDIUM, LOW, NORMAL)',
   enum: Priority,
 })
 @IsEnum(Priority)
 @IsNotEmpty()
 priority: Priority;


 @ApiProperty({
   example: '2026-10-12T05:19:26.155Z',
   description: 'The deadline for the program in ISO 8601 format',
 })
 @IsISO8601()
 @IsNotEmpty()
 deadline: string;
}
