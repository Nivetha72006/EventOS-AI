import prisma from "../../../config/prisma";
import { CreateMemoryDto } from "./memory.dto";

class MemoryRepository {

  async create(data: CreateMemoryDto) {
    return prisma.memory.create({
      data,
    });
  }

  async getEventMemory(eventId: string) {
    return prisma.memory.findMany({
      where: {
        eventId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

}

export default new MemoryRepository();