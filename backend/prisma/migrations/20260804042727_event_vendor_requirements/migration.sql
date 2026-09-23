-- CreateTable
CREATE TABLE "EventVendorRequirement" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "category" "VendorCategory" NOT NULL,

    CONSTRAINT "EventVendorRequirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventVendorRequirement" ADD CONSTRAINT "EventVendorRequirement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
