import { Request, Response } from "express";
import service from "./marketplace.service";

class MarketplaceController {

  async get(req: Request, res: Response) {

    const eventId = req.params.eventId as string;

    const vendors = await service.getMarketplace(eventId);

    res.json(vendors);

  }

}

export default new MarketplaceController();