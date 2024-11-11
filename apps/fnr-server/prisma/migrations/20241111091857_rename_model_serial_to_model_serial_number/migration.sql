/*
  Warnings:

  - You are about to drop the column `modelSerial` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "modelSerial",
ADD COLUMN     "modelSerialNumber" TEXT;
