import { MemoryType, Prisma } from "@prisma/client";

export interface CreateMemoryDto {
  userId: string;
  eventId: string;
  type: MemoryType;
  context: Prisma.InputJsonValue;
}