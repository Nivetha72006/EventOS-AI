import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export class EventRepository {

  async create(data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({
      data,
    });
  }

  async findAll(userId: string) {
    return prisma.event.findMany({
      where: {
        userId,
      },
      orderBy: {
        eventDate: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.event.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.EventUncheckedUpdateInput
  ) {
    return prisma.event.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.event.delete({
      where: {
        id,
      },
    });
  }

}