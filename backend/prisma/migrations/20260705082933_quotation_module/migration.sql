/*
  Warnings:

  - You are about to drop the column `discount` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `Quotation` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorId` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."QuotationStatus" AS ENUM ('PENDING', 'NEGOTIATING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "public"."Quotation" DROP CONSTRAINT "Quotation_bookingId_fkey";

-- DropIndex
DROP INDEX "public"."Quotation_bookingId_key";

-- AlterTable
ALTER TABLE "public"."Quotation" DROP COLUMN "discount",
DROP COLUMN "finalPrice",
DROP COLUMN "notes",
DROP COLUMN "originalPrice",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" "public"."QuotationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validTill" TIMESTAMP(3),
ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quotation" ADD CONSTRAINT "Quotation_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
