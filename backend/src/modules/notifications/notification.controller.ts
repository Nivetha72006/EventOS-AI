import { Request, Response, NextFunction } from "express";
import { NotificationType } from "@prisma/client";
import service from "./notification.service";

class NotificationController {

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const notification = await service.createNotification(
        req.body,
        NotificationType.GENERAL
      );

      res.status(201).json(notification);

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

      const userId = Array.isArray(req.params.userId)
        ? req.params.userId[0]
        : req.params.userId;

      const notifications = await service.getNotifications(userId);

      res.json(notifications);

    } catch (error) {
      next(error);
    }
  }

  async read(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const notification = await service.markRead(id);

      res.json(notification);

    } catch (error) {
      next(error);
    }
  }

}

export default new NotificationController();