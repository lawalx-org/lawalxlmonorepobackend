import { Type } from "class-transformer";
import { 
  IsArray, 
  IsHexColor, 
  IsNumber, 
  IsString, 
  ValidateNested 
} from "class-validator";

export class FirstDataSet {
  @IsString()
  line_name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  data: number[];

  @IsHexColor()
  color: string;
}

export class SecondDataSet {
  @IsString()
  line_name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  data: number[];

  @IsHexColor()
  color: string;
}

export class multiAxisLineChartDto {
  @IsString()
  widget_name: string;

  @IsNumber()
  number_of_data_set_Labels_X: number;

  @IsArray()
  @IsString({ each: true })
  xAxisLabels_name: string[];

  @IsNumber()
  first_fields: number;

  @IsNumber()
  last_field_data: number;

  @ValidateNested()
  @Type(() => FirstDataSet)
  Data1: FirstDataSet;

  @ValidateNested()
  @Type(() => SecondDataSet)
  Data2: SecondDataSet;
}
