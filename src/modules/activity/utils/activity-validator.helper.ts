// import { NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';

// export class ActivityValidator {
//   static async validateUserAndProject(
//     prisma: PrismaService,
//     userId: string,
//     projectId: string,
//   ): Promise<void> {
//     const [user, project] = await Promise.all([
//       prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
//       prisma.project.findUnique({ where: { id: projectId }, select: { id: true } }),
//     ]);

//     if (!user) {
//       throw new NotFoundException(`User with ID ${userId} not found`);
//     }

//     if (!project) {
//       throw new NotFoundException(`Project with ID ${projectId} not found`);
//     }
//   }
// }
