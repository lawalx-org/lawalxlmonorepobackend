import { IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyTemplateDto {
    @ApiProperty({
        description: 'UUID of the target project',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID('4')
    projectId: string;

    @ApiProperty({
        description: 'Array of chart IDs to clone',
        type: [String],
        example: ['uuid1', 'uuid2'],
    })
    @IsArray()
    @IsUUID('4', { each: true })
    chartIds: string[];
}
