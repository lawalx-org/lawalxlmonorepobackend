/*
  Warnings:

  - Added the required column `sheetId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "sheetId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "public"."Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
