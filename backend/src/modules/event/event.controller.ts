import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { EventService } from "./event.service";

const service = new EventService();

export class EventController {

  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const event = await service.create(req.user!.id, req.body);

      res.status(201).json(event);

    } catch (error) {

      next(error);

    }
  }

  async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const events = await service.getAll(req.user!.id);

      res.json(events);

    } catch (error) {

      next(error);

    }
  }

  async getOne(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const event = await service.getOne(id);

      res.json(event);

    } catch (error) {

      next(error);

    }
  }

  async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const event = await service.update(id, req.body);

      res.json(event);

    } catch (error) {

      next(error);

    }
  }

  async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await service.delete(id);

      res.json({
        message: "Event deleted successfully"
      });

    } catch (error) {

      next(error);

    }
  }

}