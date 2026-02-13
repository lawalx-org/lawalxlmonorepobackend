/*
  Warnings:

  - The primary key for the `ChartTable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `ChartTable` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `grouptitle` to the `ChartTable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `charttableId` to the `Valuediteact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChartTable" DROP CONSTRAINT "ChartTable_pkey",
ADD COLUMN     "grouptitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Valuediteact" ADD COLUMN     "charttableId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Chartnumber" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Chartnumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_id_key" ON "public"."ChartTable"("id");
