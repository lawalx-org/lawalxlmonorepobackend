import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProgramService } from '../service/program.service';
import { CreateProgramDto } from '../dto/create-program.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { GetAllProgramsDto } from '../dto/get-all-programs.dto';
import { FindAllProjectsInProgramDto } from '../dto/find-all-projects-in-program.dto';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Post()
  create(
    @Body() createProgramDto: CreateProgramDto,
    @Req() req: RequestWithUser,
  ) {
    
    const userid = req.user.clientId;
    
    return this.programService.create(createProgramDto, userid!);
  }

  @Get()
  findAll(@Query() query: GetAllProgramsDto) {
    
    const data = this.programService.findAll(query);
    
return {
      message: 'Programs fetched successfully',
      data,
    }
  }

  @Get(':id')
 async findOne(@Param('id') id: string) {
     const data = await this.programService.findOne(id);
     return {
      message: 'Program fetched successfully',
      data,
     }
    
  }

  @Get(':id/projects')
 async findAllProjectsByProgram(
    @Param('id') id: string,
    @Query() query: FindAllProjectsInProgramDto,
  ) {
    const data = await this.programService.findAllProjectsByProgram(id, query);
    return {
      message: 'Projects fetched successfully',
      data,
    }
    
  }
}
