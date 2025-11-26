import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger";
import { ProjectTimelineService } from "../service/client.project_timeline.services";

@ApiTags('client project timeline')
@Controller("project-timeline")

export class ProjectTimelineController {
    constructor(private readonly projectTimelineService: ProjectTimelineService) {}

    @Get()
    @ApiQuery({ name: 'programId', required: false })
    @ApiQuery({ name: 'maxDays', required: false })

    async getTimeline(@Query('programId') programId?: string,@Query('maxDays') maxDays?: string) {
        const timeline= this.projectTimelineService.getProjectTimeline(programId,maxDays ? Number(maxDays) : undefined);
        return{
            message:"timeline fetch successfully",
            data:timeline
        }
    }
}
