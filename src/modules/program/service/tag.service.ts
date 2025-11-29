import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from '../dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new tag under a program
   */
  async create(dto: CreateTagDto) {
    // Ensure program exists before attaching a tag
    const programExists = await this.prisma.program.findUnique({
      where: { id: dto.programId },
      select: { id: true },
    });

    if (!programExists) {
      throw new NotFoundException(
        `Program with ID "${dto.programId}" was not found.`,
      );
    }

   
    return this.prisma.tag.create({
      data: {
        programId: dto.programId,
        name: dto.name.trim(),
      },
    });
  }


  async findAllByProgram(programId: string) {

    const program = await this.prisma.program.findUnique({
      where: { id: programId },
      select: { id: true },
    });

    if (!program) {
      throw new NotFoundException(
        `Program with ID "${programId}" does not exist.`,
      );
    }

    // Fetch tags
    return this.prisma.tag.findMany({
      where: { programId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
