-- DropForeignKey
ALTER TABLE "public"."InfrastructureNode" DROP CONSTRAINT "InfrastructureNode_nodeChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InfrastructureNode" DROP CONSTRAINT "InfrastructureNode_parentId_fkey";

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."InfrastructureNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_nodeChartId_fkey" FOREIGN KEY ("nodeChartId") REFERENCES "public"."ChartTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
