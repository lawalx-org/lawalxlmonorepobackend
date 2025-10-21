import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { userBase } from './musermodule';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { EmployeeModule } from 'src/modules/employee/employee.module';

// 👇 Create a central array of modules
const modules = [
  UserModule,
  AuthModule,
  ActivityModule,
  EmployeeModule,
  ...userBase,
];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class StoreModule {}
