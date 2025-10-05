import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const config = configuration();

    const saltRounds = parseInt(config.bcrypt_salt_rounds || '10', 10);
    const hashedPassword = await bcrypt.hash(
      config.admin.password ?? '',
      saltRounds,
    );

    await this.prisma.user.upsert({
      where: { email: config.admin.email ?? '' },
      update: {},
      create: {
        email: config.admin.email ?? '',
        phoneNumber:config.admin.phoneNumber??'' ,
        password: hashedPassword,
        name: config.admin.name ?? 'System Admin',
        role: "CLIENT",
        status: true,
      },
    });

    console.log(` Admin user ensured: ${config.admin.email}`);
  }
}
