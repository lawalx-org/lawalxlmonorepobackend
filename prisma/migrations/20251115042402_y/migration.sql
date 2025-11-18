/*
  Warnings:

  - Changed the type of `priority` on the `programs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "programs" DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" NOT NULL;
