import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProjectStatusStack } from "../services/project.status.services";

@ApiTags('project status stack')
@Controller("project-status-stack")
export class ProjectStatusStackController {
    constructor(private readonly projectStatusStack: ProjectStatusStack) {}

    @Get("project-stack")
    async projectStack(@Query('period') period: 'week' | 'month' | 'year' ) {
        const dafultSelected = period || 'month'
        const project = await this.projectStatusStack.getProjectStatusStackGraph(dafultSelected);

        return {
            message:"product stack graph fetch successfully",
            data: project
        };
    }
}
