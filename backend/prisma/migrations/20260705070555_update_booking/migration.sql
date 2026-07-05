-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING';
