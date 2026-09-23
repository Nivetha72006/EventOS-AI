/*
  Warnings:

  - You are about to drop the column `userId` on the `Memory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_userId_fkey";

-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "userId";
