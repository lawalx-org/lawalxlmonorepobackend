/*
  Warnings:

  - You are about to drop the column `deadline` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `projectCompleteDate` on the `projects` table. All the data in the column will be lost.
  - Made the column `managerId` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."Share" AS ENUM ('Only_Me', 'Invite_Staff');

-- CreateEnum
CREATE TYPE "public"."UploadCycle" AS ENUM ('Daily', 'Weekly', 'By_Weekly', 'Monthly');

-- CreateEnum
CREATE TYPE "public"."Days" AS ENUM ('Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat');

-- CreateEnum
CREATE TYPE "public"."UploadDate" AS ENUM ('Three', 'Four', 'Five');

-- DropIndex
DROP INDEX "public"."projects_deadline_idx";

-- DropIndex
DROP INDEX "public"."projects_projectCompleteDate_idx";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "deadline",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "projectCompleteDate",
ADD COLUMN     "SelectDays" "public"."Days"[],
ADD COLUMN     "UploadData" "public"."UploadDate",
ADD COLUMN     "dateDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "selectDate" TIMESTAMP(3)[],
ADD COLUMN     "shareWith" "public"."Share" NOT NULL DEFAULT 'Only_Me',
ADD COLUMN     "sortName" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "priority" SET DEFAULT 'MEDIUM',
ALTER COLUMN "managerId" SET NOT NULL;
