-- CreateTable
CREATE TABLE "Planner" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timeline" JSONB NOT NULL,
    "checklist" JSONB NOT NULL,
    "vendorInstructions" JSONB NOT NULL,
    "reminders" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Planner_eventId_key" ON "Planner"("eventId");

-- AddForeignKey
ALTER TABLE "Planner" ADD CONSTRAINT "Planner_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
