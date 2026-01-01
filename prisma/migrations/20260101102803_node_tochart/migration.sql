/*
  Warnings:

  - A unique constraint covering the columns `[nodeChartId]` on the table `InfrastructureNode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."InfrastructureNode" ADD COLUMN     "nodeChartId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "InfrastructureNode_nodeChartId_key" ON "public"."InfrastructureNode"("nodeChartId");

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_nodeChartId_fkey" FOREIGN KEY ("nodeChartId") REFERENCES "public"."ChartTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
