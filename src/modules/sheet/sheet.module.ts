import { Module } from '@nestjs/common';
import { SheetController } from './controller/sheet.controller';
import { SheetService } from './service/sheet.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SheetController],
  providers: [SheetService],
})
export class SheetModule {}
