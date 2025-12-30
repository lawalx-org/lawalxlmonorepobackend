/*
  Warnings:

  - You are about to drop the column `newSheetId` on the `Submitted` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Submitted" DROP COLUMN "newSheetId",
ADD COLUMN     "submiteCells" TEXT[];

-- CreateTable
CREATE TABLE "public"."Cell" (
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
CREATE TABLE "public"."submiteCell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submiteCell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cell_sheetId_row_col_key" ON "public"."Cell"("sheetId", "row", "col");

-- AddForeignKey
ALTER TABLE "public"."Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "public"."Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
