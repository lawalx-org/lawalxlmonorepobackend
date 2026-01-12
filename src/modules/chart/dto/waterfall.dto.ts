import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,

    ValidateNested,
    IsOptional,
    IsInt,
} from 'class-validator';
import { WidgetDto } from './widgets.dto';



export class WaterFall_ChartDto {

    @IsOptional()
    @IsInt()
    numberOfDataset?: number;


    @IsOptional()
    @IsInt()
    firstFieldDataset?: number;

    @IsOptional()
    @IsInt()
    lastFieldDataset?: number;;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => WidgetDto)
    widgets?: WidgetDto[];
}