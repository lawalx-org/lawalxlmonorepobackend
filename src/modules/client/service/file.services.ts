import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async saveFile(file: Express.Multer.File, userId: string) {
    try {


      const fileType = file.mimetype.split('/')[1];
      const filePath = file.path;
      const publicUrl = `/uploads-file/${fileType}/${file.filename}`;

      console.log('Saving file for userId:', userId);

     
      const result = await this.prisma.file.create({
        data: {
          filename: file.originalname,
          url: publicUrl,
          filePath: filePath,
          fileType: fileType,
          size: file.size,
          userId: userId,
        },
      });

      return { ...result, size: this.formatBytes(file.size) };


    } catch (err) {

      console.error(' eror', err);


      throw new InternalServerErrorException('File upload failed');
    }
  }

  //get all file default by{desc}   if  need=> search  --> file + search by user  and filter by file name and type 

  async getFiles(userId: string, skip = 0, take = 10, search?: string) {
  const where: any = { userId };

  if (search) {
    where.OR = [
      { filename: { contains: search, mode: 'insensitive' } },
      { fileType: { contains: search, mode: 'insensitive' } },
    ];
  }

  const files = await this.prisma.file.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });


  const total = await this.prisma.file.count({ where });

  return { 
    total,
    files
   };
}




  //update file -->>
  async updateFile(fileId: string, file: Express.Multer.File) {
    const existingFile = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!existingFile) throw new NotFoundException('File not found');

    // Delete old file from disk
    if (fs.existsSync(existingFile.filePath)) fs.unlinkSync(existingFile.filePath);

    const fileType = file.mimetype.split('/')[1];
    const publicUrl = `/uploads-file/${fileType}/${file.filename}`;

    const updated = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        filename: file.originalname,
        fileType: fileType,
        filePath: file.path,
        url: publicUrl,
        size: file.size,
      },
    });

    return { ...updated, size: this.formatBytes(file.size) };
  }


  //  Delete 
async deleteFiles(fileIds: string | string[]) {
  const idsArray = Array.isArray(fileIds) ? fileIds : [fileIds];

  const files = await this.prisma.file.findMany({
    where: { id: { in: idsArray } },
  });

  if (files.length === 0) {
    throw new NotFoundException('File(s) not found');
  }

  files.forEach(file => {
    if (fs.existsSync(file.filePath)) fs.unlinkSync(file.filePath);
  });
  await this.prisma.file.deleteMany({ where: { id: { in: idsArray } } });

  return { message: `${files.length} file(s) deleted successfully` };
}

}
