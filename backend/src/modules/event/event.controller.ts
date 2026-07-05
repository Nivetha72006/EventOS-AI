import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { EventService } from "./event.service";

const service = new EventService();

export class EventController {
  async create(req: AuthRequest, res: Response) {
    try {
      const event = await service.create(req.user!.id, req.body);
      res.status(201).json(event);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const events = await service.getAll(req.user!.id);
      res.json(events);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getOne(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const event = await service.getOne(id);
      res.json(event);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const event = await service.update(id, req.body);
      res.json(event);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await service.delete(id);
      res.json({ message: "Event deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}