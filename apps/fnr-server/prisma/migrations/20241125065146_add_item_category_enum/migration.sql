/*
  Warnings:

  - The `category` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('APPLIANCES', 'AUTO', 'BATH', 'CLOTHING', 'DECOR', 'DIGITAL', 'DOCUMENTS', 'ELECTRONICS', 'FOOD', 'FURNITURE', 'GARDEN', 'KIDS', 'OTHER', 'PETS', 'RECREATION', 'STORAGE', 'SUPPLIES', 'TOOLS');

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "category",
ADD COLUMN     "category" "ItemCategory";

-- CreateIndex
CREATE INDEX "Item_category_idx" ON "Item"("category");
