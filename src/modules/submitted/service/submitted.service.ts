import {
  BadRequestException,
  ConflictException,
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
import { NotificationService } from 'src/modules/notification/service/notification.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService

  ) { }

  async create(createSubmittedDto: CreateSubmittedDto, employeeId: string) {
    const { projectId, sheetId, submiteCells } = createSubmittedDto;


    const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) throw new NotFoundException(`Employee with ID ${employeeId} not found`);

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        manager: true,
      }
    });
    if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);

    const sheet = await this.prisma.sheet.findUnique({ where: { id: sheetId } });
    if (!sheet) throw new NotFoundException(`Sheet with ID ${sheetId} not found`);


    if (submiteCells?.length > 0) {
      const foundCells = await this.prisma.submiteCell.findMany({
        where: { id: { in: submiteCells } },
      });

      if (foundCells.length !== submiteCells.length) {
        const notFoundIds = submiteCells.filter(id => !foundCells.some(cell => cell.id === id));
        throw new NotFoundException(`SubmiteCell with IDs ${notFoundIds.join(', ')} not found`);
      }
    }


    const result = await this.prisma.submitted.create({
      data: { ...createSubmittedDto, employeeId },
    });


    const projectManager = project.manager;
    if (!projectManager) {
      console.log(" No manager assigned to project. Skipping notification.");
      return result;
    }


    const permission = await this.prisma.notificationPermissionManager.findUnique({
      where: { userId: projectManager.id },
    });

    if (!permission || permission.submittedProject !== true) {
      console.log(" Manager notification permission disabled. No notification sent.");
      return result;
    }


    const sendingList = await this.notificationService.create(
      {
        receiverIds: [projectManager.id],
        projectId,
        context: `A new submission has been created for project: ${project.name}`,
        type: 'PROJECT_SUBMITTED',
      },
      employeeId,
    );



    return result;
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

  // async updateStatus(
  //   id: string,
  //   updateSubmittedStatusDto: UpdateSubmittedStatusDto,
  // ) {
  //   const { status } = updateSubmittedStatusDto;

  //   return this.prisma.$transaction(async (prisma) => {
  //     const submitted = await prisma.submitted.findUnique({ where: { id } });
  //     if (!submitted) {
  //       throw new NotFoundException(`Submission with ID ${id} not found`);
  //     }

  //     const updatedSubmission = await prisma.submitted.update({
  //       where: { id },
  //       data: { status },
  //     });

  //     if (status === SubmittedStatus.REJECTED) {
  //       const existingReturn = await prisma.submissionReturn.findUnique({
  //         where: { submittedId: id },
  //       });

  //       if (!existingReturn) {
  //         await prisma.submissionReturn.create({
  //           data: {
  //             submittedId: id,
  //           },
  //         });
  //       }
  //     }

  //     return updatedSubmission;
  //   });
  // }

 async updateStatus(
  id: string,
  updateSubmittedStatusDto: UpdateSubmittedStatusDto,
  managerId: string,
) {
  const { status } = updateSubmittedStatusDto;

  return this.prisma.$transaction(async (prisma) => {
    
    const submitted = await prisma.submitted.findUnique({
      where: { id },
      include: {
        employee: { select: { id: true, userId: true } },
        project: { select: { id: true, name: true } },
      },
    });

    if (!submitted) {
      throw new NotFoundException(`Submission with id ${id} not found.`);
    }

    if (!submitted.employee) {
      throw new BadRequestException('Submission has no employee assigned.');
    }

    const { project, employee } = submitted;


    const updatedSubmission = await prisma.submitted.update({
      where: { id },
      data: { status },
    });


    if (status === SubmittedStatus.REJECTED) {
      await prisma.submissionReturn.upsert({
        where: { submittedId: id },
        update: {},
        create: { submittedId: id },
      });
    }


    const permission = await prisma.notificationPermissionEmployee.findUnique({
      where: { userId: employee.userId! },
      select: { returnProject: true },
    });

    
    if (!permission?.returnProject) {
      return { updatedSubmission };
    }


    const message = (() => {
      switch (status) {
        case SubmittedStatus.APPROVED:
          return `Your submission for project ${project.name} has been APPROVED.`;
        case SubmittedStatus.REJECTED:
          return `Your submission for project ${project.name} has been REJECTED.`;
        default:
          return `Submission status updated to ${status} for project ${project.name}.`;
      }
    })();


    await this.notificationService.create(
      {
        receiverIds: [employee.userId!],
        projectId: project.id,
        context: message,
        type: 'SUBMISSION_UPDATED_STATUS',
      },
      managerId,
    );


    return { 
      message: 'Sheet update request sent successfully',
      notifications: updatedSubmission,
      // updatedSubmission 
    };
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
