/*
  Warnings:

  - The values [PENDING,AWAITING_EVIDENCE,AWAITING_QUOTES,APPROVED,REJECTED] on the enum `ItemStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `Quote` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemStatus_new" AS ENUM ('RS', 'NR', 'VPOL', 'OTHER');
ALTER TABLE "Item" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "itemStatus" TYPE "ItemStatus_new" USING ("itemStatus"::text::"ItemStatus_new");
ALTER TYPE "ItemStatus" RENAME TO "ItemStatus_old";
ALTER TYPE "ItemStatus_new" RENAME TO "ItemStatus";
DROP TYPE "ItemStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_supplierId_fkey";

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "itemOrder" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "status",
ADD COLUMN     "itemStatus" "ItemStatus" NOT NULL DEFAULT 'NR';

-- DropTable
DROP TABLE "Quote";
