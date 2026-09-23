/*
  Warnings:

  - Added the required column `type` to the `Memory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('EVENT', 'PLANNER', 'NEGOTIATION', 'DESIGN', 'CHAT');

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "type" "MemoryType" NOT NULL;
