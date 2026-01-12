import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,

    ValidateNested,
    IsOptional,
    IsInt,
} from 'class-validator';
import { WidgetDto } from './widgets.dto';



export class Pareto_ChartDto {

    @IsOptional()
    @IsInt()
    numberOfDataset?: number;

    @IsOptional()
    @IsInt()
    Left_firstFieldDataset?: number;

    @IsOptional()
    @IsInt()
    Left_lastFieldDataset?: number;

    @IsOptional()
    @IsInt()
    Right_firstFieldDataset?: number;

    @IsOptional()
    @IsInt()
    Right_lastFieldDataset?: number;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => WidgetDto)
    widgets?: WidgetDto[];
}