import prisma from "../../config/prisma";

class VendorRepository {

  async create(data: any) {
    return prisma.vendor.create({
      data,
    });
  }

  async update(id: string, data: any) {
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
  return prisma.vendor.findMany();
}

}

export default new VendorRepository();