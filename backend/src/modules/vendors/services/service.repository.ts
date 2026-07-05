import prisma from "../../../config/prisma";

class VendorServiceRepository {

  create(data: any) {
    return prisma.vendorService.create({
      data,
    });
  }

  getVendorServices(vendorId: string) {
    return prisma.vendorService.findMany({
      where: {
        vendorId,
      },
    });
  }

  update(id: string, data: any) {
    return prisma.vendorService.update({
      where: {
        id,
      },
      data,
    });
  }

  delete(id: string) {
    return prisma.vendorService.delete({
      where: {
        id,
      },
    });
  }

}

export default new VendorServiceRepository();