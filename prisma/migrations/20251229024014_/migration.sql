/*
  Warnings:

  - You are about to drop the column `submiteCells` on the `Submitted` table. All the data in the column will be lost.
  - You are about to drop the `Cell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submiteCell` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Cell" DROP CONSTRAINT "Cell_sheetId_fkey";

-- AlterTable
ALTER TABLE "public"."Submitted" DROP COLUMN "submiteCells",
ADD COLUMN     "newSheetId" TEXT;

-- DropTable
DROP TABLE "public"."Cell";

-- DropTable
DROP TABLE "public"."submiteCell";
