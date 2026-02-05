/*
  Warnings:

  - You are about to drop the column `rootchartId` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "rootchartId";

-- CreateTable
CREATE TABLE "public"."RootChart" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "RootChart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RootChart" ADD CONSTRAINT "RootChart_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
