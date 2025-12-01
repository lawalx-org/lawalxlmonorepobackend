/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { NotificationService } from 'src/modules/notification/service/notification.service';
import { NotificationType } from 'src/modules/notification/dto/create-notification.dto'




@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService
  ) { }

  async findAll() {
    const clients = await this.prisma.client.findMany();
    return clients;
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }


  // -----------------------------------all for file system-----------------------------------
  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  //create file 
  // async saveFile(file: Express.Multer.File, userId: string, sheetId: string) {
  //   try {


  //     const fileType = file.mimetype.split('/')[1];
  //     const filePath = file.path;
  //     const publicUrl = `/uploads-file/${fileType}/${file.filename}`;

  //     // console.log('Saving file for userId:', userId);


  //     const result = await this.prisma.file.create({
  //       data: {
  //         filename: file.originalname,
  //         url: publicUrl,
  //         filePath: filePath,
  //         fileType: fileType,
  //         size: file.size,
  //         userId: userId,
  //         sheetId:sheetId
  //       },
  //     });

  //     return { ...result };


  //   } catch (err) {

  //     console.error(' eror', err);


  //     throw new InternalServerErrorException('File upload failed');
  //   }
  // }

  async saveFile(
    file: Express.Multer.File,
    userId: string,
    sheetId: string
  ) {
    try {

      const sheet = await this.prisma.sheet.findUnique({
        where: { id: sheetId },
        include: {
          project: true, 
        },
      });

      if (!sheet) throw new NotFoundException('Sheet not found');

      const project = sheet.project;


      const fileType = file.mimetype.split('/')[1];
      const filePath = file.path;
      const publicUrl = `/uploads-file/${fileType}/${file.filename}`;

      const createdFile = await this.prisma.file.create({
        data: {
          filename: file.originalname,
          url: publicUrl,
          filePath,
          fileType,
          size: file.size,
          userId,
          sheetId,
        },
      });

      if (!project.managerId) {
        console.log('Project has no manager, skipping notification');
        return createdFile;
      }


      const manager = await this.prisma.manager.findUnique({
        where: { id: project.managerId },
        include: { user: true },
      });

      if (!manager || !manager.user) return createdFile;

      const permission = await this.prisma.notificationPermissionManager.findUnique({
        where: { userId: manager.user.id },
      });

      if (!permission || !permission.fileImportByEmployees) {
        console.log(` Manager ${manager.user.id} disabled file notifications`);
        return createdFile;
      }

      await this.notificationService.create(
        {
          receiverIds: [manager.user.id],
          context: `A new file ${createdFile.filename} was uploaded in sheet ${sheet.name} under project ${project.name}.`,
          type: NotificationType.FILE_CREATED,
        },
        userId 
      );

      return createdFile;

    } catch (err) {
      console.error('Error saving file:', err);
      throw new InternalServerErrorException('File upload failed');
    }
  }



  //get file 
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
      include: { sheet: true },
    });

    // Format size for each file before get data
    const formattedFiles = files.map(file => ({
      ...file,
      size: this.formatBytes(file.size),
    }));

    const total = await this.prisma.file.count({ where });

    return {
      total,
      files: formattedFiles,
    };
  }


  //update file -->>
  async updateFile(fileId: string, file: Express.Multer.File, sheetId?: string,) {
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
        sheetId: sheetId ?? existingFile.sheetId,
      },
    });

    return { ...updated };
  }


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
