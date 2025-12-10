/*
  Warnings:

  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientId` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `tags` table. All the data in the column will be lost.
  - The required column `id` was added to the `tags` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programId` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."tags" DROP CONSTRAINT "tags_clientId_fkey";

-- AlterTable
ALTER TABLE "public"."tags" DROP CONSTRAINT "tags_pkey",
DROP COLUMN "clientId",
DROP COLUMN "tags",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "programId" TEXT NOT NULL,
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
