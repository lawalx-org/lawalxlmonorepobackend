import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProjectStatusStack {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectStatusStackGraph(period: 'week' | 'month' | 'year') {


    let datafilter = {} ;
    const now = new Date()

    if(period == 'month'){
      datafilter ={
         gte: new Date(now.getFullYear(), now.getMonth(), 1),
         lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      }
    }

    if(period == 'week'){
        const startWeek = new Date();
        const day = startWeek.getDay()
        startWeek.setDate(startWeek.getDate()-day+1);
        startWeek.setHours(0,0,0,0);

        const endWeek = new Date(startWeek);
        endWeek.setDate(startWeek.getDate()+7)

        datafilter ={ gte:startWeek, lt:endWeek };
            

    }

    if (period == 'year') {
      datafilter ={
        gte: new Date(now.getFullYear(),0,1),
        lt:new Date (now.getFullYear() +1,0,1)
      }
    };

    const totalProject  = await this.prisma.project.count(
      {
        where:{createdAt: datafilter}
      }
    );

    const statusCount = await this.prisma.project.groupBy({
      by:['status'],
      where:{createdAt:datafilter},
      _count:{status:true}
    });

    const response = await statusCount.map((item) =>{
      const count  = item._count.status
      return {
        status:item.status,
        count,
        percentage:totalProject?Number(((count/totalProject)*100).toFixed(2)):0

      }
    });

    return {
      total:totalProject,
      breakdown:response,
      period,
    }


    

  }
}
