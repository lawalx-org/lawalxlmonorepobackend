import { Module } from '@nestjs/common';
import { ProgramController } from './controller/program.controller';
import { ProgramService } from './service/program.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
