import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramDto } from '../dto/create-program.dto';
import { GetAllProgramsDto } from '../dto/get-all-programs.dto';
import {
  PaginatedResult,
  paginate,
} from 'src/modules/utils/pagination/pagination.utils';
import { Prisma } from 'generated/prisma';
import { FindAllProjectsInProgramDto } from '../dto/find-all-projects-in-program.dto';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProgramDto: CreateProgramDto, userId: string) {
    const { ...programData } = createProgramDto;
    const client = await this.prisma.client.findUnique({
      where: { id: userId },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID "${userId}" not found`);
    }

    return this.prisma.program.create({
      data: {
        ...programData,
        progress: 0,
        client: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll(
    query: GetAllProgramsDto,
  ): Promise<PaginatedResult<any>> {
    const { page, limit, programName, priority, deadline, progress, datetime } =
      query;
    const where: Prisma.ProgramWhereInput = {};

    if (programName) {
      where.programName = {
        contains: programName,
        mode: 'insensitive',
      };
    }

    if (priority) {
      where.priority = priority;
    }

    if (deadline) {
      where.deadline = deadline;
    }

    if (progress !== undefined) {
      where.progress = progress;
    }

    if (datetime) {
      where.datetime = datetime;
    }

    return paginate(
      this.prisma,
      'program',
      {
        where,
      },
      { page: page ?? 1, limit: limit ?? 10 },
    );
  }

  async findOne(id: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
    });
    if (!program) {
      throw new NotFoundException(`Program with ID "${id}" not found`);
    }
    return program;
  }
  async findAllProjectsByProgram(
    programId: string,
    query: FindAllProjectsInProgramDto,
  ): Promise<PaginatedResult<any>> {
    await this.findOne(programId);
    const { page, limit, search, priority, startDate, deadline } = query;
    const where: Prisma.ProjectWhereInput = {
      programId,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (priority) {
      where.priority = priority;
    }

    if (startDate) {
      where.startDate = {
        gte: startDate,
      };
    }

    if (deadline) {
      where.deadline = {
        lte: deadline,
      };
    }

    return paginate(
      this.prisma,
      'project',
      {
        where,
      },
      { page: page ?? 1, limit: limit ?? 10 },
    );
  }
}

