-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "public"."viewers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
