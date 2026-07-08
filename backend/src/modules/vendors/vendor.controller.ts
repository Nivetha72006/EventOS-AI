import { Request, Response, NextFunction } from "express";
import service from "./vendor.service";

class VendorController {

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const vendor = await service.createVendor(req.body);

      res.status(201).json(vendor);

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

      const vendor = await service.updateVendor(
        id,
        req.body
      );

      res.json(vendor);

    } catch (error) {

      next(error);

    }
  }

  async me(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const ownerId = req.params.ownerId as string;

      const vendor = await service.getVendor(ownerId);

      res.json(vendor);

    } catch (error) {

      next(error);

    }
  }

}

export default new VendorController();