// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { Role } from 'generated/prisma';
// import configuration from 'src/config/configuration';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class SeedService implements OnModuleInit {
//   constructor(private readonly prisma: PrismaService) {}

//   async onModuleInit() {
//     const config = configuration();

//     const saltRounds = parseInt(config.bcrypt_salt_rounds || '10', 10);
//     const hashedPassword = await bcrypt.hash(
//       config.admin.password ?? '',
//       saltRounds,
//     );

//     await this.prisma.$transaction(async (tx) => {
//       const user = await tx.user.upsert({
//         where: { email: config.admin.email ?? '' },
//         update: {},
//         create: {
//           email: config.admin.email ?? '',
//           phoneNumber: config.admin.phoneNumber ?? '',
//           password: hashedPassword,
//           name: config.admin.name ?? '',
//           role: Role.CLIENT,
//           status: true,
//         },
//       });

//       const existingClient = await tx.client.findUnique({
//         where: { userId: user.id },
//       });

//       if (!existingClient) {
//         await tx.client.create({
//           data: {
//             userId: user.id,
//             email: user.email,
//           },
//         });
//         console.log(` Client entry created for: ${user.email}`);
//          await tx.notificationPermissionClient.create({
//           data: {
//             userId: user.id,
//           }
//         });
//       } else {
//         console.log(`Client already exists for: ${user.email}`);
//       }

//       console.log(` Seed transaction complete for ${user.email}`);
//     });
//   }
// }




import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from 'generated/prisma';
import configuration from 'src/config/configuration';
import { PrismaService } from 'src/prisma/prisma.service';
import { login, LoginResponse } from './login';


@Injectable()
export class SeedService implements OnModuleInit {
 private readonly logger = new Logger(SeedService.name);


 constructor(private readonly prisma: PrismaService) {}


 async onModuleInit(): Promise<void> {
   const config = configuration();
   const { admin, loginUrl } = config;


   this.logger.log('Seed process started');


   if (!loginUrl) {
     throw new Error('Seed config error: loginUrl is missing.');
   }


   if (!admin?.email || !admin?.password) {
     throw new Error('Seed config error: admin email or password is missing.');
   }


   let response: LoginResponse;


   try {
     response = await login(admin.email, admin.password, loginUrl);
   } catch {
     throw new Error('Authentication failed: auth service unreachable.');
   }


   if (response.success !== true) {
     throw new Error(
       'Unauthorized access: you are not allowed to run seed operations.',
     );
   }


   this.logger.log('Authentication successful');


   const saltRounds = Number(config.bcrypt_salt_rounds ?? 10);
   const hashedPassword = await bcrypt.hash(admin.password, saltRounds);


   await this.prisma.$transaction(async (tx) => {
     const user = await tx.user.upsert({
       where: { email: admin.email },
       update: {},
       create: {
         email: admin.email ?? '',
         phoneNumber: admin.phoneNumber ?? '',
         password: hashedPassword,
         name: admin.name ?? 'Admin',
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


       await tx.notificationPermissionClient.create({
         data: {
           userId: user.id,
         },
       });


       this.logger.log(`Client created for ${user.email}`);
     } else {
       this.logger.warn(`Client already exists for ${user.email}`);
     }
   });


   this.logger.log('Seed process completed successfully');
 }
}

