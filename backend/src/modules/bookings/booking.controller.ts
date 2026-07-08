import { Request, Response, NextFunction } from "express";
import service from "./booking.service";

class BookingController {

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const booking = await service.createBooking(
        req.body.userId,
        req.body
      );

      res.status(201).json(booking);

    } catch (error) {

      next(error);

    }
  }

  async getEventBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const eventId = req.params.eventId as string;

      const bookings = await service.getEventBookings(eventId);

      res.json(bookings);

    } catch (error) {

      next(error);

    }
  }

  async getVendorBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const vendorId = req.params.vendorId as string;

      const bookings = await service.getVendorBookings(vendorId);

      res.json(bookings);

    } catch (error) {

      next(error);

    }
  }

}

export default new BookingController();