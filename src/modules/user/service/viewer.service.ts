import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
import { CreateViewerDto } from '../dto/create-viewer.dto';
import {
  paginate,
  PaginatedResult,
} from 'src/modules/utils/pagination/pagination.utils';

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
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
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

  async findOne(id: string) {
    const viewer = await this.prisma.viewer.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!viewer) {
      throw new NotFoundException(`Viewer with ID "${id}" not found`);
    }

    const { user } = viewer;
    if (!user) {
      throw new NotFoundException(
        `User associated with viewer ID "${id}" not found`,
      );
    }
    const { password, ...userWithoutPassword } = user;

    return {
      ...viewer,
      user: userWithoutPassword,
    };
  }

  async findAll(
    query: { page: number; limit: number } = { page: 1, limit: 10 },
  ): Promise<PaginatedResult<any>> {
    const paginatedViewers = await paginate(
      this.prisma,
      'viewer',
      {
        include: { user: true },
      },
      { page: query.page, limit: query.limit },
    );

    paginatedViewers.data = paginatedViewers.data.map((viewer: any) => {
      const { user } = viewer;
      if (!user) {
        throw new NotFoundException(
          `User not found for viewer with id ${viewer.id}`,
        );
      }
      const { password, ...userWithoutPassword } = user;
      return {
        ...viewer,
        user: userWithoutPassword,
      };
    });

    return paginatedViewers;
  }
}
