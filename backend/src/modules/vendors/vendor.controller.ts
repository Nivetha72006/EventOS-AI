import { Request, Response } from "express";
import service from "./vendor.service";

class VendorController {

  async create(req: Request, res: Response) {
    try {

      const vendor = await service.createVendor(req.body);

      res.status(201).json(vendor);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  async update(req: Request, res: Response) {
    try {

      const id = req.params.id as string;

      const vendor = await service.updateVendor(
        id,
        req.body
      );

      res.json(vendor);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

  async me(req: Request, res: Response) {
    try {

      const ownerId = req.params.ownerId as string;

      const vendor = await service.getVendor(ownerId);

      res.json(vendor);

    } catch (error: any) {

      res.status(400).json({
        message: error.message,
      });

    }
  }

}

export default new VendorController();