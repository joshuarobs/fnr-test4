/*
  Warnings:

  - The `status` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `claimId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STAFF', 'ADMIN', 'SUPPLIER', 'INSURED');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'PENDING_QUOTES', 'APPROVED', 'SETTLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('PENDING', 'AWAITING_EVIDENCE', 'AWAITING_QUOTES', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('PHOTO', 'RECEIPT', 'MANUAL', 'WARRANTY', 'OTHER');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "claimId" INTEGER NOT NULL,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "BaseUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaseUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "baseUserId" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "permissions" TEXT[],

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insured" (
    "id" SERIAL NOT NULL,
    "baseUserId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Insured_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "baseUserId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "serviceType" TEXT[],
    "areas" TEXT[],
    "ratings" DOUBLE PRECISION,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "insuredId" INTEGER NOT NULL,
    "handlerId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'DRAFT',
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "totalClaimed" DOUBLE PRECISION NOT NULL,
    "totalApproved" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "type" "EvidenceType" NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BaseUser_email_key" ON "BaseUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_baseUserId_key" ON "Staff"("baseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_employeeId_key" ON "Staff"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Insured_baseUserId_key" ON "Insured"("baseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_baseUserId_key" ON "Supplier"("baseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_claimNumber_key" ON "Claim"("claimNumber");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_baseUserId_fkey" FOREIGN KEY ("baseUserId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insured" ADD CONSTRAINT "Insured_baseUserId_fkey" FOREIGN KEY ("baseUserId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_baseUserId_fkey" FOREIGN KEY ("baseUserId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_insuredId_fkey" FOREIGN KEY ("insuredId") REFERENCES "Insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
