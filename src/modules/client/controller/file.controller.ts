import { Controller, Post, UploadedFile, Body, UseInterceptors, Get, Query, Patch, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';

import { UploadFileDto } from '../dto/upload-file.dto';
import { ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { FileService } from '../service/file.services';

@ApiTags('File Upload')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload-file')
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
          const uniqueName =`${baseName}-${timestamp}-${randomNum}${ext}`;
          cb(null, uniqueName);
        },
        
      }),
    }),
  )
  
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: UploadFileDto) {
    // console.log('id:', body.userId);
    
    const result = await this.fileService.saveFile(file, body.userId);
    return {
      message: 'File uploaded successfully',
      data: result,
    };
  }

   @Get()
  async getFiles(
  @Query('userId') userId: string,
  @Query('skip') skip = 0,
  @Query('take') take = 10,
  @Query('search') search?: string,
) {
  const result = await this.fileService.getFiles(userId,Number(skip),Number(take),search);

  return {
    success: true,
    message: search ? `Files filtered by "${search}"` : 'All files fetched successfully',
    data: result,
  };
}

  
  
  // Update file
  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const fileType = file.mimetype.split('/')[1];
          const uploadDir = join(process.cwd(), 'uploads', fileType);
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
    const result = await this.fileService.updateFile(id, file);
    return {
       message: 'File updated successfully',
        data :result
      };
  }

  @Delete()
  async deleteFileOrFiles(@Body('ids') ids: string | string[]) {
    const result = await this.fileService.deleteFiles(ids);
    return { 
      statusCode: 200, 
      success: true,
       data:result
    };
  }
  
}
