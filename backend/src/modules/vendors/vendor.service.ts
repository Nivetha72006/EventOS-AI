import { Prisma } from "@prisma/client";
import repository from "./vendor.repository";

class VendorService {

  createVendor(data: Prisma.VendorCreateInput) {
    return repository.create(data);
  }

  updateVendor(
    id: string,
    data: Prisma.VendorUpdateInput
  ) {
    return repository.update(id, data);
  }

  getVendor(ownerId: string) {
    return repository.findByOwner(ownerId);
  }

}

export default new VendorService();