import { Prisma } from "@prisma/client";
import { EventRepository } from "./event.repository";
import { CreateEventDTO } from "./event.dto";

const repo = new EventRepository();

export class EventService {

  async create(userId: string, data: CreateEventDTO) {
    return repo.create({
      ...data,
      userId,
    });
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