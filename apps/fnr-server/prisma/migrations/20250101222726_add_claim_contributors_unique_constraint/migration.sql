/*
  Warnings:

  - You are about to drop the `_BaseUserToClaim` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BaseUserToClaim" DROP CONSTRAINT "_BaseUserToClaim_A_fkey";

-- DropForeignKey
ALTER TABLE "_BaseUserToClaim" DROP CONSTRAINT "_BaseUserToClaim_B_fkey";

-- DropTable
DROP TABLE "_BaseUserToClaim";

-- CreateTable
CREATE TABLE "ClaimContributor" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClaimContributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClaimContributor_claimId_idx" ON "ClaimContributor"("claimId");

-- CreateIndex
CREATE INDEX "ClaimContributor_userId_idx" ON "ClaimContributor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimContributor_claimId_userId_key" ON "ClaimContributor"("claimId", "userId");

-- AddForeignKey
ALTER TABLE "ClaimContributor" ADD CONSTRAINT "ClaimContributor_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimContributor" ADD CONSTRAINT "ClaimContributor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
