import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ClientDashboardServices } from "../service/client.dashboard.services";


@ApiTags('client dashboard')
@Controller('client-dashboard')
export class ClientDashboardController {
    constructor(private readonly clientDashboardServices: ClientDashboardServices) { }


    //---------- dashboard overview------------->
    @Get("overview-stack")
    async overview() {
        const result = await this.clientDashboardServices.getDashboardOverview();
        return {
            message: "client stack fetch successfully",
            data: result
        }
    }

    //---------- employees activity------------->
    @Get("employee-activity")
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'userId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })


    async activity(

        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string,
        @Query('page') page?: string,
    ) {
        const pageNumber = page ? Number(page) : 1;
        const take = limit ? Number(limit) : 10;
        const skip = (pageNumber - 1) * take;

        const employees = await this.clientDashboardServices.getEmployeesActivity(
            userId,
            startDate ? new Date(startDate) : undefined,
            endDate ? new Date(endDate) : undefined,
            take,
            skip
        );

        return {
            message: "Employees activity fetched successfully",
            data: employees,
        };
    }

    //------------project timeline------------>
    @Get('timeline')
    @ApiQuery({ name: 'programId', required: false })
    @ApiQuery({ name: 'overdueTime', required: false })
    async getTimeline(
        @Query('programId') programId?: string,
        @Query('overdueTime') overdueTime?: string // This is the overdue filter
    ) {
        const timeline = await this.clientDashboardServices.getProjectTimeline(programId, overdueTime ? Number(overdueTime) : undefined);

        return {
            message: "Timeline fetched successfully",
            data: timeline
        };
    }

    

    //-----------project status stack------------>
    @Get('status')
    @ApiQuery({
        name: 'period',
        enum: ['week', 'month', 'year'],
        required: false,
        description: 'Select period for project status graph',
        example: 'month', // Swagger UI default example
    })
    async projectStack(@Query('period') period: 'week' | 'month' | 'year' = 'month') {
        const selectedPeriod = period || 'month';
        const project = await this.clientDashboardServices.getProjectStatusStackGraph(selectedPeriod);

        return {
            message: 'Project stack graph fetched successfully',
            data: project,
        };
    }

    //---------project overdue----------->
    @Get('overdue')
    async overdue() {
        const result = await this.clientDashboardServices.getDashboardProjectsOverdue();
        return {
            message: "projects overdue fetch successfully",
            data: result
        }
    };


}