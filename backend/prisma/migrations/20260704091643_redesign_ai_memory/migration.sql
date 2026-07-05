/*
  Warnings:

  - You are about to drop the column `key` on the `Memory` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Memory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `context` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Made the column `eventId` on table `Memory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Memory" DROP COLUMN "key",
DROP COLUMN "value",
ADD COLUMN     "context" JSONB NOT NULL,
ALTER COLUMN "eventId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Memory_eventId_key" ON "public"."Memory"("eventId");
