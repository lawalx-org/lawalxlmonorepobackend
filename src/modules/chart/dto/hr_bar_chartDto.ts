import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsString,
    ValidateNested,
    IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class WidgetDto {

    @IsOptional()
    @IsString()
    legendName?: string;

    @IsOptional()
    @IsString()
    color?: string;
}

export class Create_Hr_BarChartDto {
    @ApiPropertyOptional({
        description: 'Total number of datasets available',
        example: 5,
    })
    @IsOptional()
    @IsInt()
    numberOfDataset?: number;

    @IsOptional()
    @IsInt()
    firstFieldDataset?: number;

    @IsOptional()
    @IsInt()
    lastFieldDataset?: number;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => WidgetDto)
    widgets?: WidgetDto[];
}