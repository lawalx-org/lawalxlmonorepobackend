import { IsString, IsArray, IsNumber, IsHexColor, ValidateNested, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LegendDto {
  @IsString()
  legend_name: string;

  @IsHexColor()
  color: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })  
  values?: string[];
}

export class stack_bar_ChartConfigDto {
  @IsString()
  widget_name: string;

  @IsNumber()
  @Min(1)
  number_of_labels: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  xAxisLabels?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LegendDto)
  show_widget: LegendDto[];

  @IsNumber()
  first_fields: number;

  @IsNumber()
  last_field_data: number;
}
