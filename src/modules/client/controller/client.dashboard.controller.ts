import { Controller, Get, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ClientDashboardServices } from "../service/client.dashboard.services";
import { JwtAuthGuard } from "src/common/jwt/jwt.guard";
import { RolesGuard } from "src/common/jwt/roles.guard";
import { Roles } from "src/common/jwt/roles.decorator";
import { RequestWithUser } from "src/types/RequestWithUser";
import { SubmittedStatus } from "generated/prisma";


@ApiTags('client dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENT')
@Controller('client-dashboard')
export class ClientDashboardController {
    constructor(private readonly clientDashboardServices: ClientDashboardServices) { }


    //---------- dashboard overview------------->
    @Get("overview-stack")
    async overview(@Req() req: RequestWithUser) {
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException('clientId ID not found in token');
        }
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
        @Req() req: RequestWithUser,
        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string,
        @Query('page') page?: string,
    ) {
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException('clientId ID not found in token');
        }
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
        @Req() req: RequestWithUser,
        @Query('programId') programId?: string,
        @Query('overdueTime') overdueTime?: string // This is the overdue filter
    ) {
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException('clientId ID not found in token');
        }
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
        example: 'month',
    })
    async projectStack(@Req() req: RequestWithUser, @Query('period') period: 'week' | 'month' | 'year' = 'month') {
        const selectedPeriod = period || 'month';
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException('clientId ID not found in token');
        }
        const project = await this.clientDashboardServices.getProjectStatusStackGraph(selectedPeriod);

        return {
            message: 'Project status graph fetched successfully',
            data: project,
        };
    }


    //---------project overdue----------->
    @Get('overdue')
    async overdue(@Req() req: RequestWithUser) {
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException('clientId ID not found in token');
        }
        const result = await this.clientDashboardServices.getDashboardProjectsOverdue();
        return {
            message: "projects overdue fetch successfully",
            data: result
        }
    };

    //------------project activity ------------//

    // @Get('project-activity')
    // async project_activity(@Req() req: RequestWithUser) {
    //     const clientId = req.user.clientId;
    //     if (!clientId) {
    //         throw new UnauthorizedException('clientId ID not found in token');
    //     }
    //     const result = await this.clientDashboardServices.getProjectsActivity();
    //     return {
    //         message: "projects activity fetch successfully",
    //         data: result
    //     }
    // };


    //---------------upcomming dateline ------------------//
    @Get("upcoming-deadline")
    async upcomingDeadline(@Req() req: RequestWithUser) {
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException("clientId ID not found in token");
        }

        const result = await this.clientDashboardServices.upcomingDeadlineProjects();

        return {
            message: "Upcoming project deadlines fetched successfully",
            data: result
        };
    }

    // @Get()
    // async showAllSubmission(@Req() req: RequestWithUser) {
    //     const clientId = req.user.clientId;
    //     if (!clientId) {
    //         throw new UnauthorizedException("clientId ID not found in token");
    //     }

    //     const result = await this.clientDashboardServices.showAllSubmission();
    //     return {
    //         message: "submission fetch successfully",
    //         data: result
    //     }
    // }
    @Get("all-submissions")
    @ApiQuery({
        name: 'startDate',
        required: false,
        example: '2025-01-01',
        description: 'Filter submissions from this date',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        example: '2025-12-31',
        description: 'Filter submissions up to this date',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: SubmittedStatus,
        description: 'Filter by submission status',
    })
    async showAllSubmission(
        @Req() req: RequestWithUser,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('status') status?: SubmittedStatus,
        
    ) {
          const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException("clientId ID not found in token");
        }
        return this.clientDashboardServices.showAllSubmission({
            startDate,
            endDate,
            status,
        });
    }


}