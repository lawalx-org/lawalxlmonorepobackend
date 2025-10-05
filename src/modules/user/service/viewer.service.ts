import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
import { CreateViewerDto } from '../dto/create-viewer.dto';

@Injectable()
export class ViewerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createViewerDto: CreateViewerDto) {
    const { email, password, phoneNumber, name } = createViewerDto;

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
          role: Role.VIEWER,
        },
      });

      await prisma.viewer.create({
        data: {
          userId: user.id,
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
