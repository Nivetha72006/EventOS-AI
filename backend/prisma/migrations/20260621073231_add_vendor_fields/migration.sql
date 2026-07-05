/*
  Warnings:

  - A unique constraint covering the columns `[eventId,recommendedVendorId]` on the table `Recommendation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_eventId_recommendedVendorId_key" ON "public"."Recommendation"("eventId", "recommendedVendorId");
