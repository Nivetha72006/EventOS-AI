import { Request, Response, NextFunction } from "express";
import service from "./marketplace.service";
import { validateMarketplaceFilters } from "./marketplace.validator";

class MarketplaceController {

  async get(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    try {

      const eventId = req.params.eventId as string;

      const category =
        typeof req.query.category === "string"
          ? req.query.category
          : undefined;

      const minPrice =
        typeof req.query.minPrice === "string"
          ? Number(req.query.minPrice)
          : undefined;

      const maxPrice =
        typeof req.query.maxPrice === "string"
          ? Number(req.query.maxPrice)
          : undefined;

      validateMarketplaceFilters({
        category,
        minPrice,
        maxPrice
      });

      const vendors = await service.getMarketplace(
        eventId,
        {
          category,
          minPrice,
          maxPrice
        }
      );

      res.json(vendors);

    } catch (error) {

      next(error);

    }
  }
}

export default new MarketplaceController();