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
    console.log('request user', req.user);
    const userid = req.user.clientId;
    console.log('user id from token', userid);
    return this.programService.create(createProgramDto, userid!);
  }

  @Get()
  findAll(@Query() query: GetAllProgramsDto) {
    return this.programService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programService.findOne(id);
  }

  @Get(':id/projects')
  findAllProjectsByProgram(
    @Param('id') id: string,
    @Query() query: FindAllProjectsInProgramDto,
  ) {
    return this.programService.findAllProjectsByProgram(id, query);
  }
}
