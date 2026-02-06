/*
  Warnings:

  - The `UploadData` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "UploadData",
ADD COLUMN     "UploadData" TEXT;

-- DropEnum
DROP TYPE "public"."UploadDate";
