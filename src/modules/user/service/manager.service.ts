import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
import { CreateManagerDto } from '../dto/create-manager.dto';

@Injectable()
export class ManagerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createManagerDto: CreateManagerDto) {
    const { email, password, skills, phoneNumber, name } = createManagerDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone number already exists');
    }

    const saltRounds = Number(this.configService.get<string | number>('bcrypt_salt_rounds') ?? 10);
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
          skills: skills || [],
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
