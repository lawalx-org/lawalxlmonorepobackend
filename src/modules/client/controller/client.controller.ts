import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { basename, extname, join } from 'path';
import { UploadFileDto } from '../dto/upload-file.dto';


@ApiTags('Client Management')
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
    return this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }


  // -----------------------------------all for file system-----------------------------------

  //create file ------->
  @Post('upload-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '1d3b9943-4b77-4b54-803e-fc6e15e0b396' },
           sheetId: { type: 'string', example: 'a6dd3e9c-1fb1-40e1-a9e6-1cb59cdfa99c' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['userId', 'sheetId', 'file'],
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
          const uniqueName = `${baseName}-${timestamp}-${randomNum}${ext}`;
          cb(null, uniqueName);
        },

      }),
    }),
  )
async uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: UploadFileDto
) {
  const result = await this.clientService.saveFile(file, body.userId, body.sheetId);

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
