import { Request, Response } from "express";
import service from "./booking.service";

class BookingController {

  async create(req: Request, res: Response) {

    const booking = await service.createBooking(
      req.body.userId,
      req.body
    );

    res.status(201).json(booking);

  }

  async getEventBookings(req: Request, res: Response) {

    const eventId = req.params.eventId as string;

    const bookings = await service.getEventBookings(eventId);

    res.json(bookings);

  }

  async getVendorBookings(req: Request, res: Response) {

    const vendorId = req.params.vendorId as string;

    const bookings = await service.getVendorBookings(vendorId);

    res.json(bookings);

  }

}

export default new BookingController();