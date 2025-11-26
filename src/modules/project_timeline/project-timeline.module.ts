import { Module } from "@nestjs/common";
import { ProjectTimelineController } from "./controller/project_timeline.controller";
import { ProjectTimelineService } from "./services/project_timeline.services";

@Module({
    controllers:[ProjectTimelineController],
    providers :[ProjectTimelineService],

})

export class project_timelineModule{};