/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `bookingStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "bookingDate",
DROP COLUMN "bookingStatus",
DROP COLUMN "totalAmount";
