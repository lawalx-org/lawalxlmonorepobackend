/*
  Warnings:

  - You are about to drop the column `skills` on the `managers` table. All the data in the column will be lost.
  - Added the required column `description` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinedDate` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinedDate` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "joinedDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "managers" DROP COLUMN "skills",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "joinedDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
