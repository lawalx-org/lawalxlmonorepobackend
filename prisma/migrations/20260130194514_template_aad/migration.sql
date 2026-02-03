/*
  Warnings:

  - Added the required column `clientId` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "template_id" TEXT;

-- AlterTable
ALTER TABLE "public"."templates" ADD COLUMN     "clientId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."templates" ADD CONSTRAINT "templates_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
