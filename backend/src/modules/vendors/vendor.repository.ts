import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

class VendorRepository {

  async create(data: Prisma.VendorCreateInput) {
    return prisma.vendor.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.VendorUpdateInput
  ) {
    return prisma.vendor.update({
      where: {
        id,
      },
      data,
    });
  }

  async findByOwner(ownerId: string) {
    return prisma.vendor.findUnique({
      where: {
        ownerId,
      },
      include: {
        services: true,
        portfolios: true,
        availability: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.vendor.findUnique({
      where: {
        id,
      },
      include: {
        services: true,
        portfolios: true,
        availability: true,
      },
    });
  }

  async findAll() {
  return prisma.vendor.findMany({
    include: {
      services: true,
      portfolios: true,
      availability: true,
    },
  });
}

}

export default new VendorRepository();