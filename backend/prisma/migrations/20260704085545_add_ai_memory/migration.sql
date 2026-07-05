/*
  Warnings:

  - Added the required column `updatedAt` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `value` on the `Memory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Memory" DROP CONSTRAINT "Memory_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Memory" DROP CONSTRAINT "Memory_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Memory" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Memory" ADD CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Memory" ADD CONSTRAINT "Memory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
