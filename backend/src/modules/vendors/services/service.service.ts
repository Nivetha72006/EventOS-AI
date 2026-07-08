import { Prisma } from "@prisma/client";
import repository from "./service.repository";

class VendorServiceService {

  create(data: Prisma.VendorServiceCreateInput) {
    return repository.create(data);
  }

  getVendorServices(vendorId: string) {
    return repository.getVendorServices(vendorId);
  }

  update(
    id: string,
    data: Prisma.VendorServiceUpdateInput
  ) {
    return repository.update(id, data);
  }

  delete(id: string) {
    return repository.delete(id);
  }

}

export default new VendorServiceService();