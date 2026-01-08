import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,

    ValidateNested,
    IsOptional,
    IsInt,
    IsString,
} from 'class-validator';
import { WidgetDto } from './widgets.dto';





export class SolidGauge_ChartDto {

    @IsOptional()
    @IsInt()
    startingRange?: number;


    @IsOptional()
    @IsInt()
    endRange?: number;

    @IsOptional()
    @IsInt()
    gaugeValue?: number;

    @IsOptional()
    @IsInt()
    chartHight?: number;

    @IsOptional()
    @IsInt()
    startAngle?: number;

    @IsOptional()
    @IsInt()
    endAngle?: number;

    @IsOptional()
    @IsString()
    trackColor?: string;

    @IsOptional()
    @IsInt()
    strokeWidth?: number;

    @IsOptional()
    @IsInt()
    valueFontSize?: number;

    @IsOptional()
    @IsInt()
    shadeIntensity?: number;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => WidgetDto)
    widgets?: WidgetDto[];
}