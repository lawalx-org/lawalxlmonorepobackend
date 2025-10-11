import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { email, password, phoneNumber, name,description,joinedDate } = createEmployeeDto;

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
          role: Role.EMPLOYEE,
        },
      });

      await prisma.employee.create({
        data: {
          userId: user.id,
          description,
          joinedDate,
          
          
        },
      });

      const { password, ...userWithoutPassword } = user;
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
    const { password, ...userWithoutPassword } = user;

    return {
      ...employee,
      user: userWithoutPassword,
    };
  }

  async findAll() {
    const employees = await this.prisma.employee.findMany({
      include: { user: true },
    });

    return employees.map(employee => {
      const { user } = employee;
      const { password, ...userWithoutPassword } = user;
      return {
        ...employee,
        user: userWithoutPassword,
      };
    });
  }
}
