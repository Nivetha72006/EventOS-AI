import repository from "./vendor.repository";

class VendorService {

  createVendor(data: any) {
    return repository.create(data);
  }

  updateVendor(id: string, data: any) {
    return repository.update(id, data);
  }

  getVendor(ownerId: string) {
    return repository.findByOwner(ownerId);
  }

}

export default new VendorService();