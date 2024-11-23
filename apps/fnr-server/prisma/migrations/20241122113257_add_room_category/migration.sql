-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('MASTER_BEDROOM', 'BEDROOM_1', 'BEDROOM_2', 'KITCHEN_DINING', 'LIVING_ROOM', 'BATHROOM', 'LAUNDRY', 'OUTDOOR', 'GARDEN', 'GARAGE', 'STORAGE', 'BASEMENT', 'OFFICE_STUDY', 'OTHER');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "roomcategory" "RoomCategory";

-- CreateIndex
CREATE INDEX "Item_roomcategory_idx" ON "Item"("roomcategory");
