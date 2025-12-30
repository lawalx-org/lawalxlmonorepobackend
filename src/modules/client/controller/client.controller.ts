import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { basename, extname, join } from 'path';
import { UploadFileDto } from '../dto/upload-file.dto';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';


@ApiTags('Client Management')
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }



  //--------------------get all file ----------------->
  @Get('files')
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getFiles(
    @Query('userId') userId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
    @Query('search') search?: string,
  ) {
    const result = await this.clientService.getFiles(userId, Number(skip), Number(take), search);

    return {
      success: true,
      message: search ? `Files filtered by "${search}"` : 'All files fetched successfully',
      data: result,
    };
  }





  @Get()
  async findAll() {
    const result = await this.clientService.findAll();
    return {
      message: "all client retrieve  successfully",
      data: result
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.clientService.findOne(id);
    return {
      message: "single  client retrieve  successfully",
      data: result
    }
  }


  // -----------------------------------all for file system-----------------------------------

  //create file ------->
  @Post('upload-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sheetId: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['sheetId', 'file'],
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const fileType = file.mimetype?.split('/')[1] || 'other';
        const uploadDir = join(process.cwd(), 'uploads-file', fileType);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        const base = basename(file.originalname, ext);
        cb(null, `${base}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
      },
    }),
  }))
  async uploadFile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto
  ) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ??
      req.ip ??
      req.socket.remoteAddress ??
      null;
    ;

    const result = await this.clientService.saveFile(
      file,
      userId,
      body.sheetId,
      ipAddress
    );

    return {
      message: 'File uploaded successfully',
      data: result,
    };
  }






  //--------------------update file ------------>
  @Patch('file/:id')
  @ApiParam({ name: 'id', required: true, description: 'File ID to update' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const fileType = file.mimetype.split('/')[1];
          const uploadDir = join(process.cwd(), 'uploads-file', fileType);
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const randomNum = Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const baseName = basename(file.originalname, ext);
          cb(null, `${baseName}-${timestamp}-${randomNum}${ext}`);
        },
      }),
    }),
  )
  async updateFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const result = await this.clientService.updateFile(id, file);
    return {
      message: 'File updated successfully',
      data: result
    };
  }



  // delete file 
  @Delete('file/:id')
  @ApiParam({ name: 'id', description: 'ID of the file to delete' })
  async deleteFile(@Param('id') id: string) {
    const result = await this.clientService.deleteFiles(id);
    return {
      statusCode: 200,
      success: true,
      data: result,
    };
  }


}
