import prisma from "../../../config/prisma";
import { Prisma } from "@prisma/client";

export class MemoryRepository {

  async create(data: Prisma.MemoryCreateInput) {
    return prisma.memory.create({
      data,
    });
  }

  async get(eventId: string) {
    return prisma.memory.findUnique({
      where: {
        eventId,
      },
    });
  }

  async update(
    eventId: string,
    context: Prisma.InputJsonValue
  ) {
    return prisma.memory.update({
      where: {
        eventId,
      },
      data: {
        context,
      },
    });
  }

  async delete(eventId: string) {
    return prisma.memory.delete({
      where: {
        eventId,
      },
    });
  }

}