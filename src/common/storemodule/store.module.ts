import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { userBase } from './musermodule';
import { ActivityModule } from 'src/modules/activity/activity.module';
<<<<<<< HEAD
import { EmployeeModule } from 'src/modules/employee/employee.module';
=======
import { SubmittedModule } from 'src/modules/submitted/submitted.module';
>>>>>>> dd05457b77be36f6987ac0270cf6ab0c67a3f42e

// 👇 Create a central array of modules
const modules = [
  UserModule,
  AuthModule,
  ActivityModule,
<<<<<<< HEAD
  EmployeeModule,
=======
  SubmittedModule,
>>>>>>> dd05457b77be36f6987ac0270cf6ab0c67a3f42e
  ...userBase,
];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class StoreModule {}
