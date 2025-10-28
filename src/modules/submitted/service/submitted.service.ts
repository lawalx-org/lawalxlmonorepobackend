import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
  employeeId?: string;
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

  async create(createSubmittedDto: CreateSubmittedDto, employeeId: string) {
    const { projectId, sheetId } = createSubmittedDto;

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

    return this.prisma.submitted.create({
      data: { ...createSubmittedDto, employeeId },
    });
  }

  async findAll(
    query: GetAllSubmissionsDto,
    employeeId: string,
  ): Promise<PaginatedResult<Submitted>> {
    const { page = 1, limit = 10, search, status, startDate, endDate } = query;

    const where: WhereClause = { employeeId };

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

  async findOne(id: string, employeeId: string) {
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
    if (submitted.employeeId !== employeeId) {
      throw new UnauthorizedException(
        'You are not authorized to view this submission',
      );
    }
    return submitted;
  }

  async updateStatus(
    id: string,
    updateSubmittedStatusDto: UpdateSubmittedStatusDto,
  ) {
    const { status } = updateSubmittedStatusDto;

    return this.prisma.$transaction(async (prisma) => {
      const submitted = await prisma.submitted.findUnique({ where: { id } });
      if (!submitted) {
        throw new NotFoundException(`Submission with ID ${id} not found`);
      }

      const updatedSubmission = await prisma.submitted.update({
        where: { id },
        data: { status },
      });

      if (status === SubmittedStatus.REJECTED) {
        const existingReturn = await prisma.submissionReturn.findUnique({
          where: { submittedId: id },
        });

        if (!existingReturn) {
          await prisma.submissionReturn.create({
            data: {
              submittedId: id,
            },
          });
        }
      }

      return updatedSubmission;
    });
  }

  async delete(id: string, employeeId: string) {
    const submitted = await this.prisma.submitted.findUnique({ where: { id } });
    if (!submitted) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    if (submitted.employeeId !== employeeId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this submission',
      );
    }
    await this.prisma.submitted.delete({
      where: { id },
    });
    return { message: 'Submission deleted successfully' };
  }
}
