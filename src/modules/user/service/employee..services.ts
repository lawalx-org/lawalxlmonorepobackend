import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateStaffEmployeeDto, RestrictedRole } from "../dto/create.employee.dto";
import { NotificationService } from "src/modules/notification/service/notification.service";
import { EmailService } from "src/modules/utils/services/emailService";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { Role } from "generated/prisma";
import { welcomeEmailTemplate } from "src/modules/utils/template/welcometempleted";
import { NotificationType } from 'src/modules/notification/dto/create-notification.dto';
import { UpdateStaffEmployeeDto } from "../dto/update.employee.dto";

@Injectable()
export class StaffEmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService
  ) { }

  async create(createEmployeeDto: CreateStaffEmployeeDto) {
    const {
      sendWelcomeEmail,
      notifyProjectManager,
      skills,
      projects,
      email,
      password: plainTextPassword,
      name,
      description,
      joinedDate,
      role: selectedRole,
    } = createEmployeeDto;

    const [existingUser, projectCount] = await Promise.all([
      this.prisma.user.findUnique({ where: { email }, select: { id: true } }),
      projects?.length
        ? this.prisma.project.count({ where: { id: { in: projects } } })
        : Promise.resolve(0)
    ]);

    if (existingUser) throw new ConflictException('User already exists');
    if (projects?.length && projectCount !== projects.length) {
      throw new NotFoundException('Some projects not found');
    }

    const saltRounds = Number(this.configService.get('bcrypt_salt_rounds') ?? 10);
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);


    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: selectedRole as unknown as Role,
        },
      });

      const commonData = {
        userId: user.id,
        description,
        joinedDate,
        skills: skills || [],
      };

      if (selectedRole === RestrictedRole.EMPLOYEE) {
        await tx.employee.create({
          data: {
            ...commonData,
            projectEmployees: projects?.length ? {
              create: projects.map(id => ({ project: { connect: { id } } }))
            } : undefined,
          },
        });
      }
      else if (selectedRole === RestrictedRole.MANAGER) {
        await tx.manager.create({
          data: {
            ...commonData,
            projects: projects?.length ? {
              connect: projects.map(id => ({ id }))
            } : undefined,
          },
        });
      }
      else if (selectedRole === RestrictedRole.VIEWER) {
        await tx.viewer.create({
          data: {
            ...commonData,
            projectViewers: projects?.length ? {
              create: projects.map(id => ({ project: { connect: { id } } }))
            } : undefined,
          },
        });
      }
      await tx.notificationPermissionEmployee.create({ data: { userId: user.id } });

      return user;
    });

    this.handleBackgroundTasks(result, createEmployeeDto, plainTextPassword);

    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }


  private async handleBackgroundTasks(user: any, dto: CreateStaffEmployeeDto, rawPass: string) {
    try {
      const backgroundTasks: Promise<any>[] = [];

      if (dto.sendWelcomeEmail) {
        backgroundTasks.push(
          this.emailService.sendMail(
            user.email,
            'Welcome!',
            welcomeEmailTemplate(user.name, user.email, dto.joinedDate, rawPass)
          )
        );
      }

      if (dto.notifyProjectManager && dto.projects?.length) {
        backgroundTasks.push(this.notifyManagers(user, dto.projects));
      }

      await Promise.allSettled(backgroundTasks);
    } catch (error) {
      console.error('Background side-effect failed:', error);
    }
  }

  async update(id: string, updateDto: UpdateStaffEmployeeDto) {
    const {
      projects,
      skills,
      role: selectedRole,
      password: plainTextPassword,
      ...directFields
    } = updateDto;


    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { employee: true, manager: true, viewer: true }
    });

    if (!existingUser) throw new NotFoundException('User not found');


    let hashedPassword;
    if (plainTextPassword) {
      const saltRounds = Number(this.configService.get('bcrypt_salt_rounds') ?? 10);
      hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    }

    return await this.prisma.$transaction(async (tx) => {

      const updatedUser = await tx.user.update({
        where: { id },
        data: {
          ...directFields,
          ...(hashedPassword && { password: hashedPassword }),
          role: selectedRole as unknown as Role,
        },
      });

      const commonData = {
        description: directFields.description,
        joinedDate: directFields.joinedDate,
        skills: skills,
      };

      if (selectedRole === RestrictedRole.EMPLOYEE) {
        await tx.employee.update({
          where: { userId: id },
          data: {
            ...commonData,
            projectEmployees: projects ? {
              deleteMany: {},
              create: projects.map(projectId => ({ project: { connect: { id: projectId } } }))
            } : undefined,
          },
        });
      }
      else if (selectedRole === RestrictedRole.MANAGER) {
        await tx.manager.update({
          where: { userId: id },
          data: {
            ...commonData,
            projects: projects ? {
              set: projects.map(projectId => ({ id: projectId }))
            } : undefined,
          },
        });
      }
      const { password, ...result } = updatedUser;
      return result;
    });
  }

  private async notifyManagers(newUser: any, projectIds: string[]) {
    const projectsWithManagers = await this.prisma.project.findMany({
      where: { id: { in: projectIds } },
      select: { manager: { select: { userId: true } } },
    });

    const receiverIds = [
      ...new Set(
        projectsWithManagers
          .map((p) => p.manager?.userId)
          .filter((id): id is string => !!id)
      ),
    ];

    if (receiverIds.length) {
      await this.notificationService.create(
        {
          receiverIds,
          context: `A new ${newUser.role.toLowerCase()} ${newUser.name} has been assigned to your project.`,
          type: NotificationType.NEW_EMPLOYEE_ASSIGNED,
        },
        newUser.id,
      );
    }
  }
}