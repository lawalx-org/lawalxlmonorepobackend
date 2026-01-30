/*
  Warnings:

  - You are about to drop the column `template` on the `programs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."programs" DROP COLUMN "template",
ADD COLUMN     "template_id" TEXT,
ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';

-- CreateTable
CREATE TABLE "public"."templates" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."programs" ADD CONSTRAINT "programs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
