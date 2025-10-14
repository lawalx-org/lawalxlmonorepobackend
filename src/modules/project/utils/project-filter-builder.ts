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

  return where;
}
