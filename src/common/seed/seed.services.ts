import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
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

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email: config.admin.email ?? '' },
        update: {},
        create: {
          email: config.admin.email ?? '',
          phoneNumber: config.admin.phoneNumber ?? '',
          password: hashedPassword,
          name: config.admin.name ?? '',
          role: Role.CLIENT,
          status: true,
        },
      });

      const existingClient = await tx.client.findUnique({
        where: { userId: user.id },
      });

      if (!existingClient) {
        await tx.client.create({
          data: {
            userId: user.id,
            email: user.email,
          },
        });
        console.log(` Client entry created for: ${user.email}`);
      } else {
        console.log(`Client already exists for: ${user.email}`);
      }

      console.log(` Seed transaction complete for ${user.email}`);
    });
  }
}
