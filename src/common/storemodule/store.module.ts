import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { userBase } from './musermodule';

// 👇 Create a central array of modules
const modules = [UserModule, AuthModule, ...userBase];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class StoreModule {}
