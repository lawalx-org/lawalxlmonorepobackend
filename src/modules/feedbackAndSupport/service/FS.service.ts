import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FSService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Feedback CRUD ---
  async createFeedback(clientId: string, data: any) {
    return this.prisma.feedback.create({
      data: { ...data, clientId },
    });
  }

  async getAllFeedback(clientId: string) {
    return this.prisma.feedback.findMany({ where: { clientId } });
  }

  async deleteFeedback(id: string, clientId: string) {
    return this.prisma.feedback.deleteMany({ where: { id, clientId } });
  }

  async createSupport(clientId: string, data: any) {
    return this.prisma.contactSupport.create({
      data: { ...data, clientId },
    });
  }

  async getAllSupport(clientId: string) {
    return this.prisma.contactSupport.findMany({ where: { clientId } });
  }

  async deleteSupport(id: string, clientId: string) {
    return this.prisma.contactSupport.deleteMany({ where: { id, clientId } });
  }
}