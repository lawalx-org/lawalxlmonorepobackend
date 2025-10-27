import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmittedDto } from '../dto/create-submitted.dto';
import { UpdateSubmittedStatusDto } from '../dto/update-submitted-status.dto';
import { GetAllSubmissionsDto } from '../dto/get-all-submissions.dto';
import {
  paginate,
  PaginatedResult,
} from '../../utils/pagination/pagination.utils';
import { Submitted, SubmittedStatus } from '../../../../generated/prisma';

interface WhereClause {
  project?: {
    name: {
      contains: string;
      mode: 'insensitive';
    };
  };
  status?: SubmittedStatus;
  createdAt?: {
    gte: Date;
    lte: Date;
  };
}

@Injectable()
export class SubmittedService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubmittedDto: CreateSubmittedDto) {
    const { employeeId, projectId, sheetId } = createSubmittedDto;

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const sheet = await this.prisma.sheet.findUnique({
      where: { id: sheetId },
    });

    if (!sheet) {
      throw new NotFoundException(`Sheet with ID ${sheetId} not found`);
    }

    return this.prisma.submitted.create({ data: createSubmittedDto });
  }

  async findAll(
    query: GetAllSubmissionsDto,
  ): Promise<PaginatedResult<Submitted>> {
    const { page = 1, limit = 10, search, status, startDate, endDate } = query;

    const where: WhereClause = {};

    if (search) {
      where.project = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return paginate<Submitted>(
      this.prisma,
      'submitted',
      { where },
      { page, limit },
    );
  }

  async findOne(id: string) {
    const submitted = await this.prisma.submitted.findUnique({
      where: { id },
      include: {
        employee: true,
        project: true,
        sheet: true,
      },
    });
    if (!submitted) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return submitted;
  }

  async updateStatus(
    id: string,
    updateSubmittedStatusDto: UpdateSubmittedStatusDto,
  ) {
    const submitted = await this.prisma.submitted.findUnique({ where: { id } });
    if (!submitted) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return this.prisma.submitted.update({
      where: { id },
      data: updateSubmittedStatusDto,
    });
  }

  async delete(id: string) {
    const submitted = await this.prisma.submitted.findUnique({ where: { id } });
    if (!submitted) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    await this.prisma.submitted.delete({
      where: { id },
    });
    return { message: 'Submission deleted successfully' };
  }
}
