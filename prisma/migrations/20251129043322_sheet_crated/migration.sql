/*
  Warnings:

  - The values [SHEET_CREATED] on the enum `ActivityActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ActivityActionType_new" AS ENUM ('ASSIGNEE_ADDED', 'ASSIGNEE_REMOVED', 'FILE_ADDED', 'FILE_REMOVED', 'LINK_ADDED', 'LINK_REMOVED', 'DUE_DATE_CHANGED', 'PROGRESS_CHANGED', 'SUBTASK_ADDED', 'SUBTASK_REMOVED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'COMMENT_ADDED', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'TASK_CREATED', 'TASK_COMPLETED', 'GENERAL', 'FILE_CREATED');
ALTER TABLE "public"."activities" ALTER COLUMN "actionType" DROP DEFAULT;
ALTER TABLE "public"."activities" ALTER COLUMN "actionType" TYPE "public"."ActivityActionType_new" USING ("actionType"::text::"public"."ActivityActionType_new");
ALTER TYPE "public"."ActivityActionType" RENAME TO "ActivityActionType_old";
ALTER TYPE "public"."ActivityActionType_new" RENAME TO "ActivityActionType";
DROP TYPE "public"."ActivityActionType_old";
ALTER TABLE "public"."activities" ALTER COLUMN "actionType" SET DEFAULT 'GENERAL';
COMMIT;
