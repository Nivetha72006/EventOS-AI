/*
  Warnings:

  - You are about to drop the column `basePrice` on the `VendorService` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `VendorService` table. All the data in the column will be lost.
  - You are about to drop the column `priceUnit` on the `VendorService` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `VendorService` table. All the data in the column will be lost.
  - Added the required column `city` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxPrice` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minPrice` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `VendorService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `VendorService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."VendorService" DROP CONSTRAINT "VendorService_vendorId_fkey";

-- AlterTable
ALTER TABLE "public"."Vendor" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "maxPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "public"."VendorService" DROP COLUMN "basePrice",
DROP COLUMN "createdAt",
DROP COLUMN "priceUnit",
DROP COLUMN "serviceName",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."VendorService" ADD CONSTRAINT "VendorService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
