import { 
  IsHexColor, 
  IsString, 
  IsNumber, 
  IsArray, 
  ValidateNested, 
} from "class-validator";
import { Type } from "class-transformer";

export class HeatmapRangeDto {
  @IsNumber()
  firstValue: number;

  @IsNumber()
  secondValue: number;

  @IsHexColor()
  color: string;
}

export class AreaChartDto {
  @IsString()
  widget_name: string;

  @IsString()
  widget_description: string;

  @IsNumber()
  number_of_data_set_X: number;

  @IsNumber()
  number_of_data_set_Y: number;

  @IsArray()
  @IsString({ each: true })
  xAxisLabels_name: string[];

  @IsArray()
  @IsString({ each: true })
  yAxisLabels_name: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeatmapRangeDto)
  range: HeatmapRangeDto[];
}
