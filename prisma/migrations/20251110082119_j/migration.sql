/*
  Warnings:

  - You are about to drop the column `beforeSubmitData` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `dataReceivedTime` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyuploadData` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `uploadCycle` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `uploadbeforeday` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `weakuploadData` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "beforeSubmitData",
DROP COLUMN "dataReceivedTime",
DROP COLUMN "monthlyuploadData",
DROP COLUMN "uploadCycle",
DROP COLUMN "uploadbeforeday",
DROP COLUMN "weakuploadData";
