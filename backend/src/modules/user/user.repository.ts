import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export class UserRepository {

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        image: true, // Change to image if your schema uses image
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }

}