import { Request, Response } from "express";
import service from "./quotation.service";

class QuotationController {

  async create(req: Request, res: Response) {

    const quotation = await service.createQuotation(req.body);

    res.status(201).json(quotation);

  }

  async get(req: Request, res: Response) {

    const bookingId = req.params.bookingId as string;

    const quotations = await service.getBookingQuotations(bookingId);

    res.json(quotations);

  }

  async update(req: Request, res: Response) {

    const id = req.params.id as string;

    const quotation = await service.updateStatus(
      id,
      req.body.status
    );

    res.json(quotation);

  }

}

export default new QuotationController();