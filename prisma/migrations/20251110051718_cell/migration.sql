/*
  Warnings:

  - You are about to drop the column `datetime` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `importFiles` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `importMainFile` on the `projects` table. All the data in the column will be lost.
  - Added the required column `uploadbeforeday` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_EMPLOYEE_ASSIGNED', 'NEW_MANAGER_ASSIGNED');

-- CreateEnum
CREATE TYPE "RepeatInterval" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'COMPLETED';

-- DropForeignKey
ALTER TABLE "public"."Submitted" DROP CONSTRAINT "Submitted_sheetId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "datetime",
DROP COLUMN "importFiles",
DROP COLUMN "importMainFile",
ADD COLUMN     "monthlyuploadData" TEXT[],
ADD COLUMN     "uploadbeforeday" TEXT NOT NULL,
ADD COLUMN     "weakuploadData" TEXT[];

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "nextTriggerAt" TIMESTAMP(3),
    "repeatEvery" "RepeatInterval",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "repeatOnDays" "DayOfWeek"[],
    "repeatOnDates" INTEGER[],
    "remindBefore" INTEGER,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetSnapshot" (
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SheetSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cell_sheetId_row_col_key" ON "Cell"("sheetId", "row", "col");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetSnapshot" ADD CONSTRAINT "SheetSnapshot_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
