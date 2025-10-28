import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { SubmittedService } from '../service/submitted.service';
import { CreateSubmittedDto } from '../dto/create-submitted.dto';
import { UpdateSubmittedStatusDto } from '../dto/update-submitted-status.dto';
import { GetAllSubmissionsDto } from '../dto/get-all-submissions.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RequestWithUser } from 'src/types/RequestWithUser';

@Controller('submitted')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmittedController {
  constructor(private readonly submittedService: SubmittedService) {}

  @Post()
  @Roles('EMPLOYEE')
  async create(
    @Body() createSubmittedDto: CreateSubmittedDto,
    @Req() req: RequestWithUser,
  ) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const submission = await this.submittedService.create(
      createSubmittedDto,
      employeeId,
    );
    return {
      message: 'Submission created successfully',
      submission,
    };
  }

  @Get()
  @Roles('EMPLOYEE')
  async findAll(
    @Query() query: GetAllSubmissionsDto,
    @Req() req: RequestWithUser,
  ) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const AllSubmissions = await this.submittedService.findAll(
      query,
      employeeId,
    );
    return { message: 'Submissions retrieved successfully', AllSubmissions };
  }

  @Get(':id')
  @Roles('EMPLOYEE')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const singleSubmitions = await this.submittedService.findOne(
      id,
      employeeId,
    );
    return {
      message: 'Submission retrieved successfully',
      singleSubmitions,
    };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateSubmittedStatusDto: UpdateSubmittedStatusDto,
  ) {
    const updatedSubmission = await this.submittedService.updateStatus(
      id,
      updateSubmittedStatusDto,
    );
    return {
      message: 'Submission status updated successfully',
      submission: updatedSubmission,
    };
  }

  @Delete(':id')
  @Roles('EMPLOYEE')
  async delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    await this.submittedService.delete(id, employeeId);
    return { message: 'Submission deleted successfully' };
  }
}
