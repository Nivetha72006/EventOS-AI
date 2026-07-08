import { Request, Response, NextFunction } from "express";
import service from "./marketplace.service";

class MarketplaceController {

  async get(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const eventId = req.params.eventId as string;

      const vendors = await service.getMarketplace(eventId);

      res.json(vendors);

    } catch (error) {

      next(error);

    }
  }

}

export default new MarketplaceController();