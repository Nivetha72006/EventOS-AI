import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export class EventRepository {

  async create(data: Prisma.EventCreateInput) {

  return prisma.event.create({

    data: {

      title: data.title,

      eventType: data.eventType,

      eventDate: data.eventDate,

      city: data.city,

      state: data.state,

      country: data.country,

      guestCount: data.guestCount,

      budget: data.budget,

      description: data.description,

      theme: data.theme,

      preferredColors: data.preferredColors,

      user: data.user,

      requirements: data.requirements

    },

    include: {

      requirements: true

    }

  });

}

  async findAll(userId: string) {
    return prisma.event.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
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