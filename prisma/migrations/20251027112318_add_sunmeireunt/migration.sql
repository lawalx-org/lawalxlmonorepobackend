-- CreateTable
CREATE TABLE "submission_returns" (
    "id" TEXT NOT NULL,
    "submittedId" TEXT NOT NULL,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_returns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submission_returns_submittedId_key" ON "submission_returns"("submittedId");

-- AddForeignKey
ALTER TABLE "submission_returns" ADD CONSTRAINT "submission_returns_submittedId_fkey" FOREIGN KEY ("submittedId") REFERENCES "Submitted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
