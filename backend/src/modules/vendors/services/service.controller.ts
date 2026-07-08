import { Request, Response, NextFunction } from "express";
import service from "./service.service";

class VendorServiceController {

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const vendorService = await service.create(req.body);

      res.status(201).json(vendorService);

    } catch (error) {

      next(error);

    }
  }

  async getVendorServices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const vendorId = req.params.vendorId as string;

      const services = await service.getVendorServices(vendorId);

      res.json(services);

    } catch (error) {

      next(error);

    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = req.params.id as string;

      const updated = await service.update(
        id,
        req.body
      );

      res.json(updated);

    } catch (error) {

      next(error);

    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = req.params.id as string;

      await service.delete(id);

      res.json({
        message: "Service deleted successfully"
      });

    } catch (error) {

      next(error);

    }
  }

}

export default new VendorServiceController();