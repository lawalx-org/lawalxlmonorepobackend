import { Prisma } from 'generated/prisma';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';

export function buildProjectFilter(
  query: FindAllProjectsDto,
): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.managerId) {
    where.managerId = query.managerId;
  }

  if (query.programId) {
    where.programId = query.programId;
  }

  if (query.name) {
    where.name = { contains: query.name, mode: 'insensitive' };
  }

  if (query.progress) {
    where.progress = { equals: query.progress };
  }

  if (query.startDate && query.endDate) {
    where.startDate = { gte: query.startDate };
    where.deadline = { lte: query.endDate };
  } else if (query.startDate) {
    where.startDate = { gte: query.startDate };
  } else if (query.endDate) {
    where.deadline = { lte: query.endDate };
  }

  return where;
}
