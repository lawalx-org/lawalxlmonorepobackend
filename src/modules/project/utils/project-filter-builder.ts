// import { Prisma } from 'generated/prisma';
// import { FindAllProjectsDto } from '../dto/find-all-projects.dto';

// export function buildProjectFilter(
//   query: FindAllProjectsDto,
// ): Prisma.ProjectWhereInput {
//   const where: Prisma.ProjectWhereInput = {};

//   if (query.status) {
//     where.status = query.status;
//   }

//   if (query.priority) {
//     where.priority = query.priority;
//   }

//   if (query.managerId) {
//     where.managerId = query.managerId;
//   }

//   if (query.programId) {
//     where.programId = query.programId;
//   }

//   if (query.name) {
//     where.name = { contains: query.name, mode: 'insensitive' };
//   }

//   if (query.progress) {
//     where.progress = { equals: query.progress };
//   }

//   if (query.startDate && query.endDate) {
//     where.startDate = { gte: query.startDate };
//     where.deadline = { lte: query.endDate };
//   } else if (query.startDate) {
//     where.startDate = { gte: query.startDate };
//   } else if (query.endDate) {
//     where.deadline = { lte: query.endDate };
//   }

//   if (query.employeeId) {
//     where.projectEmployees = {
//       some: {
//         employeeId: query.employeeId,
//       },
//     };
//   }

//   return where;
// }

import { Prisma } from 'generated/prisma';
import { FindAllProjectsDto } from '../dto/find-all-projects.dto';

export function buildProjectFilter(
  query: FindAllProjectsDto,
): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {};

  // Basic filters
  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  // if (query.managerId) {
  //   where.managerId = query.managerId; // ✅ works
  // }
  if (query.managerId) {
    where.manager = {
      userId: query.managerId, // 👈 THIS IS THE KEY FIX
    };
  }

  if (query.programId) {
    where.programId = query.programId;
  }

  if (query.name) {
    where.name = {
      contains: query.name,
      mode: 'insensitive',
    };
  }

  // Progress (IMPORTANT FIX)
  if (query.progress !== undefined) {
    where.progress = query.progress;
  }

  // Date filters (safe)
  if (query.startDate) {
    where.startDate = {
      gte: query.startDate,
    };
  }

  if (query.endDate) {
    where.deadline = {
      lte: query.endDate,
    };
  }

  // Employee filter
  if (query.employeeId) {
    where.projectEmployees = {
      some: {
        employeeId: query.employeeId,
      },
    };
  }

  // 🔹 Search filter
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      {
        program: {
          programName: { contains: query.search, mode: 'insensitive' },
        },
      },
    ];
  }

  return where;
}
