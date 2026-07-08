import { Request, Response, NextFunction } from "express";
import service from "./quotation.service";

class QuotationController {

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const quotation = await service.createQuotation(req.body);

      res.status(201).json(quotation);

    } catch (error) {

      next(error);

    }
  }

  async get(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const bookingId = req.params.bookingId as string;

      const quotations = await service.getBookingQuotations(bookingId);

      res.json(quotations);

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

      const quotation = await service.updateStatus(
        id,
        req.body.status
      );

      res.json(quotation);

    } catch (error) {

      next(error);

    }
  }

}

export default new QuotationController();