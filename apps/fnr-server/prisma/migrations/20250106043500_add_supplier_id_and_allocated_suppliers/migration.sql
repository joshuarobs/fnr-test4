/*
  Warnings:

  - You are about to drop the column `areas` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `ratings` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supplierId]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supplierId` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Supplier_ratings_idx";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "areas",
DROP COLUMN "ratings",
DROP COLUMN "serviceType",
ADD COLUMN     "supplierId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AllocatedSupplier" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllocatedSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AllocatedSupplier_claimId_idx" ON "AllocatedSupplier"("claimId");

-- CreateIndex
CREATE INDEX "AllocatedSupplier_supplierId_idx" ON "AllocatedSupplier"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "AllocatedSupplier_claimId_supplierId_key" ON "AllocatedSupplier"("claimId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplierId_key" ON "Supplier"("supplierId");

-- CreateIndex
CREATE INDEX "Supplier_supplierId_idx" ON "Supplier"("supplierId");

-- AddForeignKey
ALTER TABLE "AllocatedSupplier" ADD CONSTRAINT "AllocatedSupplier_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocatedSupplier" ADD CONSTRAINT "AllocatedSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
