/*
  Warnings:

  - A unique constraint covering the columns `[eventId,category]` on the table `EventVendorRequirement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventVendorRequirement_eventId_category_key" ON "EventVendorRequirement"("eventId", "category");
