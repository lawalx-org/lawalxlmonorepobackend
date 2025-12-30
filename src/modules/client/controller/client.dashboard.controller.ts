import { Body, Controller, Get, Param, Patch, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ClientDashboardServices } from "../service/client.dashboard.services";
import { JwtAuthGuard } from "src/common/jwt/jwt.guard";
import { RolesGuard } from "src/common/jwt/roles.guard";
import { Roles } from "src/common/jwt/roles.decorator";
import { RequestWithUser } from "src/types/RequestWithUser";
import { SubmittedStatus } from "generated/prisma";
import { UpdateSubmittedStatusDto } from "../dto/update-submitted-status.dto";


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
    @Get('employee-activity')
    @ApiQuery({ name: 'userId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'search', required: false })
    async activity(
        @Req() req: RequestWithUser,
        @Query('userId') userId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string,
        @Query('page') page?: string,
        @Query('search') search?: string,
    ) {
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException('clientId ID not found in token');
        }


        const userIdQuery = userId || false;
        const startDateQuery = startDate || false;
        const endDateQuery = endDate || false;
        const limitQuery = limit || false;
        const pageQuery = page || false;
        const searchQuery = search || false;

        const pageNumber = pageQuery ? Number(pageQuery) : 1;
        const take = limitQuery ? Number(limitQuery) : 10;
        const skip = (pageNumber - 1) * take;

        const employees = await this.clientDashboardServices.getEmployeesActivity(
            userIdQuery as any,
            startDateQuery ? new Date(startDateQuery) : undefined,
            endDateQuery ? new Date(endDateQuery) : undefined,
            searchQuery as any,
            take,
            skip,
        );

        return {
            statusCode: 200,
            success: true,
            message: "Request successful",
            data: employees.result,
        };
    }



    //------------project timeline------------>
    @Get('timeline')
    @ApiQuery({ name: 'programId', required: false })
    @ApiQuery({ name: 'overdueTime', required: false })
    @ApiQuery({ name: 'savedTime', required: false })
    async getTimeline(
        @Req() req: RequestWithUser,
        @Query('programId') programId?: string,
        @Query('overdueTime') overdueTime?: string,
        @Query('savedTime') savedTime?: string
    ) {
        const clientId = req.user.clientId;
        if (!clientId) {
            throw new UnauthorizedException('clientId ID not found in token');
        }

        const timeline = await this.clientDashboardServices.getProjectTimeline(
            programId,
            overdueTime ? Number(overdueTime) : undefined,
            savedTime ? Number(savedTime) : undefined
        );

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

    // @Patch(':id/submission-status')
    // @ApiOperation({ summary: 'Update submission status' })
    // @ApiParam({
    //     name: 'id',
    //     example: 'b3c8e9c2-7f2e-4a3c-9d1a-123456789abc',
    // })
    // updateStatus(
    //     @Param('id') id: string,
    //     @Body() dto: UpdateSubmittedStatusDto,
    // ) {
    //     return this.clientDashboardServices.updateStatus(id, dto.status);
    // }


}