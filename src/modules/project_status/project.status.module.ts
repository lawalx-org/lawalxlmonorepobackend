import { Module } from "@nestjs/common";
import { ProjectStatusStackController } from "./controller/project.status.controller";
import { ProjectStatusStack } from "./services/project.status.services";

@Module({
    controllers:[ProjectStatusStackController],
    providers:[ProjectStatusStack],
})

export class project_status_stackModule {}