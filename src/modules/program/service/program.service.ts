import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProgramDto } from '../dto/create-program.dto';

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

  async findAll() {
    return this.prisma.program.findMany();
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
}
