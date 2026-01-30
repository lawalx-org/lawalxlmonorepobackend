/*
  Warnings:

  - You are about to drop the column `userId` on the `programs` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerId` to the `programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `template` to the `programs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."programs" DROP CONSTRAINT "programs_userId_fkey";

-- AlterTable
ALTER TABLE "public"."programs" DROP COLUMN "userId",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "managerId" TEXT NOT NULL,
ADD COLUMN     "template" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."programs" ADD CONSTRAINT "programs_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."managers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."programs" ADD CONSTRAINT "programs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
