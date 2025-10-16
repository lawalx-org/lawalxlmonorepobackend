import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'generated/prisma';
import { JwtPayload } from 'src/types/RequestWithUser';

export async function buildJwtPayload(
  prisma: PrismaService,
  user: { id: string; role: Role; email: string },
): Promise<
  JwtPayload & {
    clientId?: string;
    employeeId?: string;
    supporterId?: string;
    managerId?: string;
    adminId?: string;
    viewerId?: string;
    superAdminId?: string;
  }
> {
  const jwtPayload: JwtPayload & {
    clientId?: string;
    employeeId?: string;
    supporterId?: string;
    managerId?: string;
    adminId?: string;
    viewerId?: string;
    superAdminId?: string;
  } = {
    userId: user.id,
    role: user.role,
    userEmail: user.email,
  };

  switch (user.role) {
    case Role.CLIENT: {
      const client = await prisma.client.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (client) jwtPayload.clientId = client.id;
      break;
    }

    case Role.EMPLOYEE: {
      const employee = await prisma.employee.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (employee) jwtPayload.employeeId = employee.id;
      break;
    }

    case Role.SUPPORTER: {
      const supporter = await prisma.supporter.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (supporter) jwtPayload.supporterId = supporter.id;
      break;
    }

    case Role.MANAGER: {
      const manager = await prisma.manager.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (manager) jwtPayload.managerId = manager.id;
      break;
    }
    //this user role is not in use now
    case Role.ADMIN: {
      throw new Error('Admin role is not implemented yet');
      //   const admin = await prisma.admin.findUnique({
      //     where: { userId: user.id },
      //     select: { id: true },
      //   });
      //   if (admin) jwtPayload.adminId = admin.id;
      //   break;
    }

    case Role.VIEWER: {
      const viewer = await prisma.viewer.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (viewer) jwtPayload.viewerId = viewer.id;
      break;
    }

    case Role.SUPERADMIN: {
      const superAdmin = await prisma.superAdmin.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });
      if (superAdmin) jwtPayload.superAdminId = superAdmin.id;
      break;
    }

    default:
      break;
  }

  return jwtPayload;
}
