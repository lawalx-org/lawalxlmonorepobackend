import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmailService } from 'src/modules/utils/services/emailService';
import { welcomeEmailTemplate } from 'src/modules/utils/template/welcometempleted';
import { NotificationService } from 'src/modules/notification/service/notification.service';
import {
  paginate,
  PaginatedResult,
} from 'src/modules/utils/pagination/pagination.utils';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const {
      sendWelcomeEmail,
      notifyProjectManager,
      skills,
      projects,
      email,
      password: plainTextPassword,
      phoneNumber,
      name,
      description,
      joinedDate,
    } = createEmployeeDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }

    if (projects && projects.length > 0) {
      const projectCount = await this.prisma.project.count({
        where: {
          id: { in: projects },
        },
      });

      if (projectCount !== projects.length) {
        throw new NotFoundException('One or more projects not found.');
      }
    }

    const saltRounds = Number(
      this.configService.get<string | number>('bcrypt_salt_rounds') ?? 10,
    );
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          role: Role.EMPLOYEE,
        },
      });

      await prisma.employee.create({
        data: {
          userId: user.id,
          description,
          joinedDate,
          projectEmployees: projects
            ? {
                create: projects.map((projectId) => ({
                  project: {
                    connect: {
                      id: projectId,
                    },
                  },
                })),
              }
            : undefined,
          skills: skills || [],
        },
      });

      if (sendWelcomeEmail) {
        await this.emailService.sendMail(
          user.email,
          'Welcome to the Team!',
          welcomeEmailTemplate(
            user.name,
            user.email,
            joinedDate,
            plainTextPassword,
          ),
        );
      }

      if (notifyProjectManager && projects && projects.length > 0) {
        const projectManagers = await this.prisma.project.findMany({
          where: {
            id: { in: projects },
          },
          select: {
            managerId: true,
          },
        });
        await this.notificationService.create(
          {
            receiverIds: [...new Set(projectManagers.map((p) => p.managerId))],
            context: `A new employee ${name} has been assigned to a project you are managing.`,
            type: 'NEW_EMPLOYEE_ASSIGNED',
          },
          user.id,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }

    const { user } = employee;
    if (!user) {
      throw new NotFoundException(
        `User associated with employee ID "${id}" not found`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      ...employee,
      user: userWithoutPassword,
    };
  }

  async findAll(
    query: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<PaginatedResult<any>> {
    const paginatedEmployees = await paginate(
      this.prisma,
      'employee',
      {
        include: { user: true },
      },
      { page: query.page, limit: query.limit },
    );

    paginatedEmployees.data = paginatedEmployees.data.map((employee: any) => {
      const { user } = employee;
      if (!user) {
        throw new NotFoundException(
          `User not found for employee with id ${employee.id}`,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return {
        ...employee,
        user: userWithoutPassword,
      };
    });

    return paginatedEmployees;
  }
}
