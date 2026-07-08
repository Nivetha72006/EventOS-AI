import prisma from "../../../config/prisma";
import { Prisma } from "@prisma/client";

class VendorServiceRepository {

  create(data: Prisma.VendorServiceCreateInput) {
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

  update(
    id: string,
    data: Prisma.VendorServiceUpdateInput
  ) {
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