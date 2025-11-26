import { Controller, Get } from "@nestjs/common";
import { ClientDashboardOverdue_Project } from "../service/client.dashboard.overedue.services";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('projects overdue')
@Controller('project-overdue')
export class ClientProjectOverdueController {
    constructor(private readonly projectOverdue:ClientDashboardOverdue_Project){}

    @Get("")
    async overdue(){
        const result  = await this.projectOverdue.getDashboardProjectsOverdue();
        return{
            message:"projects overdue fetch successfully",
            data:result
        }
    };
    
}