/*
  Warnings:

  - The values [COUNTERED] on the enum `NegotiationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bookingId` on the `Negotiation` table. All the data in the column will be lost.
  - You are about to drop the column `counterPrice` on the `Negotiation` table. All the data in the column will be lost.
  - You are about to drop the column `offerPrice` on the `Negotiation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quotationId]` on the table `Negotiation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aiSuggestedAmount` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversation` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotationId` to the `Negotiation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Negotiation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."NegotiationStatus_new" AS ENUM ('STARTED', 'PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');
ALTER TABLE "public"."Negotiation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Negotiation" ALTER COLUMN "status" TYPE "public"."NegotiationStatus_new" USING ("status"::text::"public"."NegotiationStatus_new");
ALTER TYPE "public"."NegotiationStatus" RENAME TO "NegotiationStatus_old";
ALTER TYPE "public"."NegotiationStatus_new" RENAME TO "NegotiationStatus";
DROP TYPE "public"."NegotiationStatus_old";
ALTER TABLE "public"."Negotiation" ALTER COLUMN "status" SET DEFAULT 'STARTED';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Negotiation" DROP CONSTRAINT "Negotiation_bookingId_fkey";

-- AlterTable
ALTER TABLE "public"."Negotiation" DROP COLUMN "bookingId",
DROP COLUMN "counterPrice",
DROP COLUMN "offerPrice",
ADD COLUMN     "aiSuggestedAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "conversation" JSONB NOT NULL,
ADD COLUMN     "finalAmount" DOUBLE PRECISION,
ADD COLUMN     "quotationId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vendorAmount" DOUBLE PRECISION,
ALTER COLUMN "status" SET DEFAULT 'STARTED';

-- AlterTable
ALTER TABLE "public"."Recommendation" ADD COLUMN     "aiScore" DOUBLE PRECISION,
ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "matchReasons" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Negotiation_quotationId_key" ON "public"."Negotiation"("quotationId");

-- AddForeignKey
ALTER TABLE "public"."Negotiation" ADD CONSTRAINT "Negotiation_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "public"."Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
