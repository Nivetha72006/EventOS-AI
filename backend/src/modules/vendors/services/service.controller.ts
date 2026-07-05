import { Request, Response } from "express";
import service from "./service.service";

class VendorServiceController {

  async create(req: Request, res: Response) {

    const vendorService = await service.create(req.body);

    res.status(201).json(vendorService);

  }

  async getVendorServices(req: Request, res: Response) {

    const vendorId = req.params.vendorId as string;

    const services = await service.getVendorServices(vendorId);

    res.json(services);

  }

  async update(req: Request, res: Response) {

    const id = req.params.id as string;

    const updated = await service.update(
      id,
      req.body
    );

    res.json(updated);

  }

  async delete(req: Request, res: Response) {

    const id = req.params.id as string;

    await service.delete(id);

    res.json({
      message: "Service deleted successfully"
    });

  }

}

export default new VendorServiceController();