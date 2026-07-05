/*
  Warnings:

  - You are about to drop the column `maxPrice` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `minPrice` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `VendorService` table. All the data in the column will be lost.
  - Added the required column `basePrice` to the `VendorService` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "serviceId" TEXT;

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "preferredColors" JSONB,
ADD COLUMN     "theme" TEXT;

-- AlterTable
ALTER TABLE "public"."Vendor" DROP COLUMN "maxPrice",
DROP COLUMN "minPrice",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "maximumPrice" DOUBLE PRECISION,
ADD COLUMN     "minimumPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."VendorService" DROP COLUMN "price",
ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxGuests" INTEGER,
ADD COLUMN     "minGuests" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."VendorService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
