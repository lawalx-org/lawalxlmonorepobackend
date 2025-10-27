import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubmittedService } from '../service/submitted.service';
import { CreateSubmittedDto } from '../dto/create-submitted.dto';
import { UpdateSubmittedStatusDto } from '../dto/update-submitted-status.dto';
import { GetAllSubmissionsDto } from '../dto/get-all-submissions.dto';

@Controller('submitted')
export class SubmittedController {
  constructor(private readonly submittedService: SubmittedService) {}

  @Post()
  async create(@Body() createSubmittedDto: CreateSubmittedDto) {
    const submission = await this.submittedService.create(createSubmittedDto);
    return {
      message: 'Submission created successfully',
      submission,
    };
  }

  @Get()
  async findAll(@Query() query: GetAllSubmissionsDto) {
    const AllSubmissions = await this.submittedService.findAll(query);
    return {  message: 'Submissions retrieved successfully', AllSubmissions };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const singleSubmitions = await this.submittedService.findOne(id);
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
  async delete(@Param('id') id: string) {
    await this.submittedService.delete(id);
    return { message: 'Submission deleted successfully' };
  }
}
