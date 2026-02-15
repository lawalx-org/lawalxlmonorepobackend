import { Controller } from "@nestjs/common";
import { FSService } from "../service/FS.service";

@Controller('feedback')
export class FSController {
    constructor(private readonly service:FSService) {}
}