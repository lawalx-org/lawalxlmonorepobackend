/*
  Warnings:

  - You are about to drop the column `name` on the `InfrastructureNode` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InfrastructureProject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `InfrastructureNode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `InfrastructureNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskName` to the `InfrastructureNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskName` to the `InfrastructureProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."InfrastructureNode" DROP COLUMN "name",
ADD COLUMN     "actualHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "plannedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "plannedHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "plannedResourceCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'NONE',
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "taskName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."InfrastructureProject" DROP COLUMN "name",
ADD COLUMN     "actualHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "finishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "metadata" JSONB DEFAULT '{}',
ADD COLUMN     "plannedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "plannedHour" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "plannedResourceCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'NONE',
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "taskName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."_AssignedProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssignedProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AssignedProject_B_index" ON "public"."_AssignedProject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "InfrastructureNode_slug_key" ON "public"."InfrastructureNode"("slug");

-- CreateIndex
CREATE INDEX "InfrastructureNode_isLeaf_idx" ON "public"."InfrastructureNode"("isLeaf");

-- CreateIndex
CREATE INDEX "InfrastructureNode_slug_id_idx" ON "public"."InfrastructureNode"("slug", "id");

-- AddForeignKey
ALTER TABLE "public"."_AssignedProject" ADD CONSTRAINT "_AssignedProject_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."InfrastructureProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AssignedProject" ADD CONSTRAINT "_AssignedProject_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
