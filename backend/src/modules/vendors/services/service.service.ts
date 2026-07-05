import repository from "./service.repository";

class VendorServiceService {

  create(data: any) {
    return repository.create(data);
  }

  getVendorServices(vendorId: string) {
    return repository.getVendorServices(vendorId);
  }

  update(id: string, data: any) {
    return repository.update(id, data);
  }

  delete(id: string) {
    return repository.delete(id);
  }

}

export default new VendorServiceService();