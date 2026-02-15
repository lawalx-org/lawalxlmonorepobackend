import { Module } from "@nestjs/common";
import { TemplateService } from "./service/template.service";
import { TemplateController } from "./controller/template.controller";

@Module({
    controllers:[TemplateController],
    providers:[TemplateService]
})

export class TemplateModule {}