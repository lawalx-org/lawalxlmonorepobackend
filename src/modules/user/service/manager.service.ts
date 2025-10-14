import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
import { CreateManagerDto } from '../dto/create-manager.dto';
import { EmailService } from '../../utils/services/emailService';
import { welcomeEmailTemplate } from '../../utils/template/welcometempleted';

@Injectable()
export class ManagerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async create(createManagerDto: CreateManagerDto) {
    const {
      sendWelcomeEmail,
      notifyProjectManager,
      projects,
      email,
      password,
      skills,
      phoneNumber,
      name,
      joinedDate,
      description,
    } = createManagerDto;

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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          password: hashedPassword,
          role: Role.MANAGER,
        },
      });

      await prisma.manager.create({
        data: {
          userId: user.id,
          description,
          joinedDate,
          projects: projects
            ? { connect: projects.map((id) => ({ id })) }
            : undefined,
          skills: skills || [],
        },
      });

      if (sendWelcomeEmail) {
        await this.emailService.sendMail(
          user.email,
          'Welcome to the Team!',
          welcomeEmailTemplate(user.name, user.email, joinedDate, password),
        );
      }

      if (notifyProjectManager) {
        console.log(
          'Notify project manager functionality not implemented yet.',
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id: string) {
    const manager = await this.prisma.manager.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!manager) {
      throw new NotFoundException(`Manager with ID "${id}" not found`);
    }

    const { user } = manager;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      ...manager,
      user: userWithoutPassword,
    };
  }

  async findAll() {
    const managers = await this.prisma.manager.findMany({
      include: { user: true },
    });

    return managers.map((manager) => {
      const { user } = manager;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return {
        ...manager,
        user: userWithoutPassword,
      };
    });
  }
}
