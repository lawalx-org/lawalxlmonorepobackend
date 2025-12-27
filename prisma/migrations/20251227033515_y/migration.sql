/*
  Warnings:

  - You are about to drop the column `viewerId` on the `projects` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."projects_viewerId_idx";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "viewerId",
ALTER COLUMN "managerId" DROP NOT NULL;
