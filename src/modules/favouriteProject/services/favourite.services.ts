import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectStatus, SubmittedStatus } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteProjectService {
    constructor(private readonly prisma: PrismaService) { }
    
    async add(userId: string, projectId: string) {

    const project = await this.prisma.project.findUnique({
        where: { id: projectId }
    });
    if (!project) throw new NotFoundException('Project not found');


    const existing = await this.prisma.favoriteProject.findUnique({
        where: { userId_projectId: { userId, projectId } }
    });
    if (existing) throw new BadRequestException('Project already in favorites');


    const count = await this.prisma.favoriteProject.count({ where: { userId } });
    if (count >= 5) throw new BadRequestException('You can add only 5 favorite projects');


    return this.prisma.favoriteProject.create({
        data: { userId, projectId },
    });
}



    async remove(userId: string, projectId: string) {
        return this.prisma.favoriteProject.delete({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
        });
    }

    async myFavorites(userId: string) {
        return this.prisma.favoriteProject.findMany({
            where: { userId },
            include: {
                project: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

}

