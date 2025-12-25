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
    @ApiPropertyOptional({
        description: 'Name that will appear in the chart legend',
        example: 'Revenue 2024',
    })
    @IsOptional()
    @IsString()
    legendName?: string;
}

export class HeatMap_ChartDto {
    @ApiPropertyOptional({
        description: 'Total number of datasets available',
        example: 5,
    })
    @IsOptional()
    @IsInt()
    numberOfDataset_X?: number;

    @IsOptional()
    @IsInt()
    numberOfDataset_Y?: number;

    @IsOptional()
    @IsInt()
    firstFieldDataset?: number;

    @ApiPropertyOptional({
        description: 'Index of the last dataset to display (inclusive)',
        example: 4,
    })
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