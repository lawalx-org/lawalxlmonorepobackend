import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UploadFileDto {
  @ApiProperty({ type: String, example: '1d3b9943-4b77-4b54-803e-fc6e15e0b396' })
  @IsString()
  userId: string;
}
