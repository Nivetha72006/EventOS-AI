/*
  Warnings:

  - You are about to drop the column `checklist` on the `Planner` table. All the data in the column will be lost.
  - You are about to drop the column `reminders` on the `Planner` table. All the data in the column will be lost.
  - You are about to drop the column `timeline` on the `Planner` table. All the data in the column will be lost.
  - You are about to drop the column `vendorInstructions` on the `Planner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Planner" DROP COLUMN "checklist",
DROP COLUMN "reminders",
DROP COLUMN "timeline",
DROP COLUMN "vendorInstructions";

-- CreateTable
CREATE TABLE "PlannerTask" (
    "id" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PlannerTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reminderTime" TIMESTAMP(3) NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorInstruction" (
    "id" TEXT NOT NULL,
    "plannerId" TEXT NOT NULL,
    "vendorCategory" "VendorCategory" NOT NULL,
    "instruction" TEXT NOT NULL,

    CONSTRAINT "VendorInstruction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlannerTask" ADD CONSTRAINT "PlannerTask_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "Planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "Planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorInstruction" ADD CONSTRAINT "VendorInstruction_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "Planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
