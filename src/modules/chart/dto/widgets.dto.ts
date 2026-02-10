import { IsNumber, IsOptional, IsString } from "class-validator";


export class WidgetDto {
    @IsOptional() @IsString()
    legendName?: string;

    @IsOptional() @IsString()
    color?: string;

    @IsOptional() @IsNumber()
    value?: number;
}