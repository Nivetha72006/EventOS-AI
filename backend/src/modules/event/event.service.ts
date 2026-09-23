import { Prisma, EventType, VendorCategory } from "@prisma/client";
import { EventRepository } from "./event.repository";
import { CreateEventDTO } from "./event.dto";

const repo = new EventRepository();

export class EventService {

  async create(userId: string, data: CreateEventDTO) {
  const eventData: Prisma.EventCreateInput = {
    title: data.title,

    eventType: data.eventType as EventType,

    eventDate: data.eventDate,

    city: data.city,
    state: data.state,
    country: data.country,

    guestCount: data.guestCount,

    budget: data.budget,

    description: data.description,

    user: {
      connect: {
        id: userId,
      },
    },

    ...(data.requirements && data.requirements.length > 0
      ? {
          requirements: {
            create: data.requirements.map((category) => ({
              category: category as VendorCategory,
            })),
          },
        }
      : {}),
  };

  return repo.create(eventData);
}

  async getAll(userId: string) {
    return repo.findAll(userId);
  }

  async getOne(id: string) {

    const event = await repo.findById(id);

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async update(
    id: string,
    data: Prisma.EventUpdateInput
  ) {

    await this.getOne(id);

    return repo.update(id, data);
  }

  async delete(id: string) {

    await this.getOne(id);

    return repo.delete(id);
  }
}